"use client";
import { useState } from "react";
import { useScrollReveal } from "@/lib/useScrollReveal";
import { cn } from "@/lib/utils";
import type { getContent } from "@/lib/i18n";

type CTAContent     = ReturnType<typeof getContent>["cta"];
type ContactContent = ReturnType<typeof getContent>["contact"];
type MetaContent    = ReturnType<typeof getContent>["meta"];

interface CTAProps {
  content: CTAContent;
  contactContent: ContactContent;
  meta: MetaContent;
}

export function CTA({ content: c, contactContent: cc, meta }: CTAProps) {
  const [formData,  setFormData]  = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [formError, setFormError] = useState(false);
  const ref = useScrollReveal() as React.RefObject<HTMLElement>;

  const handleChange = (name: string, value: string) =>
    setFormData((prev) => ({ ...prev, [name]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setFormError(false);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (!res.ok) throw new Error();
      setSubmitted(true);
    } catch {
      setFormError(true);
    }
    setLoading(false);
  };

  return (
    <section ref={ref} id="contact" className="section-padding relative overflow-hidden">
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{
        background: "radial-gradient(ellipse 70% 50% at 50% 0%, rgba(255,92,0,0.10), transparent 60%), radial-gradient(ellipse 50% 40% at 50% 100%, rgba(0,212,168,0.06), transparent 60%)"
      }} />

      <div className="section-container relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

          {/* Left — copy */}
          <div>
            <div className="badge-accent reveal mb-6">{c.badge}</div>
            <h2 className="section-headline reveal reveal-delay-1 mb-4">{c.headline}</h2>
            <p className="section-subheadline reveal reveal-delay-2 mb-8">{c.subheadline}</p>

            <div className="reveal reveal-delay-3 space-y-3 mb-8">
              {c.checklist.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-teal/15 flex items-center justify-center flex-shrink-0">
                    <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
                      <path d="M1 4l2.5 2.5L9 1" stroke="#00D4A8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>
                  <span className="text-sm text-text-secondary">{item}</span>
                </div>
              ))}
            </div>

            <p className="reveal reveal-delay-4 text-xs text-text-tertiary italic mb-8">{c.note}</p>
          </div>

          {/* Right — form */}
          <div className="reveal reveal-delay-1">
            {submitted ? (
              <div className="card flex flex-col items-center text-center py-16 gap-4">
                <div className="w-14 h-14 rounded-2xl bg-teal/15 flex items-center justify-center text-2xl mb-2">✓</div>
                <h3 className="font-body font-semibold text-xl text-text-primary">{cc.successTitle}</h3>
                <p className="text-sm text-text-secondary max-w-xs">{cc.successDesc}</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="card space-y-5 border-[rgba(255,255,255,0.09)]">
                <h3 className="font-body font-semibold text-base text-text-primary mb-6">{cc.headline}</h3>

                {cc.fields.map((field) => (
                  <div key={field.name}>
                    <label htmlFor={field.name} className="label">
                      {field.label}
                      {field.required && <span className="text-accent ml-1">*</span>}
                    </label>

                    {field.type === "textarea" ? (
                      <textarea
                        id={field.name} name={field.name} rows={3}
                        required={field.required} placeholder={field.placeholder ?? ""}
                        className="input resize-none"
                        onChange={(e) => handleChange(field.name, e.target.value)}
                      />
                    ) : field.type === "select" ? (
                      <select
                        id={field.name} name={field.name}
                        required={field.required}
                        className={cn("input", !formData[field.name] && "text-text-secondary")}
                        onChange={(e) => handleChange(field.name, e.target.value)}
                      >
                        <option value="">{field.placeholder ?? "—"}</option>
                        {field.options?.map((opt) => (
                          <option key={opt} value={opt}>{opt}</option>
                        ))}
                      </select>
                    ) : (
                      <input
                        id={field.name} name={field.name} type={field.type}
                        required={field.required} placeholder={field.placeholder ?? ""}
                        className="input"
                        onChange={(e) => handleChange(field.name, e.target.value)}
                      />
                    )}
                  </div>
                ))}

                <button type="submit" disabled={loading}
                  className={cn("btn-primary w-full mt-2", loading && "opacity-70 cursor-not-allowed")}>
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      {cc.submittingLabel}
                    </span>
                  ) : cc.submitLabel}
                </button>

                {formError && (
                  <p className="text-xs text-red-400 text-center">{cc.errorMsg}</p>
                )}
                <p className="text-2xs text-text-tertiary text-center">{cc.spamNote}</p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
