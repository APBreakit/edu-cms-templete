import { Pool } from "@neondatabase/serverless"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  await pool.query("SET app.user_role = 'admin'")
  await pool.query("DELETE FROM groups WHERE slug = $1", ["zielona"]) 
  await pool.query("DELETE FROM groups WHERE slug = $1", ["zolta"]) 
  const res = await pool.query("SELECT slug FROM groups ORDER BY slug")
  console.log(JSON.stringify(res.rows, null, 2))
  await pool.end()
}

await main()

