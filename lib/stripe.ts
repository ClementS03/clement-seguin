import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function stripeCreateProduct(
  name: string,
  description: string,
  imageUrl?: string
): Promise<string> {
  const product = await stripe.products.create({
    name,
    description: description || undefined,
    images: imageUrl ? [imageUrl] : undefined,
  })
  return product.id
}

export async function stripeCreatePrice(
  productId: string,
  priceEur: number
): Promise<string> {
  const price = await stripe.prices.create({
    product: productId,
    unit_amount: Math.round(priceEur * 100),
    currency: "eur",
  })
  return price.id
}

export async function stripeCreatePaymentLink(
  priceId: string,
  productName: string
): Promise<string> {
  const link = await stripe.paymentLinks.create({
    line_items: [{ price: priceId, quantity: 1 }],
    metadata: { product_name: productName },
    after_completion: {
      type: "redirect",
      redirect: { url: `${process.env.NEXT_PUBLIC_SITE_URL}/merci` },
    },
  })
  return link.url
}

export async function stripeUpdateProduct(
  productId: string,
  name: string,
  description: string
): Promise<void> {
  await stripe.products.update(productId, {
    name,
    description: description || undefined,
  })
}

export async function stripeArchiveProduct(productId: string): Promise<void> {
  await stripe.products.update(productId, { active: false })
}

export { stripe }
