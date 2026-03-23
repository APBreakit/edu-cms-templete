import type { MetadataRoute } from "next"
import { sql } from "@/lib/db"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://educms-szablon.pl"
  const staticEntries: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/o-nas`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/rekrutacja`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/aktualnosci`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/ogloszenia`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/galeria`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${baseUrl}/kontakt`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/bip`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
  ]

  try {
    const galleries = await sql`
      SELECT slug, updated_at FROM galleries WHERE status = 'published' AND (
        NOT EXISTS (SELECT 1 FROM gallery_category_links l WHERE l.gallery_id = galleries.id)
        OR EXISTS (
          SELECT 1 FROM gallery_category_links l
          LEFT JOIN gallery_categories c ON c.slug = l.category_slug
          WHERE l.gallery_id = galleries.id AND (c.visible = true OR c.id IS NULL) AND l.category_slug NOT LIKE 'grupa-%'
        )
      )
    `
    const galleryEntries: MetadataRoute.Sitemap = (galleries || []).map((g: any) => ({
      url: `${baseUrl}/galeria/${g.slug}`,
      lastModified: g.updated_at ? new Date(g.updated_at) : new Date(),
      changeFrequency: "weekly",
      priority: 0.6,
    }))
    return staticEntries.concat(galleryEntries)
  } catch {
    return staticEntries
  }
}
