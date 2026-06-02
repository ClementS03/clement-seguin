import type { getContent } from "@/lib/i18n";

type ProcessContent = ReturnType<typeof getContent>["process"];

export function Process({ content: c }: { content: ProcessContent }) {
  return (
    <section id="process" className="section-padding bg-bg-surface/40 border-y border-bg-border relative">
      <div aria-hidden className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 50% 60% at 80% 50%, rgba(78,203,168,0.05), transparent)" }} />
      <div className="section-container relative z-10">
        {/* Header */}
        <div className="max-w-2xl mb-16 lg:mb-24">
          <div className="badge reveal mb-6">{c.badge}</div>
          <h2 className="section-headline reveal reveal-delay-1 mb-4">
            {c.headline[0]} <em className="not-italic gradient-text-teal">{c.headline[1]}</em>
          </h2>
          <p className="section-subheadline reveal reveal-delay-2">{c.subtitle}</p>
        </div>

        <div className="relative">
          {/*
           * Ligne verticale — z-0, la boîte step-box est z-1
           * donc la ligne passe DERRIÈRE la boîte, plus de ligne visible au hover
           */}
          <div
            aria-hidden
            className="absolute left-[39px] top-0 bottom-0 w-px hidden lg:block"
            style={{
              background: "linear-gradient(to bottom, rgba(78,203,168,0.35) 0%, rgba(45,158,107,0.15) 60%, transparent 100%)",
              zIndex: 0,
            }}
          />

          <div className="flex flex-col gap-6">
            {c.steps.map((step, i) => (
              <div
                key={i}
                className={`reveal reveal-delay-${i + 1} flex flex-col lg:flex-row items-start gap-6 lg:gap-8 group`}
              >
                {/* Step number box — z-1 couvre la ligne */}
                <div className="relative flex-shrink-0" style={{ zIndex: 1 }}>
                  <div className="step-box w-20 h-20 rounded-2xl border border-bg-border flex items-center justify-center transition-all duration-300 group-hover:border-accent/30">
                    {/* Numéro — classe CSS, pas inline style → pas de hydration error */}
                    <span className="font-display text-lg tracking-tighter text-gradient-step">
                      {step.number}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 pt-3 pb-8 border-b border-bg-border last:border-b-0">
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <h3 className="font-body font-semibold text-xl text-text-primary">
                      {step.title}
                    </h3>
                    {/* Badge étape — classe CSS, couleur teal */}
                    <span className="step-badge text-xs text-teal border border-teal/30 px-3 py-1 rounded-full flex-shrink-0 font-body"
                      style={{ background: "rgba(78,203,168,0.08)" }}>
                      {step.duration}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary leading-relaxed max-w-xl">
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
