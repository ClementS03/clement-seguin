// app/[locale]/page.tsx
import type { Metadata } from "next"
import { getContent } from "@/lib/i18n"
import { Hero } from "@/components/sections/Hero"
import { ForWho } from "@/components/sections/ForWho"
import { Process } from "@/components/sections/Process"
import { Works } from "@/components/sections/Works"
import { Offers } from "@/components/sections/Offers"
import { Testimonials } from "@/components/sections/Testimonials"
import { About } from "@/components/sections/About"
import { FAQ } from "@/components/sections/FAQ"
import { CTA } from "@/components/sections/CTA"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clement-seguin.fr"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === "en"
  return {
    alternates: {
      canonical: isEn ? `${SITE_URL}/en/` : `${SITE_URL}/`,
    },
    openGraph: { url: isEn ? `${SITE_URL}/en/` : `${SITE_URL}/` },
  }
}

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }]
}

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { locale } = await params
  // TODO-TASK3: pass locale to getContent once Task 3 updates the signature
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const c = getContent() as any

  return (
    <>
      <Hero content={c.hero} />
      <ForWho content={c.forWho} />
      <Process content={c.process} />
      <Works content={c.works} />
      <Offers content={c.offers} />
      <Testimonials content={c.testimonials} />
      <About content={c.about} />
      <FAQ content={c.faq} meta={c.meta} />
      <CTA content={c.cta} contactContent={c.contact} meta={c.meta} />
    </>
  )
}
