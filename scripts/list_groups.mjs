import dotenv from "dotenv";
import { neon } from "@neondatabase/serverless";

dotenv.config({ path: ".env.local" });

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is not set");
  process.exit(1);
}

const sql = neon(process.env.DATABASE_URL);

async function listGroups() {
  try {
    const groups = await sql`SELECT * FROM groups`;
    console.log("Groups:", groups);
  } catch (error) {
    console.error("Error fetching groups:", error);
  }
}

listGroups();
