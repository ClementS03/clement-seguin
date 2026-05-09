import { NextRequest, NextResponse } from "next/server"
import { getProductById, airtableUpdateProduct, airtableDeleteProduct } from "@/lib/airtable"
import { lsCreateProduct, lsCreateVariant, lsCheckoutUrl, lsUpdateProduct, lsUpdateVariant, lsDeleteProduct } from "@/lib/lemonsqueezy"

type Params = { params: Promise<{ id: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const token = req.cookies.get("admin_token")?.value
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await req.json() as {
    name: string; slug: string; tagline: string; description: string
    price: number; category: string; imageUrl: string; featured: boolean; status: string
  }

  const current = await getProductById(id)
  if (!current) return NextResponse.json({ error: "Product not found" }, { status: 404 })

  try {
    const isDraft = current.status === "Draft" || !current.lsVariantId
    const isPublishing = isDraft && body.status === "Active"
    const staysActive = !isDraft && body.status === "Active"

    let lsProductId = current.lsProductId
    let lsVariantId = current.lsVariantId
    let buyUrl = current.buyUrl

    if (isPublishing) {
      // Draft → Active : create in LS for the first time
      lsProductId = await lsCreateProduct(body.name, body.description ?? "")
      lsVariantId = await lsCreateVariant(lsProductId, body.price)
      buyUrl = lsCheckoutUrl(lsVariantId)
    } else if (staysActive && lsProductId && lsVariantId) {
      // Active → Active : sync changes to LS
      await lsUpdateProduct(lsProductId, body.name, body.description ?? "")
      if (body.price !== current.price) {
        await lsUpdateVariant(lsVariantId, body.price)
      }
    }

    const product = await airtableUpdateProduct(id, {
      name: body.name,
      slug: body.slug,
      tagline: body.tagline,
      description: body.description,
      price: body.price,
      category: body.category,
      imageUrl: body.imageUrl,
      featured: body.featured,
      status: body.status,
      buyUrl,
      lsProductId,
      lsVariantId,
    })

    return NextResponse.json({ success: true, product, buyUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
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

  let lsWarning: string | undefined

  if (current.lsProductId) {
    try {
      await lsDeleteProduct(current.lsProductId)
    } catch (err) {
      lsWarning = err instanceof Error ? err.message : "LS delete failed"
    }
  }

  await airtableDeleteProduct(id)
  return NextResponse.json({ success: true, ...(lsWarning && { lsWarning }) })
}
