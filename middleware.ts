import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { jwtVerify } from "jose"

function getJWTSecret() {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret && process.env.NODE_ENV === "production") {
    throw new Error("NEXTAUTH_SECRET is required in production")
  }
  return new TextEncoder().encode(secret || "fallback-secret-for-dev-only-change-in-production")
}

export async function middleware(req: NextRequest) {
  const JWT_SECRET = getJWTSecret()
  const token = req.cookies.get("session")?.value
  const isAuth = !!token

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET)
    } catch (error) {
      // Invalid token, treat as not authenticated
      const response = NextResponse.redirect(new URL("/admin/login", req.url))
      response.cookies.delete("session")
      return response
    }
  }

  const isAuthPage = req.nextUrl.pathname.startsWith("/admin/login")

  if (isAuthPage) {
    if (isAuth) {
      try {
        const { payload } = await jwtVerify(token!, JWT_SECRET)
        if ((payload as any).role === "admin" || (payload as any).role === "superadmin") {
          return NextResponse.redirect(new URL("/admin", req.url))
        }
      } catch {}
    }
    return null
  }

  if (!isAuth) {
    let from = req.nextUrl.pathname
    if (req.nextUrl.search) {
      from += req.nextUrl.search
    }

    return NextResponse.redirect(new URL(`/admin/login?from=${encodeURIComponent(from)}`, req.url))
  }

  try {
    const { payload } = await jwtVerify(token!, JWT_SECRET)
    if ((payload as any).role !== "admin" && (payload as any).role !== "superadmin") {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
  } catch {
    const response = NextResponse.redirect(new URL("/admin/login", req.url))
    response.cookies.delete("session")
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
