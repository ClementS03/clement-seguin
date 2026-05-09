import { NextRequest, NextResponse } from "next/server"
import { stripeCreateProduct, stripeCreatePrice, stripeCreatePaymentLink } from "@/lib/stripe"
import { airtableCreateProduct } from "@/lib/airtable"

type ProductPayload = {
  name: string; slug: string; tagline: string; description?: string
  price: number; category?: string; imageUrl?: string; featured?: boolean
  status?: string; downloadUrl?: string
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json() as ProductPayload
  const { name, slug, tagline, description = "", price, category = "", imageUrl = "", featured = false, status = "Draft", downloadUrl = "" } = body

  if (!name || !slug || !tagline || !price || price <= 0) {
    return NextResponse.json({ error: "Missing required fields or invalid price." }, { status: 400 })
  }

  const isDraft = status === "Draft"
  let stripeProductId = ""
  let stripePriceId = ""
  let buyUrl = ""

  if (!isDraft) {
    stripeProductId = await stripeCreateProduct(name, description, imageUrl || undefined)
    stripePriceId = await stripeCreatePrice(stripeProductId, price)
    buyUrl = await stripeCreatePaymentLink(stripePriceId, name)
  }

  const product = await airtableCreateProduct({
    name, slug, tagline, description, price, category, imageUrl, featured,
    draft: isDraft, stripeProductId, stripePriceId, buyUrl, downloadUrl,
  })

  return NextResponse.json({ success: true, product, buyUrl: buyUrl || undefined })
}
