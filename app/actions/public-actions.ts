"use server"

import { cache } from 'react'
import { sql } from "@/lib/db";

export interface GalleryImage {
  id: string;
  image_url: string;
  title: string;
  sort_order: number;
}

export interface Gallery {
  id: string;
  title: string;
  description: string;
  slug: string;
  cover_image_url: string;
  status: string;
  images: GalleryImage[];
}



export async function getPublicPosts(type?: string, limit?: number) {
  try {
    if (type && limit) {
      return await sql`
        SELECT * FROM posts 
        WHERE status = 'published' AND type = ${type}
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `
    } else if (type) {
      return await sql`
        SELECT * FROM posts 
        WHERE status = 'published' AND type = ${type}
        ORDER BY created_at DESC
      `
    } else if (limit) {
      return await sql`
        SELECT * FROM posts 
        WHERE status = 'published'
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `
    }

    return await sql`
      SELECT * FROM posts 
      WHERE status = 'published'
      ORDER BY created_at DESC
    `
  } catch (error) {
    console.error("Error fetching posts:", error)
    return []
  }
}

export async function getPublicGalleryImages(category?: string) {
  try {
    if (category && category !== "wszystkie") {
      return await sql`
        SELECT * FROM media 
        WHERE file_type = 'image' AND subcategory = ${category}
        ORDER BY created_at DESC
      `
    }

    return await sql`
      SELECT * FROM media 
      WHERE file_type = 'image'
      ORDER BY created_at DESC
    `
  } catch (error) {
    console.error("Error fetching gallery images:", error)
    return []
  }
}

export async function getGalleriesByCategory(category: string) {
  try {
    const rows = await sql`
      SELECT g.*
      FROM galleries g
      WHERE g.status = 'published' AND EXISTS (
        SELECT 1 FROM gallery_category_links l WHERE l.gallery_id = g.id AND l.category_slug = ${category}
      )
      ORDER BY g.created_at DESC
    `
    return rows
  } catch (error) {
    console.error('Error fetching galleries by category:', error)
    return []
  }
}

export async function getVisibleGalleryCategories() {
  try {
    const rows = await sql`
      SELECT * FROM gallery_categories 
      WHERE visible = true AND slug NOT LIKE 'grupa-%'
      ORDER BY display_order ASC, name ASC
    `
    return rows
  } catch (error) {
    console.error('Error fetching visible gallery categories:', error)
    return []
  }
}

export async function getPublicGalleries(category?: string, page: number = 1, limit: number = 12) {
  try {
    const offset = (page - 1) * limit
    if (category && category !== 'wszystkie') {
      const rows = await sql`
        SELECT g.*, (
          SELECT COUNT(*)::int FROM gallery_images gi WHERE gi.gallery_id = g.id
        ) AS image_count
        FROM galleries g
        WHERE g.status = 'published' AND EXISTS (
          SELECT 1 FROM gallery_category_links l 
          LEFT JOIN gallery_categories c ON c.slug = l.category_slug
          WHERE l.gallery_id = g.id AND l.category_slug = ${category} AND (c.visible = true OR c.id IS NULL)
        )
        ORDER BY g.created_at DESC LIMIT ${limit} OFFSET ${offset}
      `
      return rows
    }
    const rows = await sql`
      SELECT g.*, (
        SELECT COUNT(*)::int FROM gallery_images gi WHERE gi.gallery_id = g.id
      ) AS image_count
      FROM galleries g
      WHERE g.status = 'published' AND (
        NOT EXISTS (SELECT 1 FROM gallery_category_links l WHERE l.gallery_id = g.id)
        OR EXISTS (
          SELECT 1 FROM gallery_category_links l
          LEFT JOIN gallery_categories c ON c.slug = l.category_slug
          WHERE l.gallery_id = g.id AND (c.visible = true OR c.id IS NULL) AND l.category_slug NOT LIKE 'grupa-%'
        )
      )
      ORDER BY g.created_at DESC LIMIT ${limit} OFFSET ${offset}
    `
    return rows
  } catch (error) {
    console.error('Error fetching public galleries:', error)
    return []
  }
}

export const getPublicGalleryBySlug = cache(async function getPublicGalleryBySlug(slug: string): Promise<Gallery | null> {
  try {
    const rows = await sql`
      SELECT * FROM galleries WHERE slug = ${slug} AND status = 'published' LIMIT 1
    `
    const gallery = rows[0] as any
    if (!gallery) return null

    const images = await sql`
      SELECT * FROM gallery_images WHERE gallery_id = ${gallery.id} ORDER BY sort_order ASC, created_at ASC
    `
    return { ...gallery, images: images as any[] } as Gallery
  } catch (error) {
    console.error('Error fetching gallery by slug:', error)
    return null
  }
})

export async function getRRInfoPublic() {
  try {
    const rows = await sql`
      SELECT chairperson, vice_chairperson, treasurer, secretary FROM rada_rodzicow_info LIMIT 1
    `
    return rows[0] || null
  } catch (error) {
    console.error('Error fetching public RR info:', error)
    return null
  }
}

export async function getGroupsPublic() {
  try {
    const rows = await sql`
      SELECT id, name, slug, color, teacher_name, age_group, hours, description FROM groups ORDER BY name ASC
    `
    return rows
  } catch (error) {
    console.error('Error fetching public groups:', error)
    return []
  }
}

export async function getMealPlan() {
  try {
    const current = await sql`
      SELECT * FROM meal_plans WHERE is_current = true ORDER BY created_at DESC LIMIT 1
    `
    if (current[0]) return current[0]
    const latest = await sql`
      SELECT * FROM meal_plans ORDER BY created_at DESC LIMIT 1
    `
    return latest[0] || null
  } catch (error) {
    console.error("Error fetching meal plan:", error)
    return null
  }
}

export async function getRadaRodzicowData() {
  try {
    const postsResult = await sql`
      SELECT * FROM posts 
      WHERE type = 'rada-rodzicow' AND status = 'published'
      ORDER BY created_at DESC
    `

    const docsResult = await sql`
      SELECT * FROM rada_rodzicow_documents 
      ORDER BY created_at DESC
    `

    return {
      posts: postsResult || [],
      documents: docsResult || [],
    }
  } catch (error) {
    console.error("Error fetching Rada Rodzicow data", error)
    return { posts: [], documents: [] }
  }
}

export const getGroupData = cache(async function getGroupData(slug: string) {
  try {
    const groups = await sql`
      SELECT * FROM groups 
      WHERE slug = ${slug} 
      LIMIT 1
    `
    return groups[0] || null
  } catch (error) {
    console.error(`Error fetching group ${slug}:`, error)
    return null
  }
})

export const getGroupDetails = cache(async function getGroupDetails(slug: string) {
  try {
    const group = await getGroupData(slug)
    if (!group) return null

    const galleries = await sql`
      SELECT g.* FROM galleries g
      WHERE g.status = 'published' AND EXISTS (
        SELECT 1 FROM gallery_category_links l WHERE l.gallery_id = g.id AND l.category_slug = ${`grupa-${slug}`}
      )
      ORDER BY g.created_at DESC
    `

    return { group, galleries }
  } catch (error) {
    console.error(`Error fetching group details ${slug}:`, error)
    return null
  }
})

export async function getPublicPostBySlug(type: string, slug: string) {
  try {
    const isId = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(slug);

    if (isId) {
      const posts = await sql`
        SELECT * FROM posts 
        WHERE status = 'published' AND type = ${type} AND (slug = ${slug} OR id = ${slug})
        LIMIT 1
      `
      return posts[0] || null
    } else {
      const posts = await sql`
        SELECT * FROM posts 
        WHERE status = 'published' AND type = ${type} AND slug = ${slug}
        LIMIT 1
      `
      return posts[0] || null
    }
  } catch (error) {
    console.error('Error fetching post by slug:', error)
    return null
  }
}
