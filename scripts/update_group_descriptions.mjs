import { Pool } from "@neondatabase/serverless"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  await pool.query("SET app.user_role = 'admin'")
  const desc = {
    czerwona: "Energetyczna grupa pełna pasji i radości.",
    lawendowa: "Spokojna, harmonijna i empatyczna.",
    niebieska: "Ciekawość świata i odkrywanie poprzez zabawę.",
    pastelowa: "Delikatna, bezpieczna przestrzeń dla najmłodszych.",
    pomaranczowa: "Twórcza ekspresja: sztuka, muzyka i ruch.",
    turkusowa: "Odkrywcy przyrody i myślenia logicznego.",
    waniliowa: "Ciepło i samodzielność w przyjaznej atmosferze.",
  }
  for (const [slug, description] of Object.entries(desc)) {
    await pool.query("UPDATE groups SET description = $1 WHERE slug = $2", [description, slug])
  }
  const res = await pool.query("SELECT slug, description FROM groups ORDER BY slug")
  console.log(JSON.stringify(res.rows, null, 2))
  await pool.end()
}

await main()

