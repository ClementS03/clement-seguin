const TOOLS = [
  { name: "Webflow", color: "#4353FF" },
  { name: "Figma",   color: "#A259FF" },
  { name: "Claude",  color: "#CF6600" },
  { name: "Make",    color: "#6D00F5" },
  { name: "Vercel",  color: "#FFFFFF" },
  { name: "Tidio",   color: "#1ED5A4" },
  { name: "Brevo",   color: "#00B2A9" },
  { name: "Notion",  color: "#FFFFFF" },
];

const STATS = [
  { value: "5d",   label: "Delivery time" },
  { value: "×3",   label: "Average conversion" },
  { value: "100%", label: "Client satisfaction" },
  { value: "1",    label: "Single point of contact" },
];

export function TechLogos({ label }: { label: string }) {
  const doubled = [...TOOLS, ...TOOLS, ...TOOLS, ...TOOLS];
  return (
    <section className="border-y border-bg-border bg-bg-surface/20 py-5 overflow-hidden">
      <p className="text-center text-2xs text-text-tertiary uppercase tracking-widest mb-4 font-body">{label}</p>
      <div className="marquee-wrapper">
        <div className="marquee-track">
          {doubled.map((tool, i) => (
            <span
              key={i}
              className="text-sm font-body font-medium whitespace-nowrap flex-shrink-0"
              style={{ color: `${tool.color}88` }}
            >
              {tool.name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsStrip() {
  return (
    <div className="border-y border-bg-border bg-bg-surface/40">
      <div className="section-container">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-bg-border">
          {STATS.map((stat, i) => (
            <div key={i} className="py-8 px-6 text-center">
              <p className="font-display text-3xl mb-1 gradient-text-accent">{stat.value}</p>
              <p className="text-xs text-text-secondary font-body uppercase tracking-wide">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
