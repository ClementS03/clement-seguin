import { NextRequest, NextResponse } from "next/server"
import { uploadImage, uploadDeliverable } from "@/lib/cloudinary"

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const formData = await req.formData()
  const file = formData.get("file") as File | null
  const folder = (formData.get("folder") as string | null) ?? "products"
  const isDeliverable = formData.get("deliverable") === "true"

  if (!file) return NextResponse.json({ error: "No file" }, { status: 400 })

  const buffer = Buffer.from(await file.arrayBuffer())

  try {
    const url = isDeliverable
      ? await uploadDeliverable(buffer, file.type, file.name)
      : await uploadImage(buffer, file.type, folder)
    return NextResponse.json({ url })
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error("[upload]", message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
