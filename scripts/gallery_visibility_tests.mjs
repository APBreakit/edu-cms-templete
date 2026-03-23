import { neon } from "@neondatabase/serverless"
import dotenv from "dotenv"
dotenv.config({ path: '.env.local' })

async function main() {
  const dbUrl = process.env.DATABASE_URL
  if (!dbUrl) {
    console.error("DATABASE_URL is not set")
    process.exit(1)
  }
  const sql = neon(dbUrl)

  const published = await sql`
    SELECT id, slug FROM galleries WHERE status = 'published'
  `
  const groupGalleries = await sql`
    SELECT g.id, g.slug
    FROM galleries g
    WHERE g.status = 'published' AND EXISTS (
      SELECT 1 FROM gallery_category_links l WHERE l.gallery_id = g.id AND l.category_slug LIKE 'grupa-%'
    )
  `
  const publicList = await sql`
    SELECT g.slug FROM galleries g
    WHERE g.status = 'published' AND (
      NOT EXISTS (SELECT 1 FROM gallery_category_links l WHERE l.gallery_id = g.id)
      OR EXISTS (
        SELECT 1 FROM gallery_category_links l
        LEFT JOIN gallery_categories c ON c.slug = l.category_slug
        WHERE l.gallery_id = g.id AND (c.visible = true OR c.id IS NULL) AND l.category_slug NOT LIKE 'grupa-%'
      )
    )
  `

  const groupSlugs = new Set(groupGalleries.map((g) => g.slug))
  const publicSlugs = new Set(publicList.map((g) => g.slug))

  let ok = true
  for (const s of groupSlugs) {
    if (publicSlugs.has(s)) {
      ok = false
      console.error(`[FAIL] Group gallery '${s}' appears in public list`)
    }
  }

  if (ok) {
    console.log(`[PASS] Public list excludes group galleries (${groupSlugs.size} checked)`) 
  }

  console.log(`[INFO] Published galleries: ${published.length}`)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
