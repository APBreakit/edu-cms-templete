const { neon } = require("@neondatabase/serverless")
const bcrypt = require("bcryptjs") // Assuming bcryptjs is available or we'll use a simple hash for now if not

const sql = neon(process.env.DATABASE_URL)

async function main() {
  console.log("Seeding initial data...")

  try {
    // 1. Create Admin User
    // Password: 'password123' (hashed)
    const hashedPassword = await bcrypt.hash("password123", 10)

    await sql`
      INSERT INTO users (email, password, name, role)
      VALUES ('admin@educms-szablon.pl', ${hashedPassword}, 'Administrator', 'admin')
      ON CONFLICT (email) DO NOTHING
    `
    console.log("Admin user seeded.")

    // 2. Seed Groups
    const groups = [
      { name: "Grupa Niebieska", slug: "niebieska", color: "#3b82f6" },
      { name: "Grupa Zielona", slug: "zielona", color: "#22c55e" },
      { name: "Grupa Czerwona", slug: "czerwona", color: "#ef4444" },
      { name: "Grupa Żółta", slug: "zolta", color: "#eab308" }, // Assuming yellow exists or mapped to waniliowa/etc
      { name: "Grupa Pomarańczowa", slug: "pomaranczowa", color: "#f97316" },
      { name: "Grupa Fioletowa", slug: "fioletowa", color: "#a855f7" }, // mapped to lawendowa?
      { name: "Grupa Turkusowa", slug: "turkusowa", color: "#14b8a6" },
      { name: "Grupa Pastelowa", slug: "pastelowa", color: "#f472b6" },
      { name: "Grupa Waniliowa", slug: "waniliowa", color: "#fde047" },
      { name: "Grupa Lawendowa", slug: "lawendowa", color: "#8b5cf6" },
    ]

    for (const g of groups) {
      await sql`
        INSERT INTO groups (name, slug, color)
        VALUES (${g.name}, ${g.slug}, ${g.color})
        ON CONFLICT (slug) DO NOTHING
      `
    }
    console.log("Groups seeded.")

    // 3. Seed Posts and Events
    await sql`
      INSERT INTO posts (title, content, excerpt, type, status, published, slug)
      VALUES ('Przykładowa Aktualność', '<p>To jest przykładowa aktualność demonstracyjna.</p>', 'Krótki opis aktualności.', 'aktualnosci', 'published', true, 'przykladowa-aktualnosc')
      ON CONFLICT (slug) DO NOTHING
    `
    await sql`
      INSERT INTO posts (title, content, excerpt, type, status, published, slug, add_to_calendar, calendar_date)
      VALUES ('Przykładowe Wydarzenie', '<p>To jest przykładowe wydarzenie w kalendarzu.</p>', 'Opis wydarzenia.', 'ogloszenia', 'published', true, 'przykladowe-wydarzenie', true, NOW() + INTERVAL '2 days')
      ON CONFLICT (slug) DO NOTHING
    `
    console.log("Posts and Events seeded.")

    // 4. Seed Gallery
    await sql`
      INSERT INTO galleries (title, slug, description, is_public, cover_image)
      VALUES ('Wiosenny Spacer', 'wiosenny-spacer', 'Zdjęcia z wiosennego spaceru grupy.', true, '/placeholder.jpg')
      ON CONFLICT (slug) DO NOTHING
    `
    console.log("Gallery seeded.")

    console.log("Seeding completed successfully!")
  } catch (error) {
    console.error("Seeding failed:", error)
  }
}

main()
