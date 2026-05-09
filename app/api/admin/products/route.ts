import { NextRequest, NextResponse } from "next/server"
import { lsCreateProduct, lsCreateVariant, lsCheckoutUrl } from "@/lib/lemonsqueezy"
import { airtableCreateProduct } from "@/lib/airtable"

type ProductPayload = {
  name: string; slug: string; tagline: string; description?: string
  price: number; category?: string; imageUrl?: string; featured?: boolean; status?: string
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json() as ProductPayload
  const { name, slug, tagline, description = "", price, category = "", imageUrl = "", featured = false, status = "Active" } = body

  if (!name || !slug || !tagline || !price || price <= 0) {
    return NextResponse.json({ error: "Champs requis manquants ou prix invalide." }, { status: 400 })
  }

  try {
    const isDraft = status === "Draft"
    let lsProductId = ""
    let lsVariantId = ""
    let buyUrl = ""

    if (!isDraft) {
      lsProductId = await lsCreateProduct(name, description)
      lsVariantId = await lsCreateVariant(lsProductId, price)
      buyUrl = lsCheckoutUrl(lsVariantId)
    }

    const product = await airtableCreateProduct({
      name, slug, tagline, description, price, category, imageUrl, featured,
      draft: isDraft,
      lsProductId, lsVariantId, buyUrl,
    })

    return NextResponse.json({ success: true, product, buyUrl: buyUrl || undefined })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    console.error("[admin/products POST]", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
