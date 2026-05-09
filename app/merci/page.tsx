import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank you! — Clément Seguin",
  robots: { index: false, follow: false },
};

export default function MerciPage() {
  return (
    <main className="min-h-screen bg-bg-base flex items-center justify-center pt-24 pb-16">
      <div className="section-container max-w-lg text-center flex flex-col items-center gap-8">

        <div className="w-16 h-16 rounded-full bg-bg-elevated border border-bg-border flex items-center justify-center text-3xl">
          🎉
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="font-display text-4xl md:text-5xl text-text-primary leading-tight">
            You&apos;re all set!
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            Your purchase was confirmed. Check your inbox — the download link is on its way.
          </p>
        </div>

        <div className="card w-full text-left">
          <p className="text-text-secondary text-sm leading-relaxed">
            Didn&apos;t receive an email? Check your spam folder or access your purchases directly at{" "}
            <a
              href="https://app.lemonsqueezy.com/my-orders"
              target="_blank"
              rel="noopener noreferrer"
              className="text-accent hover:underline"
            >
              app.lemonsqueezy.com/my-orders
            </a>
            .
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link href="/shop" className="btn-secondary">
            ← Back to shop
          </Link>
          <Link href="/" className="btn-primary">
            Home →
          </Link>
        </div>

      </div>
    </main>
  );
}
