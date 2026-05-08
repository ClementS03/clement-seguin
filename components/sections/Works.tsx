"use client"

import { useScrollReveal } from "@/lib/useScrollReveal"
import { FeatureCarousel, type CarouselProject } from "@/components/ui/animated-feature-carousel"
import type { getContent } from "@/lib/i18n"

type WorksContent = ReturnType<typeof getContent>["works"]

// thum.io: free CDN screenshot service, caches automatically, no API key needed
function screenshotUrl(url: string) {
  return `https://image.thum.io/get/width/1200/crop/630/${url}`
}

export function Works({ content: c }: { content: WorksContent }) {
  const ref = useScrollReveal() as React.RefObject<HTMLElement>

  const projects: CarouselProject[] = c.projects.map((p) => ({
    ...p,
    screenshot: screenshotUrl(p.url),
    visitLabel: c.visitLabel,
  }))

  return (
    <section
      id="realisations"
      ref={ref}
      className="section-padding relative overflow-hidden"
    >
      {/* Subtle bg accent */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 50% 60% at 100% 0%, rgba(78,203,168,0.04), transparent)",
        }}
      />

      <div className="section-container relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="badge-teal reveal mb-4 inline-block">{c.badge}</div>
          <h2 className="section-headline reveal reveal-delay-1">
            {c.headline[0]}{" "}
            <span className="text-gradient-hero">{c.headline[1]}</span>
          </h2>
          <p className="section-subheadline reveal reveal-delay-2 max-w-2xl mx-auto mt-4">
            {c.subtitle}
          </p>
        </div>

        {/* Carousel */}
        <div className="reveal reveal-delay-2">
          <FeatureCarousel projects={projects} />
        </div>
      </div>
    </section>
  )
}
