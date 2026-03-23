import { Pool } from "@neondatabase/serverless"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

async function main() {
  try {
    await pool.query(
      "SET app.user_role = 'admin'; INSERT INTO posts (title, content, excerpt, type, status, published, slug, image_url, add_to_calendar, calendar_date, calendar_end_date, group_category, user_id, created_at, updated_at) VALUES ('Test Admin Post', 'Treść testowa', 'Krótki opis', 'aktualnosci', 'published', true, 'test-admin-post', NULL, true, NOW() + interval '1 day', NULL, NULL, '5d311540-0195-44ba-afe2-5718b61e9101', NOW(), NOW())"
    )
    await pool.query(
      "SET app.user_role = 'admin'; INSERT INTO posts (title, content, excerpt, type, status, published, slug, image_url, add_to_calendar, calendar_date, calendar_end_date, group_category, user_id, created_at, updated_at) VALUES ('Test Rada Rodziców Post', 'Treść RR', 'Opis RR', 'rada-rodzicow', 'published', true, 'test-rr-post', NULL, false, NULL, NULL, NULL, '5d311540-0195-44ba-afe2-5718b61e9101', NOW(), NOW())"
    )
    console.log("Inserted test posts")
  } catch (e) {
    console.error("Insert failed:", e)
    process.exit(1)
  }
}

await main()

