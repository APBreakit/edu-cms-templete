import { verifyCredentials, createSession } from "@/lib/auth"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { email, password, captcha, num1, num2, form_time } = await request.json()

    if (!email || !password) {
      return NextResponse.json({ error: "Email i hasło są wymagane" }, { status: 400 })
    }

    const expected = Number(num1) + Number(num2)
    if (Number(captcha) !== expected) {
      return NextResponse.json({ error: "Nieprawidłowa odpowiedź weryfikacyjna" }, { status: 400 })
    }

    // Minimalny czas wypełniania formularza (anti-bot)
    if (!form_time || Number(form_time) < 800) {
      return NextResponse.json({ error: "Formularz wypełniony zbyt szybko" }, { status: 400 })
    }

    // Prosta kontrola Referer/Origin (anti-CSRF)
    const referer = request.headers.get('referer') || ''
    const host = request.headers.get('host') || ''
    if (referer && host && !referer.includes(host)) {
      return NextResponse.json({ error: "Nieprawidłowe źródło żądania" }, { status: 400 })
    }

    const user = await verifyCredentials(email, password)

    if (!user) {
      return NextResponse.json({ error: "Nieprawidłowy email lub hasło" }, { status: 401 })
    }

    await createSession(user.id, user.email, user.name, user.role)

    return NextResponse.json({ success: true, user })
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json({ error: "Wystąpił błąd podczas logowania" }, { status: 500 })
  }
}
