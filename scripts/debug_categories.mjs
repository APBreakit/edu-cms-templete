
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function listCategories() {
  try {
    const categories = await sql`SELECT * FROM gallery_categories WHERE slug LIKE 'grupa-%'`;
    console.log("Group Categories:", categories);
    
    const links = await sql`SELECT * FROM gallery_category_links LIMIT 5`;
    console.log("Sample Links:", links);
  } catch (error) {
    console.error("Error:", error);
  }
}

listCategories();
