import { Pool } from "@neondatabase/serverless"

const pool = new Pool({ connectionString: process.env.DATABASE_URL })

function log(title, ok, details = "") {
  console.log(`[CRUD] ${title}: ${ok ? "OK" : "FAIL"}${details ? " - " + details : ""}`)
}

async function main() {
  try {
    await pool.query("SET app.user_role = 'admin'")

    // Posts
    const slug = `crud-post-${Date.now().toString(36).slice(-6)}`
    await pool.query(
      `INSERT INTO posts (title, content, excerpt, type, status, published, slug, add_to_calendar, calendar_date, user_id, created_at, updated_at)
       VALUES ('CRUD Test Post','Treść','Opis','aktualnosci','draft',false,$1,false,NULL,'system',NOW(),NOW())`,
      [slug],
    )
    log("Posts create", true)
    await pool.query(`UPDATE posts SET status='published', published=true WHERE slug=$1`, [slug])
    log("Posts update", true)
    await pool.query(`DELETE FROM posts WHERE slug=$1`, [slug])
    log("Posts delete", true)

    // Galleries + images
    const gslug = `crud-gallery-${Date.now().toString(36).slice(-6)}`
    const g = await pool.query(
      `INSERT INTO galleries (title, description, category, cover_image_url, status, slug, created_at)
       VALUES ('CRUD Gallery','Desc','kids',NULL,'draft',$1,NOW()) RETURNING id`,
      [gslug],
    )
    const gid = g.rows[0].id
    log("Gallery create", true)
    await pool.query(
      `INSERT INTO gallery_images (gallery_id, image_url, title, sort_order, created_at)
       VALUES ($1,'https://example.com/img.jpg','Img',0,NOW())`,
      [gid],
    )
    log("Gallery image add", true)
    await pool.query(`UPDATE galleries SET status='published' WHERE id=$1`, [gid])
    log("Gallery update", true)
    await pool.query(`DELETE FROM gallery_images WHERE gallery_id=$1`, [gid])
    await pool.query(`DELETE FROM galleries WHERE id=$1`, [gid])
    log("Gallery delete", true)

    // Media
    const m = await pool.query(
      `INSERT INTO media (file_url, file_name, file_type, file_size, category, subcategory, uploaded_by, created_at)
       VALUES ('https://example.com/doc.pdf','doc.pdf','pdf','12345','document',NULL,'system',NOW()) RETURNING id`,
    )
    const mid = m.rows[0].id
    log("Media create", true)
    await pool.query(`DELETE FROM media WHERE id=$1`, [mid])
    log("Media delete", true)

    // Groups (safe update and revert)
    const grp = await pool.query(`SELECT teacher_name FROM groups WHERE slug='czerwona' LIMIT 1`)
    if (grp.rows.length) {
      const orig = grp.rows[0].teacher_name || null
      await pool.query(`UPDATE groups SET teacher_name='Test Teacher' WHERE slug='czerwona'`)
      log("Groups update", true)
      await pool.query(`UPDATE groups SET teacher_name=$1 WHERE slug='czerwona'`, [orig])
      log("Groups revert", true)
    } else {
      log("Groups update", false, "group 'czerwona' not found")
    }

    // Meal plan
    const mp = await pool.query(
      `INSERT INTO meal_plans (week_start, week_end, pdf_url, image_url, uploaded_by, created_at)
       VALUES (NOW(), NOW() + interval '7 days', '/documents/jadlospis.pdf', NULL, 'system', NOW()) RETURNING id`,
    )
    const mpid = mp.rows[0].id
    log("Meal plan create", true)
    await pool.query(`UPDATE meal_plans SET is_current=false`)
    await pool.query(`UPDATE meal_plans SET is_current=true WHERE id=$1`, [mpid])
    log("Meal plan set current", true)
    await pool.query(`DELETE FROM meal_plans WHERE id=$1`, [mpid])
    log("Meal plan delete", true)

    // Rada Rodziców: document and post
    const rrDoc = await pool.query(
      `INSERT INTO rada_rodzicow_documents (title, url, display_order, created_at)
       VALUES ('CRUD RR Doc','/documents/rr-doc.pdf',10,NOW()) RETURNING id`,
    )
    const rrid = rrDoc.rows[0].id
    log("RR document create", true)
    await pool.query(`DELETE FROM rada_rodzicow_documents WHERE id=$1`, [rrid])
    log("RR document delete", true)
    const rrPostSlug = `rr-post-${Date.now().toString(36).slice(-6)}`
    await pool.query(
      `INSERT INTO posts (title, content, excerpt, type, status, published, slug, user_id, created_at, updated_at)
       VALUES ('RR Post','Treść','Opis','rada-rodzicow','published',true,$1,'system',NOW(),NOW())`,
      [rrPostSlug],
    )
    log("RR post create", true)
    await pool.query(`DELETE FROM posts WHERE slug=$1`, [rrPostSlug])
    log("RR post delete", true)

    console.log("[CRUD] All tests completed")
  } catch (e) {
    console.error("CRUD tests failed:", e)
    process.exit(1)
  }
}

await main()

