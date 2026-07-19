import { NextRequest, NextResponse } from "next/server"
import { rateLimit, getClientIp } from "@/lib/rate-limit"

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

export async function POST(req: NextRequest) {
  // 10 attempts per 15 minutes per IP — brute-force mitigation
  const ip = getClientIp(req)
  const { allowed, resetMs } = rateLimit(`admin-auth:${ip}`, {
    limit: 10,
    windowMs: 15 * 60 * 1000,
  })
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many attempts. Try again later." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(resetMs / 1000)) } },
    )
  }

  const { password } = await req.json() as { password: string }
  const secret = process.env.ADMIN_SECRET ?? ""

  if (!password || !secret || !safeCompare(password, secret)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set("admin_token", process.env.ADMIN_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  })
  return res
}
