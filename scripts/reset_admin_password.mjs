import { Pool } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL env missing")
  }
  const pwd = process.env.ADMIN_RESET_PASSWORD || "EduCMS#Nazaret2025"
  const email = process.env.ADMIN_RESET_EMAIL || "admin@educms-szablon.pl"
  const hash = await bcrypt.hash(pwd, 10)
  await pool.query("SET app.user_role = 'admin'")
  await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hash, email])
  await pool.query("UPDATE users SET role = 'superadmin' WHERE email = $1", [email])
  const res = await pool.query("SELECT email, role FROM users WHERE email = $1", [email])
  console.log("Updated:", res.rows[0])
  await pool.end()
}

await main()

