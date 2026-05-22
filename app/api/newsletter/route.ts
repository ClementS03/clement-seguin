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
    // 5 subscribe attempts per 10 minutes per IP
    const ip = getClientIp(req);
    const { allowed, resetMs } = rateLimit(`newsletter:${ip}`, {
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

    const { email: rawEmail } = await req.json();

    if (!rawEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
      return NextResponse.json({ error: "Invalid email." }, { status: 400 });
    }

    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY missing");
      return NextResponse.json(
        { error: "Email service not configured." },
        { status: 500 },
      );
    }

    // Escaped version — for HTML output only. Never for `to:` or audience APIs.
    const emailDisplay = esc(rawEmail);
    const resend = new Resend(process.env.RESEND_API_KEY);
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://clement-seguin.fr";
    const unsubscribeToken = Buffer.from(rawEmail).toString("base64url");
    const unsubscribeUrl = `${siteUrl}/api/unsubscribe?email=${encodeURIComponent(rawEmail)}&token=${unsubscribeToken}`;

    // Add to Resend audience if configured
    if (process.env.RESEND_AUDIENCE_ID) {
      await resend.contacts.create({
        email: rawEmail,
        audienceId: process.env.RESEND_AUDIENCE_ID,
        unsubscribed: false,
      });
    }

    // Notify Clément
    await resend.emails.send({
      from: "Newsletter <noreply@clement-seguin.fr>",
      to: [process.env.CONTACT_EMAIL_TO || "contact@clement-seguin.fr"],
      subject: `New newsletter subscriber — ${emailDisplay}`,
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto;">
          <h2 style="color: #2D9E6B;">New newsletter subscriber</h2>
          <p>Email: <strong><a href="mailto:${emailDisplay}" style="color: #2D9E6B;">${emailDisplay}</a></strong></p>
        </div>
      `,
    });

    // Welcome email to the subscriber — use raw email for `to:`, not escaped
    await resend.emails.send({
      from: "Clément Seguin <noreply@clement-seguin.fr>",
      to: [rawEmail],
      subject: "You'll be notified about the next article",
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; background: #07080A; color: #EDF2ED; padding: 40px 32px; border-radius: 12px;">
          <h2 style="color: #2D9E6B; margin-bottom: 16px;">You're in.</h2>
          <p style="color: #8A9A8B; line-height: 1.7;">
            You'll be notified as soon as the next article goes live — tips on web design, UX, and automation for B2B consultants and founders.
          </p>
          <p style="color: #8A9A8B; line-height: 1.7; margin-top: 12px;">
            In the meantime, if you'd like to talk about a project:
          </p>
          <a href="${siteUrl}/#contact"
            style="display: inline-block; margin-top: 16px; padding: 12px 24px; background: #2D9E6B; color: white; text-decoration: none; border-radius: 8px; font-weight: 600;">
            Book a free call →
          </a>
          <p style="margin-top: 32px; color: #4A574B; font-size: 13px;">
            <a href="${unsubscribeUrl}" style="color: #4A574B;">Unsubscribe in 1 click</a> — no spam, ever.
          </p>
        </div>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Newsletter error:", err);
    return NextResponse.json(
      { error: "Couldn't subscribe right now. Please try again in a moment." },
      { status: 500 },
    );
  }
}
