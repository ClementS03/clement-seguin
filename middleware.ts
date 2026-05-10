import { NextRequest, NextResponse } from "next/server"

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === "/admin/login") return NextResponse.next()

  const token = req.cookies.get("admin_token")?.value
  const secret = process.env.ADMIN_SECRET ?? ""
  if (!token || !safeCompare(token, secret)) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
