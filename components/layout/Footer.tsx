import Link from "next/link";
import type { getContent } from "@/lib/i18n";

type FooterContent = ReturnType<typeof getContent>["footer"];
type MetaContent   = ReturnType<typeof getContent>["meta"];

export function Footer({ content, meta }: { content: FooterContent; meta: MetaContent }) {
  return (
    <footer className="border-t border-bg-border bg-bg-surface/30">
      <div className="section-container py-16 lg:py-20">
        {/* Top grid */}
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-x-8 gap-y-10 lg:gap-12 mb-16">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <div className="font-display text-2xl text-text-primary mb-3">{content.logo}</div>
            <p className="text-sm text-text-secondary max-w-xs leading-relaxed">{content.tagline}</p>
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <Link href={meta.linkedin}  target="_blank" className="text-sm text-text-secondary hover:text-text-primary transition-colors">LinkedIn</Link>
              <span className="text-text-tertiary">·</span>
              <Link href={meta.instagram} target="_blank" className="text-sm text-text-secondary hover:text-text-primary transition-colors">Instagram</Link>
              <span className="text-text-tertiary">·</span>
              <Link href={`mailto:${meta.email}`} className="text-sm text-text-secondary hover:text-accent transition-colors">{meta.email}</Link>
            </div>
          </div>

          {/* Link groups */}
          {content.groups.map((group) => (
            <div key={group.title}>
              <p className="text-xs font-medium text-text-tertiary uppercase tracking-widest mb-4 font-body">
                {group.title}
              </p>
              <ul className="space-y-2.5">
                {group.links.map((item, i) => {
                  const isExternal = item.href.startsWith("http");
                  return (
                    <li key={`${group.title}-${i}`}>
                      <Link href={item.href}
                        {...(isExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-200">
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-bg-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-text-tertiary">{content.copyright}</p>
          <div className="flex items-center gap-4">
            {content.legal.map((item) => (
              <Link key={item.href} href={item.href} className="text-xs text-text-tertiary hover:text-text-secondary transition-colors">
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
