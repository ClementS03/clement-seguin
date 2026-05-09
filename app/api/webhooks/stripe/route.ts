import { NextRequest, NextResponse } from "next/server"
import { getStripeInstance } from "@/lib/stripe"
import { Resend } from "resend"
import type Stripe from "stripe"

export async function POST(req: NextRequest) {
  const rawBody = await req.text()
  const signature = req.headers.get("stripe-signature") ?? ""
  const secret = process.env.STRIPE_WEBHOOK_SECRET

  if (!secret) return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 })

  let event: Stripe.Event
  try {
    event = getStripeInstance().webhooks.constructEvent(rawBody, signature, secret)
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as {
      payment_status: string
      customer_details: { email?: string | null; name?: string | null } | null
      amount_total: number | null
      metadata: Record<string, string> | null
    }
    if (session.payment_status !== "paid") return NextResponse.json({ received: true })

    const email = session.customer_details?.email
    const firstName = (session.customer_details?.name ?? "").split(" ")[0] || "there"
    const totalFormatted = session.amount_total
      ? `€${(session.amount_total / 100).toFixed(2)}`
      : ""
    const productName = session.metadata?.product_name ?? "your purchase"

    if (email && resend) {
      await resend.emails.send({
        from: "Clément Seguin <noreply@clement-seguin.fr>",
        to: [email],
        subject: `Your purchase is confirmed — ${productName}`,
        html: buildDeliveryEmail({ firstName, productName, totalFormatted }),
      })
    }
  }

  if (event.type === "charge.refunded") {
    const charge = event.data.object as { billing_details: { name?: string | null; email?: string | null } | null; amount_refunded: number; id: string }
    if (resend) {
      await resend.emails.send({
        from: "Clément Seguin <noreply@clement-seguin.fr>",
        to: [process.env.CONTACT_EMAIL_TO ?? "contact@clement-seguin.fr"],
        subject: `⚠️ Refund — ${charge.billing_details?.name ?? charge.id}`,
        html: `<p><strong>${charge.billing_details?.name}</strong> (${charge.billing_details?.email}) refunded <strong>€${(charge.amount_refunded / 100).toFixed(2)}</strong>.</p>`,
      })
    }
  }

  return NextResponse.json({ received: true })
}

function buildDeliveryEmail({ firstName, productName, totalFormatted }: {
  firstName: string; productName: string; totalFormatted: string
}) {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#07080A;font-family:system-ui,sans-serif;">
  <div style="max-width:580px;margin:0 auto;padding:48px 24px;">
    <div style="margin-bottom:40px;">
      <span style="font-size:22px;font-weight:700;color:#2D9E6B;letter-spacing:-0.5px;">Clément Seguin</span>
    </div>
    <h1 style="font-size:30px;color:#EDF2ED;margin:0 0 16px;line-height:1.2;">
      You're all set, ${firstName}! 🎉
    </h1>
    <p style="color:#8A9A8B;font-size:16px;line-height:1.7;margin:0 0 8px;">
      Thanks for purchasing <strong style="color:#EDF2ED;">${productName}</strong>.
    </p>
    <p style="color:#8A9A8B;font-size:16px;line-height:1.7;margin:0 0 32px;">
      Order total: <strong style="color:#EDF2ED;">${totalFormatted}</strong>
    </p>
    <p style="color:#8A9A8B;font-size:14px;line-height:1.7;margin:0 0 40px;">
      You'll receive your download in a separate email from Stripe. You can also access
      your purchases anytime at
      <a href="https://billing.stripe.com" style="color:#2D9E6B;text-decoration:none;">billing.stripe.com</a>.
    </p>
    <hr style="border:none;border-top:1px solid #141A15;margin-bottom:32px;">
    <p style="color:#8A9A8B;font-size:14px;margin:0 0 8px;">
      Questions? Just reply to this email — I read every message.
    </p>
    <p style="color:#4A5A4B;font-size:12px;margin:0;">
      Clément Seguin ·
      <a href="https://clement-seguin.fr/boutique" style="color:#4A5A4B;">clement-seguin.fr</a>
    </p>
  </div>
</body>
</html>`
}
