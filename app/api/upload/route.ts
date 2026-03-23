import { put } from "@vercel/blob"
import { NextResponse } from "next/server"
import { uploadToS3 } from "@/lib/storage/s3"

export async function POST(request: Request) {
  try {
    console.log("[v0] Upload API called")

    const formData = await request.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      console.error("[v0] No file provided in request")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("[v0] Uploading file:", file.name, "Size:", file.size, "Type:", file.type)

    // Validate file size (max 50MB for S3, kept 10MB default)
    if (file.size > 10 * 1024 * 1024) {
      console.error("[v0] File too large:", file.size)
      return NextResponse.json(
        { error: "File too large", details: "Maximum file size is 10MB" },
        { status: 400 }
      )
    }

    // Try S3 first if configured
    if (process.env.S3_ACCESS_KEY_ID && process.env.S3_ENDPOINT) {
      console.log("[v0] Using S3/MinIO for upload")
      const buffer = Buffer.from(await file.arrayBuffer())
      const result = await uploadToS3(buffer, file.name, file.type)

      return NextResponse.json({
        url: result.url,
        success: true,
        provider: "s3"
      })
    }

    // Fallback to Vercel Blob
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json(
        { error: "Storage configuration missing", details: "Set BLOB_READ_WRITE_TOKEN or S3 environment variables" },
        { status: 503 }
      )
    }

    console.log("[v0] Using Vercel Blob for upload")
    const blob = await put(file.name, file, {
      access: "public",
      addRandomSuffix: true,
    })

    console.log("[v0] Upload successful. URL:", blob.url)

    return NextResponse.json({
      url: blob.url,
      success: true,
      provider: "vercel"
    })
  } catch (error: any) {
    console.error("[v0] Upload error:", error)
    return NextResponse.json(
      {
        error: "Upload failed",
        details: error.message || "Unknown error",
      },
      { status: 500 },
    )
  }
}
