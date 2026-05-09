import { NextRequest, NextResponse } from "next/server"
import { getStore } from "@netlify/blobs"

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  const folder = (formData.get("folder") as string) ?? "products"

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

  try {
    const arrayBuffer = await file.arrayBuffer()
    const ext = file.name.split(".").pop() ?? "bin"
    const key = `${folder}/${Date.now()}.${ext}`

    const store = getStore({ name: "media", consistency: "strong" })
    await store.set(key, arrayBuffer, { metadata: { contentType: file.type } })

    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/media/${key}`
    return NextResponse.json({ url })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
