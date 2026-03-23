import { Pool } from "@neondatabase/serverless"
import bcrypt from "bcryptjs"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  const email = process.env.ADMIN_NEW_EMAIL
  const password = process.env.ADMIN_NEW_PASSWORD
  const name = process.env.ADMIN_NEW_NAME || null
  if (!email || !password) {
    throw new Error("Missing ADMIN_NEW_EMAIL or ADMIN_NEW_PASSWORD env")
  }
  const hash = await bcrypt.hash(password, 10)
  await pool.query("SET app.user_role = 'admin'")
  const existing = await pool.query("SELECT id FROM users WHERE email = $1 LIMIT 1", [email])
  if (existing.rows.length) {
    const id = existing.rows[0].id
    await pool.query("UPDATE users SET password = $1, role = 'admin', name = COALESCE($2, name) WHERE id = $3", [hash, name, id])
    console.log("Updated existing admin:", email)
  } else {
    const res = await pool.query(
      "INSERT INTO users (email, password, name, role, created_at) VALUES ($1, $2, $3, 'admin', NOW()) RETURNING id",
      [email, hash, name]
    )
    const id = res.rows[0].id
    const perms = (process.env.ADMIN_NEW_PERMS || "posts,galleries,groups,calendar,media,rada_rodzicow").split(",").map((s) => s.trim()).filter(Boolean)
    for (const section of perms) {
      await pool.query("INSERT INTO admin_permissions (user_id, section) VALUES ($1, $2) ON CONFLICT DO NOTHING", [id, section])
    }
    console.log("Created admin:", email, "with permissions:", perms.join(", "))
  }
  await pool.end()
}

await main()

