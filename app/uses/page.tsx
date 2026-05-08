import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Uses",
  description: "My stack, tools, and setup — updated as things change.",
};

const SECTIONS = [
  {
    title: "Design",
    items: [
      { name: "Figma", desc: "UI design and prototyping." },
      {
        name: "Webflow",
        desc: "No-code website builder — my primary tool for client sites.",
      },
    ],
  },
  {
    title: "Development",
    items: [
      { name: "Next.js 15", desc: "React framework for this site and personal projects." },
      { name: "Tailwind CSS v4", desc: "Utility-first CSS, CSS-first config." },
      { name: "TypeScript", desc: "Type safety everywhere." },
      {
        name: "Airtable",
        desc: "Lightweight database for small projects — no infra overhead, free tier is plenty.",
      },
      { name: "Notion", desc: "CMS for this blog." },
    ],
  },
  {
    title: "Hosting & Services",
    items: [
      { name: "Netlify", desc: "Hosting for this site with automatic deploys." },
      { name: "Resend", desc: "Email delivery API for contact forms." },
      { name: "LemonSqueezy", desc: "Payments and license keys for digital products." },
    ],
  },
  {
    title: "AI",
    items: [
      {
        name: "Claude",
        desc: "Primary AI for coding, writing, research, and everything in between.",
      },
      { name: "ChatGPT", desc: "Secondary AI for quick lookups." },
    ],
  },
  {
    title: "Productivity",
    items: [
      { name: "Linear", desc: "Project management for dev work." },
      { name: "Notion", desc: "Notes, planning, and content calendar." },
      { name: "Raycast", desc: "Launcher and productivity layer on macOS." },
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
