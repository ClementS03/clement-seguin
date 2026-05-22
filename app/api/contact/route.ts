import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, getClientIp } from "@/lib/rate-limit";

function esc(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export async function POST(req: NextRequest) {
  try {
    // 5 inquiries per 10 minutes per IP
    const ip = getClientIp(req);
    const { allowed, resetMs } = rateLimit(`contact:${ip}`, {
      limit: 5,
      windowMs: 10 * 60 * 1000,
    });
    if (!allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please try again in a few minutes." },
        {
          status: 429,
          headers: { "Retry-After": String(Math.ceil(resetMs / 1000)) },
        },
      );
    }

    const body = await req.json();
    const { name: rawName, email: rawEmail, activity: rawActivity, site: rawSite, offer: rawOffer, message: rawMessage } = body;
    const [name, email, activity, site, offer, message] = [rawName, rawEmail, rawActivity, rawSite, rawOffer, rawMessage].map(
      (v: string | undefined) => (v ? esc(String(v)) : "")
    );

    if (!rawName || !rawEmail || !rawActivity || !rawOffer) {
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 },
      );
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY missing");
      return NextResponse.json(
        { error: "Email service not configured." },
        { status: 500 },
      );
    }

    // Init à la demande — pas au build
    const resend = new Resend(process.env.RESEND_API_KEY);

    await resend.emails.send({
      // Utilise onboarding@resend.dev si le domaine n'est pas encore vérifié
      // Une fois clement-seguin.fr vérifié dans Resend → remplacer par :
      // from: "Clément Seguin <noreply@clement-seguin.fr>",
      from: "Contact Form <noreply@clement-seguin.fr>",
      to: [process.env.CONTACT_EMAIL_TO || "contact@clement-seguin.fr"],
      replyTo: rawEmail,
      subject: `New inquiry — ${offer}`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2D9E6B; margin-bottom: 24px;">
            New contact inquiry
          </h2>

          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666; width: 140px;">Name</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600;">${name}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Email</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">
                <a href="mailto:${email}" style="color: #2D9E6B;">${email}</a>
              </td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Activity</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${activity}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Current site</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee;">${site || "—"}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; color: #666;">Offer</td>
              <td style="padding: 10px 0; border-bottom: 1px solid #eee; font-weight: 600; color: #2D9E6B;">${offer}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; color: #666; vertical-align: top;">Message</td>
              <td style="padding: 10px 0;">${message || "—"}</td>
            </tr>
          </table>

          <div style="margin-top: 32px; padding: 16px; background: #f0faf5; border-radius: 8px;">
            <p style="margin: 0; color: #666; font-size: 14px;">
              Replying to this email will reply directly to <strong>${email}</strong>
            </p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Resend error:", err);
    return NextResponse.json(
      {
        error:
          "Couldn't send the message. Please try again or email me directly at contact@clement-seguin.fr.",
      },
      { status: 500 },
    );
  }
}
