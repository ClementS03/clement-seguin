import Stripe from "stripe"

function plainText(md: string): string {
  return md
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/\*\*(.+?)\*\*/g, "$1")
    .replace(/\*(.+?)\*/g, "$1")
    .replace(/\[(.+?)\]\(.+?\)/g, "$1")
    .replace(/^[-*+]\s+/gm, "• ")
    .replace(/^\d+\.\s+/gm, "")
    .trim()
}

let _stripe: Stripe | null = null

function getStripe(): Stripe {
  if (!_stripe) {
    if (!process.env.STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY not configured")
    _stripe = new Stripe(process.env.STRIPE_SECRET_KEY)
  }
  return _stripe
}

export async function stripeCreateProduct(
  name: string,
  description: string,
  imageUrl?: string,
  features?: string[]
): Promise<string> {
  const plain = description ? plainText(description) : undefined
  const product = await getStripe().products.create({
    name,
    description: plain || undefined,
    images: imageUrl ? [imageUrl] : undefined,
    marketing_features: features?.filter(Boolean).map(f => ({ name: f })),
  })
  return product.id
}

export async function stripeCreatePrice(productId: string, priceEur: number): Promise<string> {
  const price = await getStripe().prices.create({
    product: productId,
    unit_amount: Math.round(priceEur * 100),
    currency: "eur",
  })
  return price.id
}

export async function stripeCreatePaymentLink(priceId: string, productName: string): Promise<string> {
  const link = await getStripe().paymentLinks.create({
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { product_name: productName, stripe_price_id: priceId },
    allow_promotion_codes: true,
    after_completion: {
      type: "redirect",
      redirect: { url: `${process.env.NEXT_PUBLIC_SITE_URL}/merci` },
    },
  })
  return link.url
}

export async function stripeUpdateProduct(productId: string, name: string, description: string, features?: string[]): Promise<void> {
  const plain = description ? plainText(description) : undefined
  await getStripe().products.update(productId, {
    name,
    description: plain || undefined,
    marketing_features: features?.filter(Boolean).map(f => ({ name: f })) ?? [],
  })
}

export async function stripeArchiveProduct(productId: string): Promise<void> {
  await getStripe().products.update(productId, { active: false })
}

export function getStripeInstance(): Stripe {
  return getStripe()
}
