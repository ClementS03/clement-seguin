// app/[locale]/merci/page.tsx
import Link from "next/link"
import type { Metadata } from "next"
import { getContent, type Locale } from "@/lib/i18n"

export const metadata: Metadata = {
  title: "Merci !",
  robots: { index: false, follow: false },
}

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }]
}

export default async function MerciPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const c = getContent(locale as Locale)
  const isEn = locale === "en"
  const homeHref = isEn ? "/en" : "/"

  const heading  = isEn ? "Thank you!" : "Merci !"
  const body     = isEn
    ? "Your message has been received. I'll get back to you within 24h."
    : "Votre message a bien été reçu. Je vous répondrai sous 24h."
  const cardText = isEn
    ? "No reply within 24h? Check your spam folder, or reach out directly at"
    : "Pas de réponse sous 24h ? Vérifiez vos spams, ou contactez-moi directement à"
  const btnLabel = isEn ? "Back to home →" : "Retour à l'accueil →"

  return (
    <main className="min-h-screen bg-bg-base flex items-center justify-center pt-24 pb-16">
      <div className="section-container max-w-lg text-center flex flex-col items-center gap-8">

        <div className="w-16 h-16 rounded-full bg-bg-elevated border border-bg-border flex items-center justify-center text-3xl">
          ✅
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="font-display text-4xl md:text-5xl text-text-primary leading-tight">
            {heading}
          </h1>
          <p className="text-text-secondary text-lg leading-relaxed">
            {body}
          </p>
        </div>

        <div className="card w-full text-left">
          <p className="text-text-secondary text-sm leading-relaxed">
            {cardText}{" "}
            <a
              href={`mailto:${c.meta.email}`}
              className="text-accent hover:underline"
            >
              {c.meta.email}
            </a>
          </p>
        </div>

        <div className="flex items-center gap-4 flex-wrap justify-center">
          <Link href={homeHref} className="btn-primary">
            {btnLabel}
          </Link>
        </div>

      </div>
    </main>
  )
}
