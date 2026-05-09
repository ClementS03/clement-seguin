import { NextRequest, NextResponse } from "next/server"
import { getProductById, airtableUpdateProduct, airtableDeleteProduct } from "@/lib/airtable"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const token = req.cookies.get("admin_token")?.value
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json() as {
    name: string; slug: string; tagline: string; description: string
    price: number; category: string; imageUrl: string; featured: boolean
    status: string; buyUrl?: string
  }

  const current = await getProductById(id)
  if (!current) return NextResponse.json({ error: "Product not found" }, { status: 404 })

  const isDraft = body.status === "Draft"
  const buyUrl = isDraft ? "" : (body.buyUrl ?? current.buyUrl)

  const product = await airtableUpdateProduct(id, {
    name: body.name, slug: body.slug, tagline: body.tagline,
    description: body.description, price: body.price, category: body.category,
    imageUrl: body.imageUrl, featured: body.featured,
    draft: isDraft, buyUrl,
  })

  return NextResponse.json({ success: true, product, buyUrl })
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const token = req.cookies.get("admin_token")?.value
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  await airtableDeleteProduct(id)
  return NextResponse.json({ success: true })
}
