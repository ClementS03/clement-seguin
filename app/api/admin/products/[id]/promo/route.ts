import { NextRequest, NextResponse } from "next/server"
import { getProductById } from "@/lib/airtable"
import { getStripeInstance } from "@/lib/stripe"

type Params = { params: Promise<{ id: string }> }

export async function POST(req: NextRequest, { params }: Params) {
  const token = req.cookies.get("admin_token")?.value
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const product = await getProductById(id)
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 })
  if (!product.stripeProductId) return NextResponse.json({ error: "Product not in Stripe" }, { status: 400 })

  const body = await req.json() as {
    code?: string
    type: "percent" | "fixed"
    amount: number
    maxRedemptions?: number
  }

  if (!body.amount || body.amount <= 0) {
    return NextResponse.json({ error: "Invalid discount amount" }, { status: 400 })
  }

  const stripe = getStripeInstance()

  const coupon = await stripe.coupons.create({
    ...(body.type === "percent"
      ? { percent_off: body.amount }
      : { amount_off: Math.round(body.amount * 100), currency: "eur" }),
    duration: "once",
    applies_to: { products: [product.stripeProductId] },
    ...(body.maxRedemptions && { max_redemptions: body.maxRedemptions }),
    name: `${body.amount}${body.type === "percent" ? "%" : "€"} off ${product.name}`,
  })

  const promoCode = await stripe.promotionCodes.create({
    coupon: coupon.id,
    ...(body.code && { code: body.code.toUpperCase() }),
    ...(body.maxRedemptions && { max_redemptions: body.maxRedemptions }),
  })

  return NextResponse.json({ code: promoCode.code })
}
