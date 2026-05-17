"use client";
import { useScrollReveal } from "@/lib/useScrollReveal";
import type { getContent } from "@/lib/i18n";

type TestimonialsContent = ReturnType<typeof getContent>["testimonials"];

export function Testimonials({ content: c }: { content: TestimonialsContent }) {
  const ref = useScrollReveal() as React.RefObject<HTMLElement>;
  if (!c.items.length) return null;
  return (
    <section ref={ref} className="section-padding bg-bg-surface/30 border-y border-bg-border relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 40% 60% at 0% 50%, rgba(0,212,168,0.05), transparent)" }} />

      <div className="section-container relative z-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-12">
          <div>
            <div className="badge-teal reveal mb-4">{c.badge}</div>
            <h2 className="section-headline reveal reveal-delay-1">{c.headline}</h2>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {c.items.map((item, i) => (
            <div key={i}
              className={`testimonial-card reveal reveal-delay-${i + 1} flex flex-col group hover:-translate-y-1 transition-transform duration-300`}>
              <div className="font-display text-6xl text-accent/20 leading-none mb-4 select-none" aria-hidden>&ldquo;</div>
              <p className="text-sm text-text-secondary leading-relaxed flex-1 mb-6 italic">{item.quote}</p>
              <div className="badge-teal self-start mb-5">✓ {item.result}</div>
              <div className="flex items-center gap-3 pt-5 border-t border-bg-border">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/30 to-teal/30 flex items-center justify-center text-xs font-semibold font-body text-text-primary flex-shrink-0">
                  {item.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div>
                  <p className="text-sm font-medium text-text-primary leading-none mb-0.5 font-body">{item.name}</p>
                  <p className="text-xs text-text-tertiary font-body">{item.role} · {item.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
