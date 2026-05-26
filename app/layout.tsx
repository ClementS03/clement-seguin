import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { BackToTop } from "@/components/ui/BackToTop";
import { getContent } from "@/lib/i18n";

let fontClasses = "";

try {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Instrument_Serif, DM_Sans } = require("next/font/google");
  const displayFont = Instrument_Serif({
    subsets: ["latin"], weight: ["400"], style: ["normal", "italic"],
    variable: "--font-display", display: "swap", preload: true,
  });
  const bodyFont = DM_Sans({
    subsets: ["latin"], weight: ["300", "400", "500", "600"],
    variable: "--font-body", display: "swap", preload: true,
  });
  fontClasses = `${displayFont.variable} ${bodyFont.variable}`;
} catch {
  fontClasses = "";
}

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clement-seguin.fr";
const AUTHOR = "Clément Seguin";
const HANDLE = "@clembuild";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${AUTHOR} — B2B Web Builder`,
    template: `%s — ${AUTHOR}`,
  },
  description:
    "I build sites that close deals for B2B consultants and founders. Custom design, full copy, in 5 days. No templates, no agency.",
  keywords: [
    "B2B website",
    "consultant website",
    "lead generation site",
    "Next.js developer",
    "premium website",
    "web designer freelance",
    "Clément Seguin",
    "5-day website",
  ],
  authors: [{ name: AUTHOR, url: SITE_URL }],
  creator: AUTHOR,
  publisher: AUTHOR,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    siteName: `${AUTHOR} — Sites that close deals`,
    title: `${AUTHOR} — Sites that close deals for B2B consultants and founders`,
    description:
      "Sites that close deals for B2B consultants, coaches, and founders selling €5k+ missions. Delivered in 5 days. No agency.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${AUTHOR}`, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    site: HANDLE,
    creator: HANDLE,
    title: `${AUTHOR} — Sites that close deals`,
    description: "B2B sites for consultants and founders — delivered in 5 days. Custom design, full copy, zero lock-in.",
    images: ["/opengraph-image"],
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
  other: {
    "geo.region": "FR",
    "geo.placename": "France",
    "application-name": `${AUTHOR}`,
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#07080A" },
    { media: "(prefers-color-scheme: light)", color: "#07080A" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const c = getContent();

  return (
    <html lang="en" suppressHydrationWarning className={`scroll-smooth ${fontClasses}`}>
      <head>
        {!fontClasses && (
          <>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            <link
              href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap"
              rel="stylesheet"
            />
          </>
        )}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [
                {
                  "@type": "Person",
                  "@id": `${SITE_URL}/#person`,
                  name: AUTHOR,
                  url: SITE_URL,
                  jobTitle: "Web Builder for B2B Consultants & Founders",
                  knowsAbout: ["Next.js", "Webflow", "Web Design", "Conversion Copywriting", "Lead Generation", "Automation", "Technical SEO"],
                  sameAs: [
                    "https://linkedin.com/in/clementseguin",
                    "https://www.instagram.com/clementwebbuilds/",
                    "https://x.com/clembuild",
                  ],
                },
                {
                  "@type": "WebSite",
                  "@id": `${SITE_URL}/#website`,
                  url: SITE_URL,
                  name: `${AUTHOR} — Sites that close deals for B2B consultants and founders`,
                  publisher: { "@id": `${SITE_URL}/#person` },
                  inLanguage: "en-US",
                },
              ],
            }),
          }}
        />
      </head>
      <body
        suppressHydrationWarning
        className="font-body antialiased bg-bg-base text-text-primary overflow-x-hidden"
      >
        <div className="grain-overlay" aria-hidden="true" />
        <Navbar content={c.nav} meta={c.meta} />
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
      </body>
    </html>
  );
}
