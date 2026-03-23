import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
export const dynamic = "force-dynamic"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const group = searchParams.get("group")
  const status = searchParams.get("status") || "published"
  const limit = Number.parseInt(searchParams.get("limit") || "10")

  try {
    let query = "SELECT * FROM posts WHERE status = $1"
    const params: any[] = [status]

    if (group) {
      params.push(group)
      query += ` AND group_category = $${params.length}`
    }

    query += " ORDER BY created_at DESC LIMIT $" + (params.length + 1)
    params.push(limit)

    const posts = await sql.query(query, params)

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Failed to fetch posts" }, { status: 500 })
  }
}
