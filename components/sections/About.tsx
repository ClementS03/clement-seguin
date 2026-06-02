import type { getContent } from "@/lib/i18n";

type AboutContent = ReturnType<typeof getContent>["about"];

export function About({ content: c }: { content: AboutContent }) {
  return (
    <section id="about" className="section-padding relative">
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 60% at 80% 50%, rgba(255,92,0,0.04), transparent)" }} />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Visual card */}
          <div className="reveal order-2 lg:order-1">
            <div className="relative aspect-square max-w-md mx-auto lg:mx-0">
              <div className="card h-full flex flex-col justify-between p-8 border-[rgba(255,255,255,0.08)]"
                style={{ background: "linear-gradient(135deg, #0F0F14 0%, #07070A 100%)" }}>
                <div>
                  {/* Fake browser bar */}
                  <div className="flex items-center gap-2 mb-6 pb-4 border-b border-bg-border">
                    <div className="flex gap-1.5">
                      {[0,1,2].map(i => <div key={i} className="w-2.5 h-2.5 rounded-full bg-[rgba(255,255,255,0.08)]" />)}
                    </div>
                    <div className="flex-1 h-5 bg-bg-elevated rounded-md flex items-center px-2">
                      <span className="text-2xs text-text-tertiary font-mono">votrenom.fr</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-8 bg-bg-elevated rounded-lg w-3/4" />
                    <div className="h-4 bg-bg-elevated rounded w-full opacity-60" />
                    <div className="h-4 bg-bg-elevated rounded w-5/6 opacity-40" />
                    <div className="h-4 bg-bg-elevated rounded w-4/6 opacity-30" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <div className="h-10 bg-accent/20 border border-accent/30 rounded-lg flex-1" />
                    <div className="h-10 bg-bg-elevated rounded-lg w-28 opacity-50" />
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-3 border-t border-bg-border">
                    {[{ v: "98", l: "Perf." }, { v: "A+", l: "SEO" }, { v: "5j", l: "Livré" }].map((m) => (
                      <div key={m.l} className="text-center p-2 bg-bg-elevated rounded-lg">
                        <p className="text-sm font-display text-teal">{m.v}</p>
                        <p className="text-2xs text-text-tertiary font-body">{m.l}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 badge-accent shadow-lg">Webflow + IA</div>
            </div>
          </div>

          {/* Text */}
          <div className="order-1 lg:order-2">
            <div className="badge reveal mb-6">{c.badge}</div>
            <h2 className="section-headline reveal reveal-delay-1 mb-6">{c.headline}</h2>
            <div className="space-y-4 mb-8">
              {c.paragraphs.map((para, i) => (
                <p key={i} className={`text-sm text-text-secondary leading-relaxed reveal reveal-delay-${i + 2}`}>{para}</p>
              ))}
            </div>
            <div className="reveal reveal-delay-3 mb-6">
              <p className="text-xs text-text-tertiary uppercase tracking-widest mb-3 font-body">{c.skillsLabel}</p>
              <div className="flex flex-wrap gap-2">
                {c.skills.map((skill) => <span key={skill} className="pill">{skill}</span>)}
              </div>
            </div>
            <div className="reveal reveal-delay-4 p-4 rounded-xl bg-bg-surface border border-bg-border">
              <p className="text-sm text-text-secondary">{c.currently}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
