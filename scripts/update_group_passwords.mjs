import { Pool } from "@neondatabase/serverless"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  await pool.query("SET app.user_role = 'admin'")
  await pool.query("DELETE FROM groups WHERE slug = $1", ["fioletowa"]) // remove Fioletowa
  await pool.query("UPDATE groups SET password = slug") // set default password to slug
  const res = await pool.query("SELECT name, slug, password FROM groups ORDER BY name ASC")
  console.log(JSON.stringify(res.rows, null, 2))
  await pool.end()
}

await main()

