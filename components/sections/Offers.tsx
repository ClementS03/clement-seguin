import Link from "next/link";
import { cn } from "@/lib/utils";
import type { getContent } from "@/lib/i18n";

type OffersContent = ReturnType<typeof getContent>["offers"];

export function Offers({ content: c }: { content: OffersContent }) {
  return (
    <section id="offres" className="section-padding relative">
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 80% 40% at 50% 0%, rgba(255,92,0,0.07), transparent 60%)" }} />

      <div className="section-container relative z-10">
        <div className="max-w-2xl mb-16">
          <div className="badge reveal mb-6">{c.badge}</div>
          <h2 className="section-headline reveal reveal-delay-1 mb-4">
            {c.headline[0]} <em className="not-italic gradient-text-accent">{c.headline[1]}</em>
          </h2>
          <p className="section-subheadline reveal reveal-delay-2 mb-2">{c.subtitle}</p>
          <p className="text-xs text-text-tertiary reveal reveal-delay-2 mt-2">{c.acompteNote}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 lg:gap-6 mb-12">
          {c.items.map((offer, i) => (
            <div key={offer.id}
              className={cn(
                "reveal flex flex-col rounded-2xl border transition-all duration-300 overflow-hidden",
                `reveal-delay-${i + 1}`,
                offer.featured
                  ? "border-accent/40 bg-gradient-to-b from-[rgba(255,92,0,0.06)] to-bg-surface relative"
                  : "border-bg-border bg-bg-surface hover:border-[rgba(255,255,255,0.12)]"
              )}
            >
              {offer.featured && (
                <div aria-hidden className="absolute -inset-px rounded-2xl pointer-events-none"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,92,0,0.25) 0%, transparent 50%, rgba(0,212,168,0.1) 100%)",
                    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                    maskComposite: "exclude",
                    WebkitMaskComposite: "xor",
                    padding: "1px",
                  }}
                />
              )}

              {offer.badge && (
                <div className="px-6 pt-5">
                  <span className="badge-accent text-xs">{offer.badge}</span>
                </div>
              )}

              <div className="p-6 pt-5 flex flex-col flex-1">
                <p className="text-xs text-text-tertiary uppercase tracking-widest font-body mb-3">{offer.name}</p>

                <div className="mb-2">
                  <div className="flex items-end gap-1">
                    <span className={cn("font-display text-5xl tracking-tight",
                      offer.featured ? "gradient-text-accent" : "text-text-primary")}>
                      {offer.price}<span className="text-3xl">{offer.currency}</span>
                    </span>
                    <span className="text-xs text-text-tertiary pb-2">{offer.vat}</span>
                  </div>
                  <p className="text-xs text-teal mt-1 font-body">{c.deliveryLabel} {offer.delivery}</p>
                </div>

                <p className="text-sm text-text-secondary leading-relaxed mb-5 pb-5 border-b border-bg-border">{offer.tagline}</p>
                <p className="text-xs text-text-secondary leading-relaxed mb-5">{offer.description}</p>

                <ul className="check-list flex-1 mb-6">
                  {offer.features.map((feat, fi) => <li key={fi}>{feat}</li>)}
                </ul>

                {offer.notIncluded.length > 0 && (
                  <div className="mb-6">
                    <p className="text-2xs text-text-tertiary uppercase tracking-widest mb-2 font-body">{c.notIncludedLabel}</p>
                    <ul className="cross-list">
                      {offer.notIncluded.map((item, ni) => <li key={ni}>{item}</li>)}
                    </ul>
                  </div>
                )}

                <div className="mb-6 p-3 rounded-xl bg-bg-elevated border border-bg-border">
                  <p className="text-2xs text-text-tertiary uppercase tracking-widest mb-1 font-body">{c.forWhoLabel}</p>
                  <p className="text-xs text-text-secondary leading-relaxed">{offer.forWho}</p>
                </div>

                <Link href="#contact"
                  className={cn("btn w-full text-center", offer.featured ? "btn-primary" : "btn-secondary")}>
                  {offer.cta}
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Maintenance addon */}
        <div className="reveal card border-teal/20 bg-gradient-to-r from-teal/5 to-transparent">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-teal/10 flex items-center justify-center text-teal text-lg flex-shrink-0">🔄</div>
              <div>
                <h3 className="font-body font-semibold text-base text-text-primary mb-1">
                  {c.addon.title} <span className="text-teal font-normal font-body">— {c.addon.price}</span>
                </h3>
                <p className="text-xs text-text-secondary mb-3">{c.addon.note}</p>
                <ul className="flex flex-wrap gap-x-4 gap-y-1">
                  {c.addon.features.map((f, fi) => (
                    <li key={fi} className="text-xs text-text-secondary flex items-center gap-1.5">
                      <span className="text-teal">→</span> {f}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <Link href="#contact" className="btn-secondary flex-shrink-0">{c.addon.cta}</Link>
          </div>
        </div>
      </div>
    </section>
  );
}
