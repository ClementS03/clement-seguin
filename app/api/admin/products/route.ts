import { NextRequest, NextResponse } from "next/server"
import { airtableCreateProduct } from "@/lib/airtable"

type ProductPayload = {
  name: string; slug: string; tagline: string; description?: string
  price: number; category?: string; imageUrl?: string; featured?: boolean
  status?: string; buyUrl?: string
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json() as ProductPayload
  const { name, slug, tagline, description = "", price, category = "", imageUrl = "", featured = false, status = "Draft", buyUrl = "" } = body

  if (!name || !slug || !tagline || !price || price <= 0) {
    return NextResponse.json({ error: "Missing required fields or invalid price." }, { status: 400 })
  }

  const isDraft = status === "Draft"
  if (!isDraft && !buyUrl) {
    return NextResponse.json({ error: "Checkout URL is required to publish. Copy it from your LemonSqueezy dashboard (Products → Share)." }, { status: 400 })
  }

  const product = await airtableCreateProduct({
    name, slug, tagline, description, price, category, imageUrl, featured,
    draft: isDraft,
    lsProductId: "",
    lsVariantId: "",
    buyUrl: isDraft ? "" : buyUrl,
  })

  return NextResponse.json({ success: true, product, buyUrl: isDraft ? undefined : buyUrl })
}
