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

  const ALLOWED_IMAGE = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/avif"]
  const ALLOWED_FOLDERS = ["products", "projects"]

  if (!ALLOWED_FOLDERS.includes(folder)) {
    return NextResponse.json({ error: "Invalid folder" }, { status: 400 })
  }
  if (!ALLOWED_IMAGE.includes(file.type)) {
    return NextResponse.json({ error: "File type not allowed. Use JPG, PNG or WebP." }, { status: 400 })
  }
  if (file.size > 10 * 1024 * 1024) {
    return NextResponse.json({ error: "File too large (max 10MB)" }, { status: 400 })
  }

  try {
    const arrayBuffer = await file.arrayBuffer()
    const ext = file.name.split(".").pop()?.toLowerCase() ?? "jpg"
    const safeExt = ["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(ext) ? ext : "jpg"
    const key = `${folder}/${Date.now()}.${safeExt}`

    const store = getStore({ name: "media", consistency: "strong" })
    await store.set(key, arrayBuffer, { metadata: { contentType: file.type } })

    const url = `${process.env.NEXT_PUBLIC_SITE_URL}/api/media/${key}`
    return NextResponse.json({ url })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
