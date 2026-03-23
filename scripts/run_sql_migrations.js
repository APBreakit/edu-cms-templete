const { neon } = require("@neondatabase/serverless")
const fs = require("fs")
const path = require("path")

// Execute the migrations
async function runMigrations() {
  console.log("[Migration] Starting SQL migrations...")

  if (!process.env.DATABASE_URL) {
    console.error("[Migration] Error: DATABASE_URL environment variable is not set.")
    process.exit(1)
  }

  const sql = neon(process.env.DATABASE_URL)

  const files = ["scripts/003_add_all_group_fields.sql"]

  for (const file of files) {
    try {
      const filePath = path.join(process.cwd(), file)
      if (!fs.existsSync(filePath)) {
        console.error(`[Migration] File not found: ${file}`)
        continue
      }

      console.log(`[Migration] Executing ${file}...`)
      const sqlContent = fs.readFileSync(filePath, "utf8")

      // Split by semicolon to handle multiple statements if supported by the driver,
      // but neon serverless usually handles the whole block.
      // However, for safety with transactions/mixed statements, we'll try executing the whole file.
      // If it fails on multiple statements, we might need to split.
      // Simple split by ';' can be risky if semicolons are in strings.
      // Let's try executing the full content first.

      await sql.unsafe(sqlContent)
      console.log(`[Migration] Successfully executed ${file}`)
    } catch (error) {
      console.error(`[Migration] Failed to execute ${file}:`, error)
      // We don't exit here to try the next file if possible,
      // but usually migrations depend on each other.
      // For these specific scripts (adding columns, updating policies), they are somewhat independent.
    }
  }

  console.log("[Migration] Migration process completed.")
}

runMigrations().catch((err) => {
  console.error("[Migration] Fatal error:", err)
  process.exit(1)
})
