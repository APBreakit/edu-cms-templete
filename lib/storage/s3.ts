import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { Upload } from "@aws-sdk/lib-storage"

if (!process.env.S3_ACCESS_KEY_ID || !process.env.S3_SECRET_ACCESS_KEY || !process.env.S3_ENDPOINT || !process.env.S3_BUCKET_NAME) {
    // We allow it to be missing during build time if not using static generation that requires it
    console.warn("Storage environment variables missing. S3 client may not work correctly.")
}

export const s3Client = new S3Client({
    region: process.env.S3_REGION || "auto",
    endpoint: process.env.S3_ENDPOINT,
    credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID || "",
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY || "",
    },
    forcePathStyle: true, // Required for MinIO
})

export async function uploadToS3(file: Buffer | Uint8Array | Blob, fileName: string, contentType: string) {
    const bucketName = process.env.S3_BUCKET_NAME!

    // Clean file name
    const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, "_")
    const key = `${Date.now()}-${cleanFileName}`

    try {
        const upload = new Upload({
            client: s3Client,
            params: {
                Bucket: bucketName,
                Key: key,
                Body: file,
                ContentType: contentType,
                ACL: "public-read", // Assuming public bucket setup
            },
        })

        await upload.done()

        // Determine public URL
        // For MinIO, it's usually ENDPOINT/BUCKET/KEY
        const endpoint = process.env.S3_ENDPOINT!.replace(/\/$/, "")
        const publicUrl = `${process.env.S3_PUBLIC_URL || `${endpoint}/${bucketName}`}/${key}`

        return {
            url: publicUrl,
            success: true,
        }
    } catch (error) {
        console.error("S3 upload error:", error)
        throw error
    }
}
