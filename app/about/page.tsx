import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "About — Clément Seguin",
  description: "Web builder. Career-changer, nomad, based in Bansko, Bulgaria.",
  robots: { index: false, follow: false },
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-bg-base pt-24 pb-32">
      <div className="max-w-3xl mx-auto px-6">

        {/* ── Hero ── */}
        <section className="mb-24 flex flex-col md:flex-row gap-12 items-start">
          <div className="flex-1">
            <div className="badge-teal mb-6 inline-block">About</div>
            <h1 className="font-display text-4xl md:text-5xl text-text-primary leading-tight mb-5">
              Web builder.<br />
              Career-changer, nomad,<br />
              based in Bansko.
            </h1>
            <p className="text-text-secondary text-lg leading-relaxed">
              I build websites for businesses that need to look the part — fast, custom, and without the agency overhead.
            </p>
          </div>

          <div className="w-full md:w-64 h-80 flex-shrink-0 relative rounded-2xl overflow-hidden">
            <Image
              src="/about/portrait.webp"
              alt="Clément Seguin with his dog in Bansko"
              fill
              className="object-cover object-top"
              priority
            />
          </div>
        </section>

        {/* ── Story ── */}
        <section className="mb-20">
          <h2 className="font-display text-2xl text-text-primary mb-6">Not the usual background.</h2>
          <div className="flex flex-col gap-5 text-text-secondary leading-relaxed">
            <p>
              I didn't study computer science. Until 2019, I was doing manual work — rope access technician, welder, general labour. Physical jobs, no desk, no screen. Then I decided to change everything.
            </p>
            <p>
              I retrained at O'clock, an online coding bootcamp, and learned HTML, CSS, JavaScript, PHP and React from scratch. Not the straightforward route — but it gave me a different perspective on what actually matters when you build things for real people.
            </p>
            <p>
              I worked on a long WordPress mission for Cegid, a large French enterprise group, and used that time to travel across Europe by train. After that, I went deeper into design, Webflow, and kept building as a solo freelancer.
            </p>
            <p>
              Eventually, I packed a bag, grabbed my dog, and hitchhiked from France to Bulgaria. I've been based in Bansko ever since.
            </p>
          </div>
        </section>

        <div className="w-full h-72 mb-24 relative rounded-2xl overflow-hidden">
          <Image
            src="/about/bansko-wide.webp"
            alt="Clément and his dog looking over Bansko, Bulgaria"
            fill
            className="object-cover object-center"
          />
        </div>

        {/* ── How I work ── */}
        <section className="mb-20">
          <h2 className="font-display text-2xl text-text-primary mb-6">How I work.</h2>
          <div className="flex flex-col gap-5 text-text-secondary leading-relaxed">
            <p>
              Solo, direct, and accountable from start to finish. No project manager between us. No junior handling your brief while the senior is on another account. You talk to me — and I design, write, and build everything myself.
            </p>
            <p>
              I work with businesses that need a professional site fast — not a 3-month agency project. The process is tight: brief, mockup approval, copywriting, development, launch. In 5 days for a standard project.
            </p>
            <p>
              Mockup approved before development starts. Full copywriting included. You own everything at delivery — code, domain, content. No lock-in, no surprise invoices.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-10">
            {[
              { value: "5d",   label: "Fastest delivery" },
              { value: "100%", label: "You own everything" },
              { value: "1",    label: "Person on your project" },
              { value: "0",    label: "Surprise fees" },
            ].map((stat) => (
              <div key={stat.label} className="card text-center py-6">
                <p className="font-display text-3xl gradient-text-accent mb-1">{stat.value}</p>
                <p className="text-text-tertiary text-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Building ── */}
        <section className="mb-20">
          <h2 className="font-display text-2xl text-text-primary mb-6">What I build for myself.</h2>
          <div className="flex flex-col gap-5 text-text-secondary leading-relaxed">
            <p>
              Alongside client work, I build my own products — tools I actually use to run my business day to day. It keeps me sharp, forces me to ship real software under real constraints, and means I build for clients the same way I build for myself: for production, not for portfolios.
            </p>
          </div>
        </section>

        {/* ── Personal ── */}
        <section className="mb-24">
          <div className="flex flex-col md:flex-row gap-10 items-start">

            <div className="w-full md:w-72 flex-shrink-0 flex flex-col gap-2">
              <div className="relative h-36 rounded-xl overflow-hidden">
                <Image
                  src="/about/bansko-day.webp"
                  alt="Bansko, Bulgaria — mountain panorama"
                  fill
                  className="object-cover object-center"
                />
              </div>
              <div className="relative h-36 rounded-xl overflow-hidden">
                <Image
                  src="/about/bansko-sunset.webp"
                  alt="Bansko at sunset, mountains in the background"
                  fill
                  className="object-cover object-center"
                />
              </div>
            </div>

            <div className="flex flex-col gap-5 text-text-secondary leading-relaxed pt-2">
              <p>
                When I'm not building, I'm somewhere in the mountains with my dog. Bansko has that — trails, silence, space to think. After years of city living and moving around, it's the right pace.
              </p>
              <p>
                I speak French natively and English well enough to work with international clients. I'm currently learning Russian.
              </p>
              <p>
                Most of my clients are based in France, Belgium, and Switzerland — but I work with anyone, from anywhere, on projects that are worth doing.
              </p>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="border-t border-bg-border pt-16 text-center">
          <h2 className="font-display text-3xl text-text-primary mb-4">Want to work together?</h2>
          <p className="text-text-secondary mb-8 max-w-md mx-auto">
            30-minute call, no commitment. We look at your current situation and see if we're a good fit.
          </p>
          <a href="/#contact" className="btn-primary inline-flex">
            Book a free call →
          </a>
        </section>

      </div>
    </main>
  );
}
