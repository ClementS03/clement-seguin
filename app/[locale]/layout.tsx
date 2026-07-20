// app/[locale]/layout.tsx
import type { Metadata } from "next"
import Script from "next/script"
import { getContent, type Locale } from "@/lib/i18n"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { BackToTop } from "@/components/ui/BackToTop"
import { ScrollRevealInit } from "@/components/ui/ScrollRevealInit"
import { HtmlLangSetter } from "@/components/layout/HtmlLangSetter"

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clement-seguin.fr"
const AUTHOR = "Clément Seguin"

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>
}): Promise<Metadata> {
  const { locale } = await params
  const isEn = locale === "en"
  const c = getContent(locale as Locale)

  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: isEn
        ? `${AUTHOR} — Professional website for freelancers & SMBs`
        : `${AUTHOR} — Création de sites web pour indépendants et TPE`,
      template: `%s — ${AUTHOR}`,
    },
    description: c.meta.description,
    keywords: isEn
      ? ["website creation", "freelance web designer", "SMB website", "health practitioner website", "5-day website", "Clément Seguin"]
      : ["création site web", "webdesigner freelance", "site web TPE", "site praticien santé", "site artisan", "Clément Seguin"],
    authors: [{ name: AUTHOR, url: SITE_URL }],
    creator: AUTHOR,
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
    },
    alternates: {
      canonical: isEn ? `${SITE_URL}/en/` : `${SITE_URL}/`,
      languages: {
        fr: `${SITE_URL}/`,
        en: `${SITE_URL}/en/`,
        "x-default": `${SITE_URL}/`,
      },
    },
    openGraph: {
      type: "website",
      locale: isEn ? "en_US" : "fr_FR",
      siteName: AUTHOR,
      title: isEn
        ? `${AUTHOR} — Professional website for freelancers & SMBs`
        : `${AUTHOR} — Création de sites web pour indépendants et TPE`,
      description: c.meta.description,
      images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: AUTHOR, type: "image/png" }],
    },
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "any" },
        { url: "/icon-16.png", type: "image/png", sizes: "16x16" },
        { url: "/icon-32.png", type: "image/png", sizes: "32x32" },
        { url: "/icon-192.png", type: "image/png", sizes: "192x192" },
        { url: "/icon-512.png", type: "image/png", sizes: "512x512" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: [{ url: "/favicon.ico" }],
    },
    manifest: "/manifest.webmanifest",
    other: { "geo.region": "FR", "geo.placename": "France" },
  }
}

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }]
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const c = getContent(locale as Locale)

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ProfessionalService",
        "@id": `${SITE_URL}/#service`,
        name: `${AUTHOR} — Création de sites web`,
        url: SITE_URL,
        email: "hello@clement-seguin.fr",
        areaServed: "FR",
        priceRange: "€€",
        knowsLanguage: ["fr", "en"],
        offers: [
          { "@type": "Offer", name: "Site Vitrine",  price: "1500", priceCurrency: "EUR" },
          { "@type": "Offer", name: "Site Premium",  price: "2500", priceCurrency: "EUR" },
          { "@type": "Offer", name: "Maintenance",   price: "40",   priceCurrency: "EUR" },
        ],
        sameAs: [
          "https://linkedin.com/in/clementseguin",
          "https://www.instagram.com/clementwebbuilds/",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: AUTHOR,
        publisher: { "@id": `${SITE_URL}/#service` },
        inLanguage: locale === "en" ? "en-US" : "fr-FR",
      },
    ],
  }

  return (
    <>
      {/* Set lang attr client-side so root <html> reflects current locale */}
      <HtmlLangSetter locale={locale} />

      {/* JSON-LD schema.org injected into <head> via Next.js head hoisting */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />

      <div className="grain-overlay" aria-hidden="true" />
      <Navbar content={c.nav} meta={c.meta} locale={locale as Locale} />
      <main>{children}</main>
      <Footer content={c.footer} meta={c.meta} />
      <BackToTop />

      <Script
        src="https://analytics.ahrefs.com/analytics.js"
        data-key="A3OiQFMj+bOwDGGqq9Hzvg"
        strategy="afterInteractive"
      />
      <Script id="cal-init" strategy="lazyOnload">{`
        (function(C,A,L){let p=function(a,ar){a.q.push(ar)};let d=C.document;C.Cal=C.Cal||function(){let cal=C.Cal;let ar=arguments;if(!cal.loaded){cal.ns={};cal.q=cal.q||[];d.head.appendChild(d.createElement("script")).src=A;cal.loaded=true}if(ar[0]===L){const api=function(){p(api,arguments)};const namespace=ar[1];api.q=api.q||[];typeof namespace==="string"?(cal.ns[namespace]=api)&&p(api,ar):p(cal,ar);return}p(cal,ar)};})(window,"https://app.cal.com/embed/embed.js","init");
        Cal("init",{origin:"https://cal.com"});
      `}</Script>

      <ScrollRevealInit />
    </>
  )
}
