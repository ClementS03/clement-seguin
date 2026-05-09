import { NextRequest, NextResponse } from "next/server"
import { revalidatePath } from "next/cache"
import { getProductById, airtableUpdateProduct, airtableDeleteProduct } from "@/lib/airtable"
import { stripeCreateProduct, stripeCreatePrice, stripeCreatePaymentLink, stripeUpdateProduct, stripeArchiveProduct } from "@/lib/stripe"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const token = req.cookies.get("admin_token")?.value
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json() as {
    name: string; slug: string; tagline: string; description: string; features?: string
    price: number; category: string; imageUrl: string; featured: boolean
    status: string; downloadUrl?: string; buyLinks?: string
  }

  const current = await getProductById(id)
  if (!current) return NextResponse.json({ error: "Product not found" }, { status: 404 })

  const isDraft = body.status === "Draft"
  const isExternal = body.status === "External"
  const wasDraft = current.draft
  let stripeProductId = current.stripeProductId
  let stripePriceId = current.stripePriceId
  let buyUrl = current.buyUrl

  const featureLines = (body.features ?? "").split("\n").map(s => s.trim()).filter(Boolean)

  try {
    if (!isDraft && !isExternal) {
      if (wasDraft || !stripeProductId) {
        // Draft → Active: create in Stripe for the first time
        stripeProductId = await stripeCreateProduct(body.name, body.description, body.imageUrl || undefined, featureLines)
        stripePriceId = await stripeCreatePrice(stripeProductId, body.price)
        buyUrl = await stripeCreatePaymentLink(stripePriceId, body.name)
      } else {
        // Active → Active: update name/description/features in Stripe
        await stripeUpdateProduct(stripeProductId, body.name, body.description, featureLines)
        // Note: Stripe prices are immutable — price changes require a new price
        if (body.price !== current.price) {
          stripePriceId = await stripeCreatePrice(stripeProductId, body.price)
          buyUrl = await stripeCreatePaymentLink(stripePriceId, body.name)
        }
      }
    }

    const product = await airtableUpdateProduct(id, {
      name: body.name, slug: body.slug, tagline: body.tagline,
      description: body.description, price: body.price, category: body.category,
      imageUrl: body.imageUrl, featured: body.featured,
      draft: isDraft, buyUrl, stripeProductId, stripePriceId,
      downloadUrl: body.downloadUrl, buyLinks: body.buyLinks, features: body.features,
    })

    revalidatePath("/shop")
    revalidatePath(`/shop/${body.slug}`)

    return NextResponse.json({ success: true, product, buyUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    console.error("[PATCH /admin/products/[id]]", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: Params) {
  const token = req.cookies.get("admin_token")?.value
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const current = await getProductById(id)
  if (!current) return NextResponse.json({ error: "Product not found" }, { status: 404 })

  if (current.stripeProductId) {
    try { await stripeArchiveProduct(current.stripeProductId) } catch { /* ignore */ }
  }

  await airtableDeleteProduct(id)
  return NextResponse.json({ success: true })
}
