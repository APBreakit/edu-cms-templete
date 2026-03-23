import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function testGetGroup(slug) {
  try {
    console.log(`Testing fetching group with slug: "${slug}"`);
    const groups = await sql`
      SELECT * FROM groups WHERE slug = ${slug} LIMIT 1
    `;
    console.log("Groups found:", groups);
  } catch (error) {
    console.error("Error fetching group:", error);
  }
}

testGetGroup("czerwona");
testGetGroup("nonexistent");
