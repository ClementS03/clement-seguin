import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
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
    default: `${AUTHOR} — Digital Builder`,
    template: `%s — ${AUTHOR}`,
  },
  description:
    "Clément Seguin — web builder and indie maker. Premium sites, tools, and digital products delivered in 5 days.",
  keywords: [
    "web designer freelance",
    "premium website",
    "Next.js developer",
    "digital products",
    "web builder France",
    "Clément Seguin",
    "indie maker",
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
    siteName: `${AUTHOR} — Digital Builder`,
    title: `${AUTHOR} — Digital Builder`,
    description:
      "Premium sites for independent professionals — delivered in 5 days. Tools and templates for creators.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: `${AUTHOR}`, type: "image/png" }],
  },
  twitter: {
    card: "summary_large_image",
    site: HANDLE,
    creator: HANDLE,
    title: `${AUTHOR} — Digital Builder`,
    description: "Premium sites, tools, and digital products — 5-day delivery.",
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
  alternates: { canonical: SITE_URL },
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
                  jobTitle: "Web Builder & Indie Maker",
                  knowsAbout: ["Webflow", "Next.js", "Figma", "Web Design", "Automation", "SEO", "Product Development"],
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
                  name: `${AUTHOR} — Webflow Designer & Builder`,
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
      </body>
    </html>
  );
}
