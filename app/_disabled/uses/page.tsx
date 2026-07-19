import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uses — Stack & Tools",
  description:
    "My current stack, tools, and daily setup as a B2B web builder — design, dev, hosting, AI, and productivity. Updated as things change.",
  alternates: { canonical: "https://clement-seguin.fr/uses" },
  openGraph: {
    url: "https://clement-seguin.fr/uses",
    title: "Uses — Stack & Tools",
    description: "My current stack, tools, and daily setup as a B2B web builder — design, dev, hosting, AI, and productivity. Updated as things change.",
  },
};

const SECTIONS = [
  {
    title: "Design",
    items: [
      { name: "Figma", desc: "UI design and prototyping." },
      { name: "Claude Design", desc: "Artifacts & mockups — UI concepts, creative direction, copy iterations." },
      { name: "Google Stitch", desc: "AI UI generation — rapid first drafts and layout exploration." },
    ],
  },
  {
    title: "Development",
    items: [
      { name: "Next.js", desc: "React framework for this site and custom projects." },
      { name: "Webflow", desc: "Visual development for client sites — fast, no infra overhead." },
      { name: "Tailwind CSS v4", desc: "Utility-first CSS, CSS-first config." },
      { name: "shadcn/ui", desc: "Component library built on Radix — accessible, composable." },
      { name: "TypeScript", desc: "Type safety everywhere." },
    ],
  },
  {
    title: "Hosting & Services",
    items: [
      { name: "Netlify", desc: "Hosting for this site — automatic deploys on push." },
      { name: "Vercel", desc: "Hosting for other projects — edge network, zero config." },
      { name: "Resend", desc: "Email delivery API for contact forms." },
      { name: "Stripe", desc: "Payments and license keys for digital products." },
    ],
  },
  {
    title: "AI",
    items: [
      {
        name: "Claude",
        desc: "Coding, writing, research, and everything in between.",
      },
    ],
  },
  {
    title: "Productivity",
    items: [
      { name: "FreelanceOS", desc: "My own OS for freelance work — tasks, clients, habits, focus." },
    ],
  },
];

export default function UsesPage() {
  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <section className="section-padding">
        <div className="section-container max-w-2xl">
          <header className="mb-16">
            <div className="badge-accent mb-6 inline-block">Stack &amp; Gear</div>
            <h1 className="section-headline mb-4">Uses</h1>
            <p className="section-subheadline">
              My current stack, tools, and setup. Updated when something changes.
            </p>
          </header>

          <div className="flex flex-col gap-12">
            {SECTIONS.map((section) => (
              <div key={section.title}>
                <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-6 pb-3 border-b border-bg-border">
                  {section.title}
                </h2>
                <ul className="check-list">
                  {section.items.map((item) => (
                    <li key={item.name}>
                      <div>
                        <span className="font-medium text-text-primary">
                          {item.name}
                        </span>
                        {item.desc && (
                          <span className="text-text-secondary">
                            {" "}
                            — {item.desc}
                          </span>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
