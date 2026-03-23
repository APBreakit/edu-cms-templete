import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function testQueries() {
  try {
    console.log("Testing galleries table...");
    const galleries = await sql`SELECT * FROM galleries WHERE status = 'published' LIMIT 5`;
    console.log("Galleries:", galleries);

    console.log("Testing gallery_images table...");
    const images = await sql`SELECT * FROM gallery_images ORDER BY created_at DESC LIMIT 5`;
    console.log("Gallery Images:", images);
  } catch (error) {
    console.error("Error executing queries:", error);
  }
}

testQueries();