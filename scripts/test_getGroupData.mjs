import dotenv from "dotenv";
dotenv.config({ path: ".env.local" });

import pkg from "../lib/db/index.js";
const { sql } = pkg;

async function testGetGroupData() {
  try {
    console.log("Fetching all groups...");
    const groups = await sql`SELECT * FROM groups`;
    console.log("Found groups:", groups.map(g => ({ slug: g.slug, name: g.name })));

    if (groups.length > 0) {
      const slug = groups[0].slug;
      console.log(`\nTesting fetch for group slug: ${slug}`);
      
      const group = await sql`
        SELECT * FROM groups WHERE slug = ${slug} LIMIT 1
      `;
      console.log("Group data:", group[0]);

      // Check related galleries
      const categorySlug = `grupa-${slug}`;
      console.log(`\nChecking galleries for category: ${categorySlug}`);
      const galleries = await sql`
        SELECT g.* FROM galleries g
        WHERE g.status = 'published' AND EXISTS (
          SELECT 1 FROM gallery_category_links l WHERE l.gallery_id = g.id AND l.category_slug = ${categorySlug}
        )
      `;
      console.log(`Found ${galleries.length} galleries.`);
    } else {
      console.log("No groups found in database.");
    }

  } catch (error) {
    console.error("Error testing group data:", error);
  }
}

testGetGroupData();
