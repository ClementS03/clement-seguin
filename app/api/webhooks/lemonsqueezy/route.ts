import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";
import { Resend } from "resend";

type LSAttributes = {
  status: string;
  user_email: string;
  user_name: string;
  total_formatted: string;
  receipt_url: string;
};

type LSPayload = {
  meta: { event_name: string };
  data: { attributes: LSAttributes };
  included?: Array<{ type: string; attributes: { product_name: string } }>;
};

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const signature = req.headers.get("X-Signature") ?? "";
  const secret = process.env.LEMONSQUEEZY_WEBHOOK_SECRET;

  if (!secret) {
    return NextResponse.json({ error: "Server misconfiguration" }, { status: 500 });
  }

  const digest = createHmac("sha256", secret).update(rawBody).digest("hex");
  if (digest !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  let payload: LSPayload;
  try {
    payload = JSON.parse(rawBody) as LSPayload;
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const eventName = payload.meta?.event_name;
  const attrs = payload.data?.attributes;

  const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

  if (eventName === "order_created" && attrs?.status === "paid") {
    const email = attrs.user_email;
    const firstName = (attrs.user_name ?? "").split(" ")[0] || "there";
    const receiptUrl = attrs.receipt_url;
    const totalFormatted = attrs.total_formatted;
    const productName =
      payload.included?.find((i) => i.type === "order-items")?.attributes?.product_name ??
      "your purchase";

    if (email && resend) {
      await resend.emails.send({
        from: "Clément Seguin <noreply@clement-seguin.fr>",
        to: [email],
        subject: `Your download is ready — ${productName}`,
        html: buildDeliveryEmail({ firstName, productName, totalFormatted, receiptUrl }),
      });
    }
  }

  if (eventName === "order_refunded") {
    const email = attrs?.user_email;
    const name = attrs?.user_name ?? "Unknown";
    const totalFormatted = attrs?.total_formatted ?? "";
    const productName =
      payload.included?.find((i) => i.type === "order-items")?.attributes?.product_name ??
      "unknown product";

    if (resend) {
      await resend.emails.send({
        from: "Clément Seguin <noreply@clement-seguin.fr>",
        to: [process.env.CONTACT_EMAIL_TO ?? "contact@clement-seguin.fr"],
        subject: `⚠️ Refund — ${productName}`,
        html: `<p><strong>${name}</strong> (${email}) has been refunded <strong>${totalFormatted}</strong> for <strong>${productName}</strong>.</p>`,
      });
    }
  }

  return NextResponse.json({ received: true });
}

function buildDeliveryEmail({
  firstName,
  productName,
  totalFormatted,
  receiptUrl,
}: {
  firstName: string;
  productName: string;
  totalFormatted: string;
  receiptUrl: string;
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
      You&apos;re all set, ${firstName}! 🎉
    </h1>

    <p style="color:#8A9A8B;font-size:16px;line-height:1.7;margin:0 0 8px;">
      Thanks for purchasing <strong style="color:#EDF2ED;">${productName}</strong>.
    </p>
    <p style="color:#8A9A8B;font-size:16px;line-height:1.7;margin:0 0 32px;">
      Order total: <strong style="color:#EDF2ED;">${totalFormatted}</strong> — your download is ready below.
    </p>

    <a href="${receiptUrl}"
       style="display:inline-block;background:#2D9E6B;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;font-size:16px;font-weight:600;margin-bottom:32px;">
      Access your download →
    </a>

    <p style="color:#8A9A8B;font-size:14px;line-height:1.7;margin:0 0 40px;">
      Save this link — you can also retrieve your purchases anytime at
      <a href="https://app.lemonsqueezy.com/my-orders" style="color:#2D9E6B;text-decoration:none;">app.lemonsqueezy.com/my-orders</a>.
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
</html>`;
}
