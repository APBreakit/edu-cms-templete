import { sql } from "../lib/db"
import { uploadToS3 } from "../lib/storage/s3"
import dotenv from "dotenv"
import fetch from "node-fetch"

dotenv.config({ path: ".env.local" })

async function migrate() {
    console.log("Starting migration from Vercel Blob to S3/MinIO...")

    if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_ENDPOINT || !process.env.S3_BUCKET_NAME) {
        console.error("S3 environment variables missing in .env.local")
        process.exit(1)
    }

    // 1. Migrate posts (featured images)
    const posts = await sql`SELECT id, image_url, title FROM posts WHERE image_url LIKE '%vercel-storage.com%'`
    console.log(`Found ${posts.length} posts to migrate.`)

    for (const post of posts) {
        try {
            console.log(`Migrating post image: ${post.title}...`)
            const res = await fetch(post.image_url)
            const buffer = await res.arrayBuffer()
            const contentType = res.headers.get("content-type") || "image/jpeg"
            const fileName = post.image_url.split("/").pop() || "image.jpg"

            const { url } = await uploadToS3(Buffer.from(buffer), fileName, contentType)

            await sql`UPDATE posts SET image_url = ${url} WHERE id = ${post.id}`
            console.log(`  Success: ${url}`)
        } catch (err) {
            console.error(`  Failed to migrate post ${post.id}:`, err)
        }
    }

    // 2. Migrate media library
    const media = await sql`SELECT id, file_url, file_name FROM media WHERE file_url LIKE '%vercel-storage.com%'`
    console.log(`Found ${media.length} media items to migrate.`)

    for (const item of media) {
        try {
            console.log(`Migrating media: ${item.file_name}...`)
            const res = await fetch(item.file_url)
            const buffer = await res.arrayBuffer()
            const contentType = res.headers.get("content-type") || "application/octet-stream"

            const { url } = await uploadToS3(Buffer.from(buffer), item.file_name, contentType)

            await sql`UPDATE media SET file_url = ${url} WHERE id = ${item.id}`
            console.log(`  Success: ${url}`)
        } catch (err) {
            console.error(`  Failed to migrate media ${item.id}:`, err)
        }
    }

    // 3. Migrate gallery images
    const galleries = await sql`SELECT id, image_url FROM gallery_images WHERE image_url LIKE '%vercel-storage.com%'`
    console.log(`Found ${galleries.length} gallery images to migrate.`)

    for (const img of galleries) {
        try {
            console.log(`Migrating gallery image ${img.id}...`)
            const res = await fetch(img.image_url)
            const buffer = await res.arrayBuffer()
            const contentType = res.headers.get("content-type") || "image/jpeg"
            const fileName = img.image_url.split("/").pop() || "gallery_image.jpg"

            const { url } = await uploadToS3(Buffer.from(buffer), fileName, contentType)

            await sql`UPDATE gallery_images SET image_url = ${url} WHERE id = ${img.id}`
            console.log(`  Success: ${url}`)
        } catch (err) {
            console.error(`  Failed to migrate gallery image ${img.id}:`, err)
        }
    }

    console.log("Migration finished.")
}

migrate().catch(console.error)
