
import { neon } from "@neondatabase/serverless";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const sql = neon(process.env.DATABASE_URL);

async function listGroups() {
  try {
    const groups = await sql`SELECT * FROM groups LIMIT 5`;
    console.log("Groups:", groups);
  } catch (error) {
    console.error("Error:", error);
  }
}

listGroups();
