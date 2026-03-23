
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function listGalleries() {
  try {
    const galleries = await sql`SELECT * FROM galleries WHERE status = 'published' LIMIT 5`;
    console.log("Galleries:", galleries);
    
    if (galleries.length > 0) {
        const slug = galleries[0].slug;
        console.log(`Testing with slug: ${slug}`);
        
        const gallery = galleries[0];
        const images = await sql`
            SELECT * FROM gallery_images WHERE gallery_id = ${gallery.id}
        `;
        console.log(`Images found for gallery ${gallery.id}:`, images.length);
        console.log("First image:", images[0]);
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

listGalleries();
