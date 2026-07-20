// components/sections/ForWho.tsx
import type { SiteContent } from "@/lib/i18n"

type ForWhoContent = SiteContent["forWho"]

export function ForWho({ content }: { content: ForWhoContent }) {
  return (
    <section className="section-padding">
      <div className="section-container">
        <div className="text-center mb-16">
          <span className="badge-accent mb-6 inline-block">{content.badge}</span>
          <h2 className="section-headline">
            {content.headline[0]}{" "}
            <span className="gradient-text-accent">{content.headline[1]}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.personas.map((persona) => (
            <div key={persona.title} className="card card-hover p-8 text-center">
              <div className="text-4xl mb-5" aria-hidden="true">{persona.icon}</div>
              <h3 className="font-display text-xl text-text-primary mb-4">
                {persona.title}
              </h3>
              <p className="text-sm text-text-secondary leading-relaxed">{persona.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
