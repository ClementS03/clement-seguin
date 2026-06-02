import Link from "next/link";
import type { getContent } from "@/lib/i18n";

type CaseStudyContent = ReturnType<typeof getContent>["caseStudy"];

export function CaseStudy({ content: c }: { content: CaseStudyContent }) {
  return (
    <section className="py-8 border-y border-bg-border bg-bg-elevated/20">
      <div className="section-container">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">

          <div className="badge-teal flex-shrink-0 reveal">{c.label}</div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 flex-1 reveal reveal-delay-1">
            <div className="flex-1 min-w-0">
              <p className="text-2xs text-text-tertiary uppercase tracking-widest mb-1 font-body">{c.beforeLabel}</p>
              <p className="text-sm text-text-secondary leading-relaxed">{c.before}</p>
            </div>
            <div className="text-accent text-2xl font-display hidden sm:block flex-shrink-0">→</div>
            <div className="flex-1 min-w-0">
              <p className="text-2xs text-teal uppercase tracking-widest mb-1 font-body">{c.afterLabel}</p>
              <p className="text-sm text-text-primary font-medium leading-relaxed">{c.after}</p>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1 flex-shrink-0 reveal reveal-delay-2">
            <p className="text-xs text-text-tertiary font-body">{c.client} · {c.sector}</p>
            <p className="font-display text-3xl text-accent tracking-tight">{c.delivery}</p>
            <Link
              href={c.ctaHref}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-accent hover:underline font-body"
            >
              {c.ctaLabel}
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}
