// SERVER COMPONENT — pas de "use client"
import Link from "next/link";
import type { getContent } from "@/lib/i18n";

type HeroContent = ReturnType<typeof getContent>["hero"];

export function Hero({ content: c }: { content: HeroContent }) {
  return (
    <section className="relative min-h-screen flex flex-col justify-center pt-24 pb-16 overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none hero-glow" />
      <div aria-hidden className="absolute inset-0 pointer-events-none opacity-[0.022] hero-grid" />

      <div className="section-container relative z-10">
        <div className="max-w-4xl">
          <div className="badge-accent mb-8 animate-fade-up">
            <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
            {c.badge}
          </div>

          <h1
            className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-[82px] leading-[1.02] tracking-tight text-text-primary mb-6 animate-fade-up"
            style={{ animationDelay: "0.05s" }}
          >
            {c.headline[0]}{" "}
            <em className="not-italic text-gradient-hero">{c.headline[1]}</em>
          </h1>

          <p
            className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed mb-10 animate-fade-up"
            style={{ animationDelay: "0.1s" }}
          >
            {c.subheadline}
          </p>

          <div
            className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-16 animate-fade-up"
            style={{ animationDelay: "0.2s" }}
          >
            <Link href={c.ctaPrimary.href} className="btn-primary btn-lg">
              {c.ctaPrimary.label}
            </Link>
            <Link href={c.ctaSecondary.href} className="btn-ghost btn-lg">
              {c.ctaSecondary.label}
            </Link>
          </div>

          <div
            className="flex flex-wrap items-center gap-8 pb-8 border-b border-bg-border animate-fade-up"
            style={{ animationDelay: "0.3s" }}
          >
            {c.stats.map((stat, i) => (
              <div key={i} className="flex flex-col">
                <span className="font-display text-3xl text-text-primary tracking-tight">{stat.value}</span>
                <span className="text-xs text-text-secondary uppercase tracking-wider mt-0.5 font-body">{stat.label}</span>
              </div>
            ))}
          </div>

          <p className="mt-6 text-xs text-text-tertiary tracking-wide">{c.trust}</p>
          {c.builderProof && (
            <p className="mt-2 text-xs text-teal/80 tracking-wide">{c.builderProof}</p>
          )}
        </div>
      </div>

      <div aria-hidden className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] pointer-events-none hidden xl:block">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className={`absolute rounded-full border border-[rgba(255,255,255,0.03)] animate-float ring-${i}`} />
        ))}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-accent opacity-60 animate-glow-pulse" />
        </div>
      </div>
    </section>
  );
}
