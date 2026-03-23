import { deleteSession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST() {
  try {
    await deleteSession()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Wystąpił błąd podczas wylogowania" }, { status: 500 })
  }
}
