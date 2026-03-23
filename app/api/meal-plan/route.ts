import { NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET() {
  try {
    const current = await sql`
      SELECT * FROM meal_plans WHERE is_current = true ORDER BY created_at DESC LIMIT 1
    `
    if (current[0]) return NextResponse.json(current[0])
    const latest = await sql`
      SELECT * FROM meal_plans ORDER BY created_at DESC LIMIT 1
    `
    return NextResponse.json(latest[0] || null)
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 })
  }
}

