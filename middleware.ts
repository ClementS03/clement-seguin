import { NextRequest, NextResponse } from "next/server"

const LOCALES = ["fr", "en"] as const
type Locale = (typeof LOCALES)[number]
const DEFAULT_LOCALE: Locale = "fr"

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function hasLocalePrefix(pathname: string): boolean {
  return LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Admin protection (existing logic) ─────────────────────────
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next()
    const token = req.cookies.get("admin_token")?.value
    const secret = process.env.ADMIN_SECRET ?? ""
    if (!token || !safeCompare(token, secret)) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
    return NextResponse.next()
  }

  // ── Skip API, Next.js internals, static files ─────────────────
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // ── Already localized (/en/...) → serve as-is ─────────────────
  if (hasLocalePrefix(pathname)) return NextResponse.next()

  // ── Rewrite to default locale internally (URL stays clean) ────
  const url = req.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|icon|apple-touch-icon|manifest|.*\\..*).*)",
  ],
}
