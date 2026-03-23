import { Pool } from "@neondatabase/serverless"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  const colors = {
    czerwona: "from-red-500 to-red-600",
    pomaranczowa: "from-orange-500 to-orange-600",
    turkusowa: "from-teal-500 to-teal-600",
    lawendowa: "from-purple-400 to-purple-500",
    pastelowa: "from-pink-300 to-pink-400",
    waniliowa: "from-amber-200 to-amber-300",
    zielona: "from-green-500 to-green-600",
    niebieska: "from-blue-500 to-blue-600",
  }
  await pool.query("SET app.user_role = 'admin'")
  for (const [slug, color] of Object.entries(colors)) {
    await pool.query("UPDATE groups SET color = $1 WHERE slug = $2", [color, slug])
  }
  const res = await pool.query("SELECT name, slug, color FROM groups ORDER BY name ASC")
  console.log(JSON.stringify(res.rows, null, 2))
  await pool.end()
}

await main()

