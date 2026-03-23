"use server"

import { sql } from "@/lib/db"
import type { Post, Group, Gallery, GalleryImage, MealPlan, Media } from "@/lib/db/types"
import { revalidatePath } from "next/cache"
import { getSession } from "@/lib/auth"
import bcrypt from "bcryptjs"

async function hasPermission(userId: string, section: string) {
  const rows = await sql`
    SELECT true as exists FROM admin_permissions WHERE user_id = ${userId} AND (section = ${section} OR section = 'all') LIMIT 1
  `
  if (rows.length > 0) return true
  const userRole = await sql`
    SELECT role FROM users WHERE id = ${userId} LIMIT 1
  `
  return ['admin', 'superadmin'].includes((userRole[0]?.role || ''))
}

function slugify(input: string) {
  const map: Record<string, string> = {
    ą: "a",
    ć: "c",
    ę: "e",
    ł: "l",
    ń: "n",
    ó: "o",
    ś: "s",
    ź: "z",
    ż: "z",
  }
  return input
    .toLowerCase()
    .split("")
    .map((ch) => map[ch] || ch)
    .join("")
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

// Posts Actions
export async function getPosts(type?: string) {
  if (type) {
    return await sql`
      SELECT * FROM posts WHERE type = ${type} ORDER BY created_at DESC
    `
  }
  return await sql`
    SELECT * FROM posts ORDER BY created_at DESC
  `
}

export async function getPost(id: string) {
  const posts = await sql`
    SELECT * FROM posts WHERE id = ${id} LIMIT 1
  `
  return posts[0]
}

export async function createPost(data: any) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'posts'))) {
      return { success: false, error: "Forbidden" }
    }
    if (!data.title) {
      return { success: false, error: "Title is required" }
    }
    if (!data.content) {
      return { success: false, error: "Content is required" }
    }
    const allowedTypes = ["aktualnosci", "ogloszenia", "konkursy", "rada-rodzicow", "okiem-specjalisty"]
    if (!allowedTypes.includes(String(data.type))) {
      return { success: false, error: "Invalid type" }
    }
    if (data.add_to_calendar && !data.calendar_date) {
      return { success: false, error: "Calendar date required" }
    }
    if (data.group_category) {
      const gexists = await sql`SELECT 1 FROM groups WHERE slug = ${data.group_category} LIMIT 1`
      if (!gexists[0]) {
        return { success: false, error: "Invalid group" }
      }
    }
    const slug = data.slug || slugify(data.title)
    const calendarDate = data.calendar_date ? new Date(data.calendar_date) : null
    const calendarEndDate = data.calendar_end_date ? new Date(data.calendar_end_date) : null
    const competitionStart = data.competition_start_date ? new Date(data.competition_start_date) : null
    const competitionEnd = data.competition_end_date ? new Date(data.competition_end_date) : null
    const existing = await sql`
      SELECT true as exists FROM posts WHERE slug = ${slug} LIMIT 1
    `
    const finalSlug = existing[0]?.exists ? `${slug}-${Date.now().toString(36).slice(-4)}` : slug

    await sql`SET app.user_role = 'admin'`
    await sql`
      INSERT INTO posts (
        title, content, excerpt, type, status, published, slug, image_url,
        add_to_calendar, calendar_date, calendar_end_date,
        competition_status, competition_start_date, competition_end_date,
        group_category, user_id, created_at, updated_at, images
      ) VALUES (
        ${data.title}, ${data.content}, ${data.excerpt}, ${data.type}, ${data.status}, 
        ${data.published}, ${finalSlug}, ${data.image_url},
        ${data.add_to_calendar}, ${calendarDate}, ${calendarEndDate},
        ${data.competition_status}, ${competitionStart}, ${competitionEnd},
        ${data.group_category}, ${data.user_id}, NOW(), NOW(), ${JSON.stringify(data.images || [])}
      )
    `
    revalidatePath("/admin/posts")
    return { success: true }
  } catch (error) {
    console.error("Create post error:", error)
    return { success: false, error: "Failed to create post" }
  }
}

export async function updatePost(id: string, data: any) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'posts'))) {
      return { success: false, error: "Forbidden" }
    }
    if (!data.title) {
      return { success: false, error: "Title is required" }
    }
    if (!data.content) {
      return { success: false, error: "Content is required" }
    }
    const allowedTypes = ["aktualnosci", "ogloszenia", "konkursy", "rada-rodzicow", "okiem-specjalisty"]
    if (!allowedTypes.includes(String(data.type))) {
      return { success: false, error: "Invalid type" }
    }
    if (data.add_to_calendar && !data.calendar_date) {
      return { success: false, error: "Calendar date required" }
    }
    if (data.group_category) {
      const gexists = await sql`SELECT 1 FROM groups WHERE slug = ${data.group_category} LIMIT 1`
      if (!gexists[0]) {
        return { success: false, error: "Invalid group" }
      }
    }
    const calendarDate = data.calendar_date ? new Date(data.calendar_date) : null
    const calendarEndDate = data.calendar_end_date ? new Date(data.calendar_end_date) : null
    const competitionStart = data.competition_start_date ? new Date(data.competition_start_date) : null
    const competitionEnd = data.competition_end_date ? new Date(data.competition_end_date) : null

    const baseSlug = (data.slug && String(data.slug).trim()) || slugify(String(data.title || ""))
    let finalSlug = baseSlug
    if (finalSlug) {
      const exists = await sql`
        SELECT true as exists FROM posts WHERE slug = ${finalSlug} AND id <> ${id} LIMIT 1
      `
      if (exists[0]?.exists) {
        finalSlug = `${finalSlug}-${Date.now().toString(36).slice(-4)}`
      }
    }
    await sql`SET app.user_role = 'admin'`
    await sql`
      UPDATE posts SET
        title = ${data.title},
        content = ${data.content},
        excerpt = ${data.excerpt},
        type = ${data.type},
        status = ${data.status},
        published = ${data.published},
        slug = ${finalSlug},
        image_url = ${data.image_url},
        add_to_calendar = ${data.add_to_calendar},
        calendar_date = ${calendarDate},
        calendar_end_date = ${calendarEndDate},
        competition_status = ${data.competition_status},
        competition_start_date = ${competitionStart},
        competition_end_date = ${competitionEnd},
        group_category = ${data.group_category},
        images = ${JSON.stringify(data.images || [])},
        published_at = CASE WHEN ${data.status} = 'published' AND published_at IS NULL THEN NOW() ELSE published_at END,
        updated_at = NOW()
      WHERE id = ${id}
    `
    revalidatePath("/admin/posts")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update post" }
  }
}

export async function deletePost(id: string) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'posts'))) {
      return { success: false, error: "Forbidden" }
    }
    await sql`SET app.user_role = 'admin'`
    await sql`DELETE FROM posts WHERE id = ${id}`
    revalidatePath("/admin/posts")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete post" }
  }
}

// Calendar Actions
export async function getCalendarEvents() {
  try {
    const events = await sql`
      SELECT * FROM posts 
      WHERE add_to_calendar = true 
        AND (calendar_date IS NOT NULL OR calendar_end_date IS NOT NULL)
      ORDER BY calendar_date
    `
    return events
  } catch (error) {
    console.error("Error fetching calendar events:", error)
    return []
  }
}

// Groups Actions
export async function getGroups() {
  return await sql`
    SELECT * FROM groups ORDER BY name
  `
}

export async function getGroup(slug: string) {
  const groups = await sql`
    SELECT * FROM groups WHERE slug = ${slug} LIMIT 1
  `
  return groups[0]
}

export async function createGroup(data: { name: string; slug?: string; color?: string; password?: string }) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'groups'))) {
      return { success: false, error: "Forbidden" }
    }
    if (!data.name || String(data.name).trim().length < 2) {
      return { success: false, error: "Name too short" }
    }
    if (data.password && String(data.password).trim().length < 4) {
      return { success: false, error: "Password too short" }
    }
    const baseSlug = (data.slug && String(data.slug).trim()) || slugify(data.name)
    if (!/^[a-z0-9-]+$/.test(baseSlug)) {
      return { success: false, error: "Invalid slug" }
    }
    const exists = await sql`SELECT 1 FROM groups WHERE slug = ${baseSlug} LIMIT 1`
    const finalSlug = exists[0] ? `${baseSlug}-${Date.now().toString(36).slice(-4)}` : baseSlug
    await sql`SET app.user_role = 'admin'`
    await sql`
      INSERT INTO groups (name, slug, color, password, created_at)
      VALUES (${data.name}, ${finalSlug}, ${data.color || null}, ${data.password || null}, NOW())
    `
    revalidatePath('/admin/groups')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to create group' }
  }
}

export async function deleteGroup(slug: string) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'groups'))) {
      return { success: false, error: "Forbidden" }
    }
    await sql`SET app.user_role = 'admin'`
    await sql`DELETE FROM groups WHERE slug = ${slug}`
    revalidatePath('/admin/groups')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to delete group' }
  }
}
export async function updateGroup(slug: string, data: any) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'groups'))) {
      return { success: false, error: "Forbidden" }
    }
    if (data.password && String(data.password).trim().length < 4) {
      return { success: false, error: "Password too short" }
    }
    const target = await sql`
      SELECT id FROM groups WHERE slug = ${slug} LIMIT 1
    `
    await sql`SET app.user_role = 'admin'`
    await sql`ALTER TABLE groups ADD COLUMN IF NOT EXISTS teachers JSON`
    await sql`
      UPDATE groups SET
        name = ${data.name},
        password = ${data.password},
        teacher_name = ${data.teacher_name},
        teacher_photo = ${data.teacher_photo},
        meal_plan_url = ${data.meal_plan_url},
        age_group = ${data.age_group},
        hours = ${data.hours},
        number_of_children = ${data.number_of_children},
        description = ${data.description},
        schedule = ${JSON.stringify(data.schedule)},
        documents = ${JSON.stringify(data.documents)},
        contact_hours = ${data.contact_hours},
        color = ${data.color},
        email = ${data.email},
        phone = ${data.phone},
        teachers = ${JSON.stringify(data.teachers || [])},
        updated_at = NOW()
      WHERE slug = ${slug}
    `
    await sql`SET app.user_role = 'admin'`
    await sql`
      INSERT INTO group_update_log (group_id, updated_by, action, details, created_at)
      VALUES (${target[0]?.id}, ${session.user.id}, 'update', ${JSON.stringify(data)}, NOW())
    `
    revalidatePath("/admin/groups")
    revalidatePath(`/grupy/${slug}`)
    revalidatePath("/")
    revalidatePath("/grupy")
    return { success: true }
  } catch (error) {
    console.error('Update group error:', error)
    return { success: false, error: error instanceof Error ? error.message : "Failed to update group" }
  }
}



export async function addRRDocument(name: string, url: string) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    await sql`SET app.user_role = 'admin'`
    await sql`
      INSERT INTO rada_rodzicow_documents (name, url)
      VALUES (${name}, ${url})
    `
    revalidatePath("/admin/rada-rodzicow")
    revalidatePath("/rada-rodzicow")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to add document" }
  }
}

export async function deleteRRDocument(id: string) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    await sql`SET app.user_role = 'admin'`
    await sql`DELETE FROM rada_rodzicow_documents WHERE id = ${id}`
    revalidatePath("/admin/rada-rodzicow")
    revalidatePath("/rada-rodzicow")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete document" }
  }
}

// Gallery Actions
export async function getGalleries() {
  return await sql`
    SELECT * FROM galleries ORDER BY created_at DESC
  `
}

export async function getGallery(id: string) {
  const galleries = await sql`
    SELECT * FROM galleries WHERE id = ${id} LIMIT 1
  `

  const gallery = galleries[0]

  if (!gallery) return null

  const images = await sql`
    SELECT * FROM gallery_images WHERE gallery_id = ${id}
  `

  const cats = await sql`
    SELECT category_slug FROM gallery_category_links WHERE gallery_id = ${id}
  `
  return { ...gallery, images, categories: cats.map((c: any) => c.category_slug) }
}

export async function createGallery(data: any, images: any[]) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'galleries'))) {
      return { success: false, error: "Forbidden" }
    }
    if (!data.title) {
      return { success: false, error: "Title is required" }
    }
    const baseSlug = data.slug || slugify(data.title)
    const exists = await sql`
      SELECT true as exists FROM galleries WHERE slug = ${baseSlug} LIMIT 1
    `
    const slug = exists[0]?.exists ? `${baseSlug}-${Date.now().toString(36).slice(-4)}` : baseSlug

    await sql`SET app.user_role = 'admin'`
    const galleries = await sql`
      INSERT INTO galleries (
        title, description, category, cover_image_url, status, slug, created_at, updated_at, created_by
      ) VALUES (
        ${data.title}, ${data.description}, ${data.category}, ${data.cover_image_url},
        ${data.status}, ${slug}, NOW(), NOW(), ${data.created_by}
      ) RETURNING id
    `

    const gallery = galleries[0]

    const categories = Array.isArray(data.categories) ? data.categories : (data.category ? [data.category] : [])
    if (categories.length > 0) {
      for (const cat of categories) {
        await sql`SET app.user_role = 'admin'`
        await sql`
          INSERT INTO gallery_categories (name, slug, visible, display_order)
          VALUES (${cat}, ${cat}, true, 0)
          ON CONFLICT (slug) DO NOTHING
        `
        await sql`
          INSERT INTO gallery_category_links (gallery_id, category_slug)
          SELECT ${gallery.id}, ${cat}
          WHERE EXISTS (SELECT 1 FROM gallery_categories WHERE slug = ${cat})
          ON CONFLICT DO NOTHING
        `
      }
    }

    if (images.length > 0) {
      for (let i = 0; i < images.length; i++) {
        const img = images[i]
        await sql`SET app.user_role = 'admin'`
        await sql`
          INSERT INTO gallery_images (gallery_id, image_url, title, sort_order, created_at)
          VALUES (${gallery.id}, ${img.url}, ${img.title}, ${String(i)}, NOW())
        `
      }
    }

    revalidatePath("/admin/galleries")
    revalidatePath("/galeria")
    return { success: true }
  } catch (error) {
    console.error("Create gallery error:", error)
    return { success: false, error: "Failed to create gallery" }
  }
}

export async function updateGallery(id: string, data: any) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'galleries'))) {
      return { success: false, error: "Forbidden" }
    }
    await sql`SET app.user_role = 'admin'`
    await sql`
      UPDATE galleries SET
        title = ${data.title},
        description = ${data.description},
        cover_image_url = ${data.cover_image_url},
        status = ${data.status},
        updated_at = NOW()
      WHERE id = ${id}
    `
    const categories = Array.isArray(data.categories) ? data.categories : (data.category ? [data.category] : [])
    await sql`SET app.user_role = 'admin'`
    await sql`DELETE FROM gallery_category_links WHERE gallery_id = ${id}`
    for (const cat of categories) {
      await sql`SET app.user_role = 'admin'`
      await sql`
        INSERT INTO gallery_categories (name, slug, visible, display_order)
        VALUES (${cat}, ${cat}, true, 0)
        ON CONFLICT (slug) DO NOTHING
      `
      await sql`
        INSERT INTO gallery_category_links (gallery_id, category_slug)
        SELECT ${id}, ${cat}
        WHERE EXISTS (SELECT 1 FROM gallery_categories WHERE slug = ${cat})
        ON CONFLICT DO NOTHING
      `
    }
    revalidatePath("/admin/galleries")
    revalidatePath("/galeria")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update gallery" }
  }
}

// Gallery Image Management Actions
export async function addGalleryImage(galleryId: string, imageUrl: string, caption: string | null, sortOrder: number) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'galleries'))) {
      return { success: false, error: "Forbidden" }
    }
    await sql`SET app.user_role = 'admin'`
    await sql`
      INSERT INTO gallery_images (gallery_id, image_url, caption, sort_order)
      VALUES (${galleryId}, ${imageUrl}, ${caption}, ${sortOrder})
    `
    revalidatePath(`/admin/galleries/${galleryId}/edit`)
    return { success: true }
  } catch (error) {
    console.error("Add gallery image error:", error)
    return { success: false, error: "Failed to add image" }
  }
}

export async function deleteGalleryImage(id: string, galleryId: string) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'galleries'))) {
      return { success: false, error: "Forbidden" }
    }
    await sql`SET app.user_role = 'admin'`
    await sql`DELETE FROM gallery_images WHERE id = ${id}`
    revalidatePath(`/admin/galleries/${galleryId}/edit`)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete image" }
  }
}

export async function moveGalleryImage(imageId: string, currentOrder: number, targetOrder: number, galleryId: string) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'galleries'))) {
      return { success: false, error: "Forbidden" }
    }
    await sql`SET app.user_role = 'admin'`
    await sql`
      UPDATE gallery_images 
      SET sort_order = CASE 
        WHEN id = ${imageId} THEN ${targetOrder}
        WHEN sort_order = ${targetOrder} THEN ${currentOrder}
      END
      WHERE gallery_id = ${galleryId} AND (id = ${imageId} OR sort_order = ${targetOrder})
    `
    revalidatePath(`/admin/galleries/${galleryId}/edit`)
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to move image" }
  }
}

export async function deleteGallery(id: string) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'galleries'))) {
      return { success: false, error: "Forbidden" }
    }
    await sql`SET app.user_role = 'admin'`
    await sql`DELETE FROM gallery_images WHERE gallery_id = ${id}`
    await sql`SET app.user_role = 'admin'`
    await sql`DELETE FROM galleries WHERE id = ${id}`
    revalidatePath("/admin/galleries")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete gallery" }
  }
}

export async function getGalleryCategories() {
  try {
    const rows = await sql`
      SELECT * FROM gallery_categories ORDER BY visible DESC, display_order ASC, name ASC
    `
    return rows
  } catch (error) {
    console.error("Error fetching gallery categories:", error)
    return []
  }
}

export async function createGalleryCategory(data: { name: string; slug?: string; visible?: boolean; display_order?: number }) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) return { success: false, error: 'Unauthorized' }
    if (!(await hasPermission(session.user.id, 'galleries'))) return { success: false, error: 'Forbidden' }
    const baseSlug = (data.slug && String(data.slug).trim()) || slugify(data.name)
    const exists = await sql`SELECT 1 FROM gallery_categories WHERE slug = ${baseSlug} LIMIT 1`
    const finalSlug = exists[0] ? `${baseSlug}-${Date.now().toString(36).slice(-4)}` : baseSlug
    await sql`SET app.user_role = 'admin'`
    await sql`
      INSERT INTO gallery_categories (name, slug, visible, display_order)
      VALUES (${data.name}, ${finalSlug}, ${data.visible ?? true}, ${data.display_order ?? 0})
    `
    revalidatePath('/admin/galleries')
    revalidatePath('/galeria')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error creating gallery category:', error)
    return { success: false, error: 'Failed to create category' }
  }
}

export async function updateGalleryCategory(id: string, data: { name?: string; visible?: boolean; display_order?: number }) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) return { success: false, error: 'Unauthorized' }
    if (!(await hasPermission(session.user.id, 'galleries'))) return { success: false, error: 'Forbidden' }
    await sql`SET app.user_role = 'admin'`
    await sql`
      UPDATE gallery_categories SET
        name = COALESCE(${data.name}, name),
        visible = COALESCE(${data.visible}, visible),
        display_order = COALESCE(${data.display_order}, display_order)
      WHERE id = ${id}
    `
    revalidatePath('/admin/galleries')
    revalidatePath('/galeria')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error updating gallery category:', error)
    return { success: false, error: 'Failed to update category' }
  }
}

export async function deleteGalleryCategory(id: string) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) return { success: false, error: 'Unauthorized' }
    if (!(await hasPermission(session.user.id, 'galleries'))) return { success: false, error: 'Forbidden' }
    await sql`SET app.user_role = 'admin'`
    await sql`DELETE FROM gallery_categories WHERE id = ${id}`
    revalidatePath('/admin/galleries')
    revalidatePath('/galeria')
    revalidatePath('/')
    return { success: true }
  } catch (error) {
    console.error('Error deleting gallery category:', error)
    return { success: false, error: 'Failed to delete category' }
  }
}

// Meal Plans
export async function getMealPlans() {
  return await sql`
    SELECT * FROM meal_plans ORDER BY week_start DESC
  `
}

export async function createMealPlan(data: any) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'meal_plans'))) {
      return { success: false, error: "Forbidden" }
    }
    if (!data.file_url && !data.pdf_url && !data.image_url) {
      return { success: false, error: "File URL or image is required" }
    }
    await sql`SET app.user_role = 'admin'`
    const newPlans = await sql`
      INSERT INTO meal_plans (week_start, week_end, pdf_url, image_url, uploaded_by, created_at)
      VALUES (
        ${data.week_start || new Date()},
        ${data.week_end || new Date()},
        ${data.file_url || data.pdf_url},
        ${data.image_url},
        ${session.user.id},
        NOW()
      ) RETURNING *
    `

    revalidatePath("/admin/meal-plan")
    revalidatePath("/jadlospis")
    return { success: true, data: newPlans[0] }
  } catch (error) {
    console.error("Create meal plan error:", error)
    return { success: false, error: "Failed to create meal plan" }
  }
}

export async function getLatestMealPlan() {
  try {
    const plans = await sql`
      SELECT * FROM meal_plans ORDER BY created_at DESC LIMIT 1
    `
    return plans[0] || null
  } catch (error) {
    console.error("Error fetching latest meal plan:", error)
    return null
  }
}

export async function deleteMealPlan(id: string) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'meal_plans'))) {
      return { success: false, error: "Forbidden" }
    }
    await sql`SET app.user_role = 'admin'`
    await sql`DELETE FROM meal_plans WHERE id = ${id}`
    revalidatePath("/admin/meal-plan")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete meal plan" }
  }
}

export async function setCurrentMealPlan(id: string) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: 'Unauthorized' }
    }
    if (!(await hasPermission(session.user.id, 'meal_plans'))) {
      return { success: false, error: 'Forbidden' }
    }
    await sql`SET app.user_role = 'admin'`
    await sql`UPDATE meal_plans SET is_current = false`
    await sql`UPDATE meal_plans SET is_current = true WHERE id = ${id}`
    revalidatePath('/')
    revalidatePath('/grupy')
    revalidatePath('/admin/meal-plan')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to set current meal plan' }
  }
}

// Rada Rodzicow
export async function getRadaRodzicowData() {
  const postsData = await sql`
    SELECT * FROM posts WHERE type = 'rada-rodzicow' ORDER BY created_at DESC
  `

  const docsData = await sql`
    SELECT * FROM rada_rodzicow_documents ORDER BY created_at DESC
  `

  return { posts: postsData, documents: docsData }
}

export async function createRadaRodzicowDocument(data: any) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'rada_rodzicow'))) {
      return { success: false, error: "Forbidden" }
    }
    await sql`SET app.user_role = 'admin'`
    await sql`
      INSERT INTO rada_rodzicow_documents (title, url, display_order, created_at)
      VALUES (${data.title}, ${data.url}, ${data.display_order}, NOW())
    `
    revalidatePath("/admin/rada-rodzicow")
    revalidatePath("/rada-rodzicow")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to create document" }
  }
}

export async function deleteRadaRodzicowDocument(id: string) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'rada_rodzicow'))) {
      return { success: false, error: "Forbidden" }
    }
    await sql`SET app.user_role = 'admin'`
    await sql`DELETE FROM rada_rodzicow_documents WHERE id = ${id}`
    revalidatePath("/admin/rada-rodzicow")
    revalidatePath("/rada-rodzicow")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete document" }
  }
}

// Media
export async function getMediaFiles() {
  return await sql`
    SELECT * FROM media ORDER BY created_at DESC
  `
}

export async function createMediaFile(data: any) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'media'))) {
      return { success: false, error: "Forbidden" }
    }
    const allowed = ["image", "pdf", "document"]
    if (!data.file_url || !data.file_name) {
      return { success: false, error: "File URL and name are required" }
    }
    if (data.file_size && Number(data.file_size) > 20 * 1024 * 1024) {
      return { success: false, error: "File too large" }
    }
    if (data.file_type && !allowed.includes(data.file_type)) {
      return { success: false, error: "Unsupported file type" }
    }
    await sql`SET app.user_role = 'admin'`
    await sql`
      INSERT INTO media (file_url, file_name, file_type, file_size, category, subcategory, uploaded_by, created_at)
      VALUES (
        ${data.file_url}, ${data.file_name}, ${data.file_type}, ${data.file_size},
        ${data.category}, ${data.subcategory}, ${data.uploaded_by}, NOW()
      )
    `
    revalidatePath("/admin/media")
    return { success: true }
  } catch (error) {
    console.error("Error saving media file:", error)
    return { success: false, error: "Failed to save media file" }
  }
}

// Media Management Actions
export async function deleteMedia(id: string) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'media'))) {
      return { success: false, error: "Forbidden" }
    }
    await sql`SET app.user_role = 'admin'`
    await sql`DELETE FROM media WHERE id = ${id}`
    revalidatePath("/admin/media")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to delete media" }
  }
}

export async function createMedia(data: any) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    await sql`SET app.user_role = 'admin'`
    await sql`
      INSERT INTO media (file_name, file_url, file_type, category, subcategory, uploaded_by)
      VALUES (${data.file_name}, ${data.file_url}, ${data.file_type}, ${data.category}, ${data.subcategory}, ${data.uploaded_by})
    `
    revalidatePath("/admin/media")
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to create media" }
  }
}

// Admin Dashboard Stats
export async function getAdminStats() {
  try {
    const postsCount = await sql`SELECT COUNT(*)::int as count FROM posts`
    const aktualnosciCount = await sql`SELECT COUNT(*)::int as count FROM posts WHERE type = 'aktualnosci'`
    const ogloszeniaCount = await sql`SELECT COUNT(*)::int as count FROM posts WHERE type = 'ogloszenia'`
    const konkursyCount = await sql`SELECT COUNT(*)::int as count FROM posts WHERE type = 'konkursy'`
    const groupsCount = await sql`SELECT COUNT(*)::int as count FROM groups`
    const mediaCount = await sql`SELECT COUNT(*)::int as count FROM media`

    return {
      postsCount: Number(postsCount[0]?.count || 0),
      aktualnosciCount: Number(aktualnosciCount[0]?.count || 0),
      ogloszeniaCount: Number(ogloszeniaCount[0]?.count || 0),
      konkursyCount: Number(konkursyCount[0]?.count || 0),
      groupsCount: Number(groupsCount[0]?.count || 0),
      mediaCount: Number(mediaCount[0]?.count || 0),
    }
  } catch (error) {
    console.error("Error fetching stats:", error)
    return {
      postsCount: 0,
      aktualnosciCount: 0,
      ogloszeniaCount: 0,
      konkursyCount: 0,
      groupsCount: 0,
      mediaCount: 0,
    }
  }
}

export async function createAdminUser(data: { email: string; password: string; name: string | null; permissions: string[] }) {
  const session = await getSession()
  if (!session || session.user.role !== 'superadmin') {
    return { success: false, error: 'Unauthorized' }
  }
  const hash = await bcrypt.hash(data.password, 10)
  try {
    await sql`SET app.user_role = 'admin'`
    const users = await sql`
      INSERT INTO users (email, password, name, role, created_at)
      VALUES (${data.email}, ${hash}, ${data.name}, 'admin', NOW())
      RETURNING id
    `
    const user = users[0]
    if (data.permissions && data.permissions.length > 0) {
      for (const section of data.permissions) {
        await sql`SET app.user_role = 'admin'`
        await sql`INSERT INTO admin_permissions (user_id, section) VALUES (${user.id}, ${section})`
      }
    }
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to create admin user' }
  }
}

export async function getAdminUsers() {
  try {
    await sql`SET app.user_role = 'admin'`
    const rows = await sql`
      SELECT id, email, name, role, created_at FROM users WHERE role IN ('admin','superadmin') ORDER BY created_at DESC
    `
    return rows
  } catch (error) {
    console.error('Error fetching admin users:', error)
    return []
  }
}

export async function deleteAdminUser(id: string) {
  try {
    const session = await getSession()
    if (!session || session.user.role !== 'superadmin') return { success: false, error: 'Unauthorized' }
    await sql`SET app.user_role = 'admin'`
    await sql`DELETE FROM admin_permissions WHERE user_id = ${id}`
    await sql`SET app.user_role = 'admin'`
    await sql`DELETE FROM users WHERE id = ${id}`
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    console.error('Error deleting admin user:', error)
    return { success: false, error: 'Failed to delete admin user' }
  }
}

export async function updateAdminPassword(id: string, newPassword: string) {
  try {
    const session = await getSession()
    if (!session || session.user.role !== 'superadmin') return { success: false, error: 'Unauthorized' }
    const hash = await bcrypt.hash(newPassword, 10)
    await sql`SET app.user_role = 'admin'`
    await sql`UPDATE users SET password = ${hash} WHERE id = ${id}`
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update password' }
  }
}

export async function updateOwnPassword(currentPassword: string, newPassword: string) {
  try {
    const session = await getSession()
    if (!session) return { success: false, error: "Unauthorized" }
    if (!newPassword || String(newPassword).trim().length < 6) return { success: false, error: "Password too short" }
    const rows = await sql`
      SELECT password FROM users WHERE id = ${session.user.id} LIMIT 1
    `
    const existing = rows[0]?.password || ""
    const ok = await bcrypt.compare(currentPassword || "", existing)
    if (!ok) return { success: false, error: "Invalid current password" }
    const hash = await bcrypt.hash(newPassword, 10)
    await sql`SET app.user_role = 'admin'`
    await sql`UPDATE users SET password = ${hash} WHERE id = ${session.user.id}`
    return { success: true }
  } catch (error) {
    return { success: false, error: "Failed to update password" }
  }
}

export async function updateAdminRole(id: string, role: 'admin' | 'superadmin') {
  try {
    const session = await getSession()
    if (!session || session.user.role !== 'superadmin') return { success: false, error: 'Unauthorized' }
    await sql`SET app.user_role = 'admin'`
    await sql`UPDATE users SET role = ${role} WHERE id = ${id}`
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to update role' }
  }
}

export async function getAdminPermissions(userId: string) {
  try {
    await sql`SET app.user_role = 'admin'`
    const rows = await sql`SELECT section FROM admin_permissions WHERE user_id = ${userId}`
    return rows.map((r: any) => r.section)
  } catch (error) {
    return []
  }
}

export async function setAdminPermissions(userId: string, sections: string[]) {
  try {
    const session = await getSession()
    if (!session || session.user.role !== 'superadmin') return { success: false, error: 'Unauthorized' }
    await sql`SET app.user_role = 'admin'`
    await sql`DELETE FROM admin_permissions WHERE user_id = ${userId}`
    for (const section of sections) {
      await sql`SET app.user_role = 'admin'`
      await sql`INSERT INTO admin_permissions (user_id, section) VALUES (${userId}, ${section})`
    }
    revalidatePath('/admin/users')
    return { success: true }
  } catch (error) {
    return { success: false, error: 'Failed to set permissions' }
  }
}

export async function getRRInfo() {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return null
    }
    const rows = await sql`
      SELECT * FROM rada_rodzicow_info LIMIT 1
    `
    return rows[0] || {
      chairperson: '',
      vice_chairperson: '',
      treasurer: '',
      secretary: '',
    }
  } catch (error) {
    console.error("Error fetching RR info:", error)
    return null
  }
}

export async function updateRRInfo(data: any) {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    if (!(await hasPermission(session.user.id, 'rada-rodzicow'))) {
      return { success: false, error: "Forbidden" }
    }
    await sql`SET app.user_role = 'admin'`

    // Check if record exists
    const exists = await sql`SELECT 1 FROM rada_rodzicow_info LIMIT 1`

    if (exists.length > 0) {
      await sql`
        UPDATE rada_rodzicow_info SET
          chairperson = ${data.chairperson},
          vice_chairperson = ${data.vice_chairperson},
          treasurer = ${data.treasurer},
          secretary = ${data.secretary},
          updated_at = NOW()
      `
    } else {
      await sql`
        INSERT INTO rada_rodzicow_info (chairperson, vice_chairperson, treasurer, secretary, updated_at)
        VALUES (${data.chairperson}, ${data.vice_chairperson}, ${data.treasurer}, ${data.secretary}, NOW())
      `
    }
    revalidatePath("/admin/rada-rodzicow")
    revalidatePath("/rada-rodzicow")
    return { success: true }
  } catch (error) {
    console.error("Update RR info error:", error)
    return { success: false, error: "Failed to update info" }
  }
}

export async function getMediaList() {
  try {
    const session = await getSession()
    if (!session || !['admin', 'superadmin'].includes(session.user.role)) {
      return { success: false, error: "Unauthorized" }
    }
    const result = await sql`SELECT * FROM media ORDER BY created_at DESC LIMIT 100`
    return { success: true, data: result }
  } catch (error) {
    console.error("Get media list error:", error)
    return { success: false, error: "Failed to fetch media" }
  }
}
