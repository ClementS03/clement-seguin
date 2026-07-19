# Repositionnement FR/EN Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Repositionner clement-seguin.fr en vitrine FR-first pour TPE/PME — bilingue FR/EN avec FR à la racine, pages SaaS masquées, copy réécrit, SEO mis à jour.

**Architecture:** Toutes les pages publiques bougent sous `app/[locale]/` (locale = 'fr' | 'en'). Le middleware réécrit `/` → `/fr` en interne (URL reste `/`), `/en/*` est servi nativement. `lib/i18n.ts` charge `data/content.fr.json` ou `data/content.en.json` selon le locale.

**Tech Stack:** Next.js 15 App Router, TypeScript, Tailwind CSS v4, `next/font`, Resend, Netlify

## Global Constraints

- Branche : `feature/repositioning-fr-en` — AUCUN push direct sur main
- Commits atomiques — un commit par tâche terminée
- Aucun fichier supprimé définitivement — les pages désactivées vont dans `app/_disabled/`
- Ne jamais hardcoder de texte dans les composants — tout passe par content.fr.json / content.en.json
- Ne jamais utiliser d'inline styles avec des couleurs — utiliser les classes CSS de globals.css
- `Hero.tsx` reste un Server Component (pas de `"use client"`)
- Markers obligatoires : `TODO-REVIEW` (relecture Clément), `TODO-EIK` (structure juridique)
- Commandes de test : `npm run build` (doit passer sans erreur TS ni build error)

---

## File Map

| Fichier | Action | Rôle |
|---|---|---|
| `middleware.ts` | Modifier | Ajouter locale detection + conserver admin protection |
| `app/layout.tsx` | Modifier | Root layout allégé — plus de Navbar/Footer/schema ici |
| `app/[locale]/layout.tsx` | Créer | Layout par locale : Navbar, Footer, hreflang, schema.org |
| `app/[locale]/page.tsx` | Créer | Homepage (moved from app/page.tsx) |
| `app/[locale]/about/page.tsx` | Créer | À propos réécrite, indexable |
| `app/[locale]/legal/page.tsx` | Créer | (moved) |
| `app/[locale]/privacy/page.tsx` | Créer | (moved) |
| `app/[locale]/cgv/page.tsx` | Créer | (moved) |
| `app/[locale]/merci/page.tsx` | Créer | (moved) |
| `app/[locale]/blog/page.tsx` | Créer | noindex — retourne notFound() |
| `app/[locale]/blog/[slug]/page.tsx` | Créer | noindex — retourne notFound() |
| `app/[locale]/shop/page.tsx` | Créer | notFound() |
| `app/[locale]/shop/[slug]/page.tsx` | Créer | notFound() |
| `app/[locale]/projects/page.tsx` | Créer | notFound() |
| `app/[locale]/projects/[slug]/page.tsx` | Créer | notFound() |
| `app/[locale]/open/page.tsx` | Créer | noindex — retourne notFound() |
| `app/[locale]/uses/page.tsx` | Créer | noindex — retourne notFound() |
| `app/_disabled/` | Créer | Archive des anciennes pages (blog, shop, projects, admin, open, uses) |
| `app/page.tsx` | Supprimer | Remplacé par app/[locale]/page.tsx |
| `app/about/page.tsx` | Supprimer | Remplacé |
| `app/legal/page.tsx` | Supprimer | Remplacé |
| `app/privacy/page.tsx` | Supprimer | Remplacé |
| `app/cgv/page.tsx` | Supprimer | Remplacé |
| `app/merci/page.tsx` | Supprimer | Remplacé |
| `app/blog/` | Déplacer → `app/_disabled/blog/` | Archive |
| `app/shop/` | Déplacer → `app/_disabled/shop/` | Archive |
| `app/projects/` | Déplacer → `app/_disabled/projects/` | Archive |
| `app/open/` | Déplacer → `app/_disabled/open/` | Archive |
| `app/uses/` | Déplacer → `app/_disabled/uses/` | Archive |
| `app/admin/` | Déplacer → `app/_disabled/admin/` | Archive |
| `app/api/admin/` | Déplacer → `app/_disabled/api/admin/` | Archive |
| `app/api/webhooks/` | Déplacer → `app/_disabled/api/webhooks/` | Archive |
| `data/content.fr.json` | Créer | Tout le texte FR (source de vérité) |
| `data/content.en.json` | Créer | Tout le texte EN |
| `lib/i18n.ts` | Modifier | getContent(locale) — charge le bon fichier JSON |
| `components/layout/LocaleSwitcher.tsx` | Créer | Switcher FR / EN |
| `components/layout/Navbar.tsx` | Modifier | Ajouter LocaleSwitcher, nettoyer liens |
| `components/sections/ForWho.tsx` | Créer | Nouveau composant 3 cartes personas |
| `app/sitemap.ts` | Modifier | FR + EN uniquement, plus de shop/projects/blog |
| `app/robots.ts` | Modifier | Disallow désactivées |
| `next.config.ts` | Modifier | Nouvelles redirections 301 |
| `docs/admin-restoration.md` | Créer | Guide de réactivation admin |

---

## Task 1 — Feature branch + middleware locale

**Files:**
- Modify: `middleware.ts`

**Interfaces:**
- Produces: middleware qui réécrit `/` → `/fr` en interne, `/en/*` passe direct, `/admin/*` protégé

- [ ] **Step 1: Créer la branche**

```bash
git checkout -b feature/repositioning-fr-en
```

- [ ] **Step 2: Réécrire middleware.ts**

Remplacer le contenu entier par :

```typescript
import { NextRequest, NextResponse } from "next/server"

const LOCALES = ["fr", "en"] as const
type Locale = (typeof LOCALES)[number]
const DEFAULT_LOCALE: Locale = "fr"

function safeCompare(a: string, b: string): boolean {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

function hasLocalePrefix(pathname: string): boolean {
  return LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  )
}

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  // ── Admin protection (existing logic) ─────────────────────────
  if (pathname.startsWith("/admin")) {
    if (pathname === "/admin/login") return NextResponse.next()
    const token = req.cookies.get("admin_token")?.value
    const secret = process.env.ADMIN_SECRET ?? ""
    if (!token || !safeCompare(token, secret)) {
      return NextResponse.redirect(new URL("/admin/login", req.url))
    }
    return NextResponse.next()
  }

  // ── Skip API, Next.js internals, static files ─────────────────
  if (
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  // ── Already localized (/en/...) → serve as-is ─────────────────
  if (hasLocalePrefix(pathname)) return NextResponse.next()

  // ── Rewrite to default locale internally (URL stays clean) ────
  const url = req.nextUrl.clone()
  url.pathname = `/${DEFAULT_LOCALE}${pathname === "/" ? "" : pathname}`
  return NextResponse.rewrite(url)
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon|icon|apple-touch-icon|manifest|.*\\..*).*)",
  ],
}
```

- [ ] **Step 3: Build**

```bash
npm run build
```

Expected: build réussi (les pages [locale] n'existent pas encore, c'est OK).

- [ ] **Step 4: Commit**

```bash
git add middleware.ts
git commit -m "feat: rewrite middleware for locale detection + admin protection"
```

---

## Task 2 — Déplacer les pages dans app/[locale]/

**Files:**
- Create: `app/[locale]/page.tsx`, `app/[locale]/about/page.tsx`, pages légales, stubs noindex
- Archive: `app/_disabled/`

**Interfaces:**
- Consumes: `getContent(locale)` de lib/i18n.ts
- Produces: toutes les pages publiques sous `/[locale]/`

- [ ] **Step 1: Archiver les dossiers désactivés**

```powershell
New-Item -ItemType Directory -Force "app\_disabled\blog"
New-Item -ItemType Directory -Force "app\_disabled\shop"
New-Item -ItemType Directory -Force "app\_disabled\projects"
New-Item -ItemType Directory -Force "app\_disabled\open"
New-Item -ItemType Directory -Force "app\_disabled\uses"
New-Item -ItemType Directory -Force "app\_disabled\admin"
New-Item -ItemType Directory -Force "app\_disabled\api\admin"
New-Item -ItemType Directory -Force "app\_disabled\api\webhooks"

Move-Item "app\blog\*"     "app\_disabled\blog\"     -Force
Move-Item "app\shop\*"     "app\_disabled\shop\"     -Force
Move-Item "app\projects\*" "app\_disabled\projects\" -Force
Move-Item "app\open\*"     "app\_disabled\open\"     -Force
Move-Item "app\uses\*"     "app\_disabled\uses\"     -Force
Move-Item "app\admin\*"    "app\_disabled\admin\"    -Force
Move-Item "app\api\admin\*"    "app\_disabled\api\admin\"    -Force
Move-Item "app\api\webhooks\*" "app\_disabled\api\webhooks\" -Force
```

- [ ] **Step 2: Supprimer les pages root remplacées par [locale]/**

```powershell
Remove-Item "app\page.tsx"
Remove-Item "app\about\page.tsx"
Remove-Item "app\legal\page.tsx"
Remove-Item "app\privacy\page.tsx"
Remove-Item "app\cgv\page.tsx"
Remove-Item "app\merci\page.tsx"
```

- [ ] **Step 3: Créer app/[locale]/page.tsx**

```typescript
// app/[locale]/page.tsx
import type { Metadata } from "next"
import { getContent, type Locale } from "@/lib/i18n"
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
  const { locale } = await params
  const c = getContent(locale as Locale)

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
```

- [ ] **Step 4: Créer app/[locale]/about/page.tsx**

```typescript
// app/[locale]/about/page.tsx
import type { Metadata } from "next"
import { getContent, type Locale } from "@/lib/i18n"
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
    title: isEn ? "About" : "À propos",
    description: isEn
      ? "Clément Seguin — web designer for independent professionals and SMBs."
      : "Clément Seguin — webdesigner pour indépendants et TPE. Mon parcours, ma méthode.",
    robots: { index: true, follow: true },
    alternates: {
      canonical: isEn ? `${SITE_URL}/en/about` : `${SITE_URL}/about`,
      languages: {
        fr: `${SITE_URL}/about`,
        en: `${SITE_URL}/en/about`,
        "x-default": `${SITE_URL}/about`,
      },
    },
  }
}

export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }]
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  const c = getContent(locale as Locale)
  const isEn = locale === "en"

  return (
    <main className="pt-32 pb-24">
      <div className="section-container max-w-3xl">
        <div className="mb-16">
          <span className="badge-accent mb-6 inline-block">
            {isEn ? "About" : "À propos"}
          </span>
          <h1 className="section-headline mb-6">
            {isEn ? (
              <>Clément Seguin,<br /><span className="gradient-text-accent">independent web designer.</span></>
            ) : (
              <>Clément Seguin,<br /><span className="gradient-text-accent">webdesigner indépendant.</span></>
            )}
          </h1>
          <p className="section-subheadline">
            {isEn
              ? "I create websites for independent professionals and SMBs. No agency, no intermediary."
              : "Je crée des sites web pour des indépendants et TPE. Pas d'agence, pas d'intermédiaire."}
          </p>
        </div>

        <div className="space-y-6 text-text-secondary leading-relaxed text-base">
          {isEn ? (
            <>
              <p>Before becoming a web designer, I spent several years in the corporate world. I saw firsthand how many talented independent professionals — therapists, craftspeople, consultants — were losing clients simply because their website didn&apos;t reflect their quality of work.</p>
              <p>I decided to change that. Today I build websites that work: that reassure a prospect before the first call, that convert visitors into clients, that you&apos;re proud to show.</p>
              <p>My approach is simple: I show you the mockup before you pay a single euro. You validate, we adjust, then I deliver in 5 days. No surprise invoice, no 3-month wait.</p>
              <p>{/* TODO-REVIEW: ajouter détails personnels si souhaité */}I work directly with each client — no junior designer, no subcontractor. When you contact me, it&apos;s me who answers.</p>
            </>
          ) : (
            <>
              <p>Avant de me lancer dans le webdesign, j&apos;ai travaillé plusieurs années dans le monde de l&apos;entreprise. J&apos;ai vu à quel point de nombreux indépendants talentueux — thérapeutes, artisans, consultants — perdaient des clients simplement parce que leur site ne reflétait pas la qualité de leur travail.</p>
              <p>J&apos;ai décidé de changer ça. Aujourd&apos;hui, je crée des sites qui fonctionnent : qui rassurent un prospect avant le premier appel, qui convertissent des visiteurs en clients, dont vous êtes fier de montrer l&apos;adresse.</p>
              <p>Ma méthode est simple : je vous montre la maquette avant que vous payiez le moindre euro. Vous validez, on ajuste, puis je livre en 5 jours. Pas de facture surprise, pas d&apos;attente de 3 mois.</p>
              <p>{/* TODO-REVIEW: ajouter détails personnels si souhaité */}Je travaille directement avec chaque client — pas de designer junior, pas de sous-traitant. Quand vous m&apos;écrivez, c&apos;est moi qui réponds.</p>
            </>
          )}
        </div>

        <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-4">
          {["Next.js / React", "Webflow", "Tailwind CSS", "Figma", "SEO technique", "Copywriting"].map((skill) => (
            <div key={skill} className="card px-4 py-3 text-sm text-text-secondary">{skill}</div>
          ))}
        </div>
      </div>

      <div className="mt-24">
        <CTA content={c.cta} contactContent={c.contact} meta={c.meta} />
      </div>
    </main>
  )
}
```

- [ ] **Step 5: Créer les pages légales sous [locale]/**

Pour chaque page (`legal`, `privacy`, `cgv`, `merci`), lire le fichier existant dans `app/_disabled/` (ou depuis le repo avant suppression) et l'adapter au pattern suivant — ajouter `params: Promise<{ locale: string }>` et `generateStaticParams`, garder le contenu existant inchangé, changer `robots: noindex` si applicable :

```typescript
// app/[locale]/legal/page.tsx — pattern à appliquer aux 4 pages
export function generateStaticParams() {
  return [{ locale: "fr" }, { locale: "en" }]
}
export const metadata = {
  title: "Mentions légales",
  robots: { index: false, follow: false },
}
export default async function LegalPage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  // ... copier le JSX existant de l'ancienne app/legal/page.tsx
  // Ajouter le placeholder TODO-EIK pour les informations juridiques
}
```

- [ ] **Step 6: Créer les stubs pour pages désactivées**

`app/[locale]/blog/page.tsx` :
```typescript
import { notFound } from "next/navigation"
export const metadata = { robots: { index: false, follow: false } }
export function generateStaticParams() { return [{ locale: "fr" }, { locale: "en" }] }
export default function BlogPage() { return notFound() }
```

`app/[locale]/blog/[slug]/page.tsx` :
```typescript
import { notFound } from "next/navigation"
export const metadata = { robots: { index: false, follow: false } }
export function generateStaticParams() { return [] }
export default function BlogPostPage() { return notFound() }
```

Répéter ce pattern pour : `shop/page.tsx`, `shop/[slug]/page.tsx`, `projects/page.tsx`, `projects/[slug]/page.tsx`, `open/page.tsx`, `uses/page.tsx`.

- [ ] **Step 7: Build**

```bash
npm run build
```

Expected: build propre. Les stubs notFound() sont valides.

- [ ] **Step 8: Commit**

```bash
git add app/
git commit -m "feat: move pages to app/[locale]/ — archive SaaS pages to _disabled/"
```

---

## Task 3 — Mettre à jour lib/i18n.ts

**Files:**
- Modify: `lib/i18n.ts`

**Interfaces:**
- Produces: `getContent(locale: 'fr' | 'en'): SiteContent`

- [ ] **Step 1: Réécrire lib/i18n.ts**

```typescript
// lib/i18n.ts
import contentFr from "@/data/content.fr.json"
import contentEn from "@/data/content.en.json"

export type Locale = "fr" | "en"
export type SiteContent = typeof contentFr

export type Post = {
  slug: string
  title: string
  excerpt: string
  category: string
  readTime: string
  publishedAt: string
  featured?: boolean
  tags?: string[]
}

export function getContent(locale: Locale = "fr"): SiteContent {
  return locale === "en" ? (contentEn as SiteContent) : contentFr
}

// Blog désactivé — restaurer depuis app/_disabled/ si nécessaire
export function getPosts(): Post[] { return [] }
export function getPost(_slug: string): Post | null { return null }
```

- [ ] **Step 2: Créer des fichiers JSON minimaux temporaires si Task 4/5 ne sont pas encore faites**

Si `data/content.fr.json` n'existe pas encore, créer un stub minimal pour que le build TypeScript passe :

```json
{ "meta": {}, "nav": {}, "hero": {}, "forWho": {}, "problem": {}, "process": {}, "works": {}, "offers": {}, "testimonials": {}, "about": {}, "faq": {}, "cta": {}, "contact": {}, "footer": {}, "notFound": {}, "legal": {} }
```

Répéter pour `data/content.en.json`.

- [ ] **Step 3: Build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add lib/i18n.ts
git commit -m "feat: update i18n.ts — getContent(locale) loads content.fr.json or content.en.json"
```

---

## Task 4 — Créer data/content.fr.json

**Files:**
- Create: `data/content.fr.json`

- [ ] **Step 1: Créer data/content.fr.json**

```json
{
  "meta": {
    "siteName": "Clément Seguin",
    "tagline": "Création de site web pour indépendants et TPE",
    "description": "Site web professionnel pour praticiens, artisans et cliniques. Maquette offerte avant paiement. À partir de 1 500 €, livré en 5 jours.",
    "domain": "clement-seguin.fr",
    "email": "hello@clement-seguin.fr",
    "calendly": "https://cal.com/clement-seguin/strategy-call-30-min",
    "linkedin": "https://linkedin.com/in/clementseguin",
    "instagram": "https://www.instagram.com/clementwebbuilds/",
    "twitter": "https://x.com/clembuild"
  },
  "nav": {
    "logo": "CS.",
    "links": [
      { "label": "Offres",       "href": "#offres" },
      { "label": "Réalisations", "href": "#works"  },
      { "label": "À propos",     "href": "/about"  }
    ],
    "cta": { "label": "Maquette gratuite", "href": "#contact" }
  },
  "hero": {
    "badge": "Maquette gratuite avant paiement",
    "headline": ["Un site qui vous", "ramène des clients."],
    "subheadline": "Vous voyez la maquette avant de payer. Livraison en 5 jours. À partir de 1 500 €.",
    "ctaPrimary":   { "label": "Voir ma maquette gratuite →", "href": "#contact" },
    "ctaSecondary": { "label": "Voir les réalisations",        "href": "#works"   },
    "stats": [
      { "value": "5j",     "label": "Livraison — pas 3 mois"       },
      { "value": "1 500€", "label": "À partir de, tout compris"    },
      { "value": "0€",     "label": "À payer avant la maquette"    }
    ],
    "trust": "Maquette avant paiement · Design sur mesure · Prix fixe · Vous êtes propriétaire · Aucun engagement",
    "builderProof": ""
  },
  "forWho": {
    "badge": "Pour qui ?",
    "headline": ["Fait pour vous", "si vous êtes..."],
    "personas": [
      {
        "icon": "🩺",
        "title": "Praticien santé & bien-être",
        "subtitle": "Kiné, sophrologue, naturopathe, ostéo, psychologue...",
        "desc": "Vos patients cherchent quelqu'un comme vous sur Google. Votre site doit les convaincre en 10 secondes."
      },
      {
        "icon": "🔨",
        "title": "Artisan & commerçant local",
        "subtitle": "Menuisier, peintre, paysagiste, plombier, couvreur...",
        "desc": "Vos concurrents ont un site Wix bancal. C'est votre chance de sortir du lot."
      },
      {
        "icon": "🏥",
        "title": "Clinique & cabinet médical",
        "subtitle": "Cabinet dentaire, centre bien-être, clinique privée...",
        "desc": "Une image premium rassure vos patients avant même le premier rendez-vous."
      }
    ]
  },
  "problem": {
    "badge": "Le problème",
    "headline": ["Votre site actuel", "vous coûte des clients."],
    "intro": "Un site mal fait, c'est un prospect qui repart chez le concurrent.",
    "points": [
      { "title": "Première impression ratée",  "desc": "Un visiteur décide en 8 secondes. Si votre site est daté ou illisible sur mobile, il est déjà parti." },
      { "title": "Zéro confiance transmise",   "desc": "Sans preuves sociales, sans design soigné, sans copy clair — le prospect ne vous contacte pas."        },
      { "title": "Invisible sur Google",       "desc": "Sans SEO de base, vous n'apparaissez pas quand quelqu'un cherche vos services dans votre ville."          }
    ]
  },
  "process": {
    "badge": "Comment ça marche",
    "headline": ["Votre site en 3 étapes.", "Pas de surprise."],
    "steps": [
      {
        "number": "01",
        "title": "Maquette offerte",
        "subtitle": "Jour 1",
        "desc": "On se parle 30 minutes. Je conçois une maquette complète de votre site. Vous la voyez, vous la validez. Vous ne payez rien à cette étape."
      },
      {
        "number": "02",
        "title": "Vous validez, on ajuste",
        "subtitle": "Jour 2-3",
        "desc": "Retours illimités sur la maquette jusqu'à ce que ce soit exactement ce que vous vouliez. Seulement après : vous confirmez et réglez."
      },
      {
        "number": "03",
        "title": "Livraison en 5 jours",
        "subtitle": "Jour 4-5",
        "desc": "Site développé, hébergé, prêt à accueillir vos premiers visiteurs. Vous repartez avec les clés."
      }
    ]
  },
  "works": {
    "badge": "Réalisations",
    "headline": "Des sites qui donnent envie d'appeler.",
    "subheadline": "Chaque projet livré en moins d'une semaine."
  },
  "offers": {
    "badge": "Offres & prix",
    "headline": ["Transparent sur les prix.", "Toujours."],
    "subheadline": "Pas de devis surprise. Vous savez ce que vous payez avant de signer.",
    "plans": [
      {
        "name": "Site Vitrine",
        "price": "1 500€",
        "priceNote": "À partir de, HT",
        "highlight": false,
        "desc": "Pour démarrer avec un site professionnel qui inspire confiance.",
        "features": [
          "Design sur mesure",
          "5 à 7 pages",
          "Formulaire de contact",
          "SEO de base (balises, vitesse)",
          "Hébergement inclus 1 an",
          "Livraison en 5 jours",
          "Maquette gratuite avant paiement"
        ],
        "cta": "Voir ma maquette gratuite",
        "href": "#contact"
      },
      {
        "name": "Site Premium",
        "price": "2 500 – 3 000€",
        "priceNote": "HT — TODO-REVIEW",
        "highlight": true,
        "desc": "Pour les cliniques, cabinets et professionnels qui veulent une image haut de gamme.",
        "features": [
          "Design haut de gamme",
          "Pages multiples (équipe, services, galerie)",
          "Prise de RDV en ligne intégrée",
          "SEO avancé",
          "Hébergement inclus 1 an",
          "Livraison en 5 à 7 jours",
          "Maquette gratuite avant paiement"
        ],
        "cta": "Voir ma maquette gratuite",
        "href": "#contact"
      },
      {
        "name": "Maintenance",
        "price": "40€",
        "priceNote": "/mois",
        "highlight": false,
        "desc": "Pour garder votre site à jour sans vous en préoccuper.",
        "features": [
          "Hébergement & nom de domaine",
          "Sauvegardes automatiques",
          "Modifications mineures incluses",
          "Mises à jour sécurité",
          "Support réactif"
        ],
        "cta": "Me contacter",
        "href": "#contact"
      }
    ]
  },
  "testimonials": {
    "badge": "Ils m'ont fait confiance",
    "headline": "Ce qu'ils en disent.",
    "items": []
  },
  "about": {
    "badge": "Qui suis-je ?",
    "headline": ["Clément Seguin,", "webdesigner indépendant."],
    "desc": "Je crée des sites pour des indépendants et TPE. Pas d'agence, pas d'intermédiaire — vous travaillez directement avec moi, du premier appel à la livraison.",
    "cta": { "label": "En savoir plus sur mon parcours →", "href": "/about" }
  },
  "faq": {
    "badge": "FAQ",
    "headline": "Questions fréquentes.",
    "items": [
      { "q": "Est-ce que je paie avant de voir le résultat ?",             "a": "Non. La maquette est gratuite et sans engagement. Vous payez seulement après l'avoir validée."                           },
      { "q": "Qu'est-ce qui est inclus dans les 5 jours ?",               "a": "Design + développement + mise en ligne + nom de domaine configuré + formulaire de contact fonctionnel."                  },
      { "q": "Je reste propriétaire de mon site ?",                       "a": "Oui, à 100%. Code, hébergement, domaine — tout vous appartient."                                                         },
      { "q": "Que se passe-t-il si j'ai des modifications après livraison ?", "a": "Les petites modifications sont comprises le 1er mois. Ensuite, forfait maintenance à 40 €/mois ou à la demande."    },
      { "q": "Je ne suis pas technique, est-ce un problème ?",            "a": "C'est exactement pour vous que je travaille. Vous n'avez rien à gérer techniquement."                                    }
    ],
    "cta": { "label": "Une autre question ? Écrivez-moi", "href": "#contact" }
  },
  "cta": {
    "badge": "On commence ?",
    "headline": "Votre maquette gratuite vous attend.",
    "subheadline": "30 minutes d'appel. Une maquette offerte. Aucun engagement.",
    "primary":   { "label": "Réserver un appel",   "href": "https://cal.com/clement-seguin/strategy-call-30-min" },
    "secondary": { "label": "Envoyer un email",    "href": "mailto:hello@clement-seguin.fr"                       },
    "note": "Ou directement : hello@clement-seguin.fr",
    "checklist": ["Maquette gratuite, sans engagement", "Réponse sous 24h", "Pas d'agence, pas d'intermédiaire"],
    "calendlyLabel": "Réserver via Cal.com",
    "calendlyCta":   "Voir mes disponibilités"
  },
  "contact": {
    "badge": "Contact",
    "headline": "Parlons de votre projet.",
    "desc": "Décrivez votre activité en quelques mots. Je vous réponds sous 24h avec une première idée.",
    "successTitle": "Message envoyé !",
    "successDesc":  "Je vous répondrai sous 24h avec une première idée pour votre site.",
    "submitLabel":  "Envoyer",
    "fields": [
      { "name": "name",     "label": "Votre nom",      "type": "text",     "placeholder": "Marie Dupont"             },
      { "name": "email",    "label": "Email",           "type": "email",    "placeholder": "marie@exemple.fr"         },
      { "name": "activity", "label": "Votre activité",  "type": "text",     "placeholder": "Kinésithérapeute à Lyon"  },
      { "name": "message",  "label": "Votre projet",    "type": "textarea", "placeholder": "Je cherche un site pour..." }
    ],
    "spamNote": "Vos données ne sont jamais revendues.",
    "errorMsg": "Une erreur est survenue. Réessayez ou écrivez-moi directement."
  },
  "footer": {
    "logo": "CS.",
    "tagline": "Sites web pour indépendants et TPE — maquette gratuite, livré en 5 jours.",
    "groups": [
      {
        "title": "Navigation",
        "links": [
          { "label": "Offres",       "href": "#offres"  },
          { "label": "Réalisations", "href": "#works"   },
          { "label": "À propos",     "href": "/about"   }
        ]
      },
      {
        "title": "Contact",
        "links": [
          { "label": "Réserver un appel",       "href": "https://cal.com/clement-seguin/strategy-call-30-min" },
          { "label": "hello@clement-seguin.fr", "href": "mailto:hello@clement-seguin.fr"                       }
        ]
      }
    ],
    "legal": [
      { "label": "Mentions légales", "href": "/legal"   },
      { "label": "CGV",              "href": "/cgv"     },
      { "label": "Confidentialité",  "href": "/privacy" }
    ],
    "copyright": "© 2026 Clément Seguin. Tous droits réservés."
  },
  "notFound": {
    "title": "Page introuvable",
    "desc":  "La page que vous cherchez n'existe pas ou a été déplacée.",
    "cta":   "Retour à l'accueil"
  },
  "legal": {
    "company": "TODO-EIK — Clément Seguin (statut juridique à préciser)",
    "siret":   "TODO-EIK",
    "address": "TODO-EIK"
  }
}
```

- [ ] **Step 2: Build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add data/content.fr.json
git commit -m "feat: add content.fr.json with full FR repositioning copy"
```

---

## Task 5 — Créer data/content.en.json

**Files:**
- Create: `data/content.en.json`

- [ ] **Step 1: Créer data/content.en.json**

```json
{
  "meta": {
    "siteName": "Clément Seguin",
    "tagline": "Professional website creation for freelancers & SMBs",
    "description": "Professional websites for health practitioners, tradespeople and clinics. See your mockup before you pay. From €1,500, delivered in 5 days.",
    "domain": "clement-seguin.fr",
    "email": "hello@clement-seguin.fr",
    "calendly": "https://cal.com/clement-seguin/strategy-call-30-min",
    "linkedin": "https://linkedin.com/in/clementseguin",
    "instagram": "https://www.instagram.com/clementwebbuilds/",
    "twitter": "https://x.com/clembuild"
  },
  "nav": {
    "logo": "CS.",
    "links": [
      { "label": "Offers",    "href": "#offres"    },
      { "label": "Portfolio", "href": "#works"     },
      { "label": "About",     "href": "/en/about"  }
    ],
    "cta": { "label": "Free mockup", "href": "#contact" }
  },
  "hero": {
    "badge": "Free mockup before payment",
    "headline": ["A website that", "brings you clients."],
    "subheadline": "You see the mockup before you pay. Delivered in 5 days. From €1,500.",
    "ctaPrimary":   { "label": "See my free mockup →", "href": "#contact" },
    "ctaSecondary": { "label": "See portfolio",         "href": "#works"   },
    "stats": [
      { "value": "5d",    "label": "Delivery — not 3 months" },
      { "value": "€1,500","label": "Starting from, all-in"   },
      { "value": "€0",    "label": "To pay before the mockup" }
    ],
    "trust": "Mockup before payment · Custom design · Fixed price · You own everything · No commitment",
    "builderProof": ""
  },
  "forWho": {
    "badge": "Who is it for?",
    "headline": ["Made for you", "if you are..."],
    "personas": [
      {
        "icon": "🩺",
        "title": "Health & wellness practitioner",
        "subtitle": "Physiotherapist, therapist, naturopath, osteopath, psychologist...",
        "desc": "Your patients are searching for someone like you on Google. Your website needs to convince them in 10 seconds."
      },
      {
        "icon": "🔨",
        "title": "Tradesperson & local business",
        "subtitle": "Carpenter, painter, landscaper, plumber, roofer...",
        "desc": "Your competitors have a shaky Wix site. This is your chance to stand out."
      },
      {
        "icon": "🏥",
        "title": "Clinic & medical practice",
        "subtitle": "Dental practice, wellness centre, private clinic...",
        "desc": "A premium image reassures your patients even before their first appointment."
      }
    ]
  },
  "problem": {
    "badge": "The problem",
    "headline": ["Your current website", "is costing you clients."],
    "intro": "A poorly built website means a prospect going to your competitor.",
    "points": [
      { "title": "Failed first impression", "desc": "A visitor decides in 8 seconds. If your site looks outdated or doesn't work on mobile, they're already gone." },
      { "title": "Zero trust conveyed",     "desc": "Without social proof, clean design, and clear copy — the prospect won't contact you."                          },
      { "title": "Invisible on Google",     "desc": "Without basic SEO, you don't appear when someone searches for your services in your city."                       }
    ]
  },
  "process": {
    "badge": "How it works",
    "headline": ["Your website in 3 steps.", "No surprises."],
    "steps": [
      {
        "number": "01",
        "title": "Free mockup",
        "subtitle": "Day 1",
        "desc": "We talk for 30 minutes. I design a complete mockup of your site. You see it, you validate it. You pay nothing at this stage."
      },
      {
        "number": "02",
        "title": "You validate, we adjust",
        "subtitle": "Day 2-3",
        "desc": "Unlimited feedback on the mockup until it's exactly what you wanted. Only then: you confirm and pay."
      },
      {
        "number": "03",
        "title": "Delivered in 5 days",
        "subtitle": "Day 4-5",
        "desc": "Site built, hosted, ready to welcome your first visitors. You leave with the keys."
      }
    ]
  },
  "works": {
    "badge": "Portfolio",
    "headline": "Websites that make you want to call.",
    "subheadline": "Every project delivered in less than a week."
  },
  "offers": {
    "badge": "Offers & pricing",
    "headline": ["Transparent pricing.", "Always."],
    "subheadline": "No surprise quote. You know what you're paying before you sign.",
    "plans": [
      {
        "name": "Showcase Website",
        "price": "€1,500",
        "priceNote": "Starting from, excl. VAT",
        "highlight": false,
        "desc": "To start with a professional website that inspires trust.",
        "features": [
          "Custom design",
          "5 to 7 pages",
          "Contact form",
          "Basic SEO (tags, speed)",
          "1-year hosting included",
          "Delivered in 5 days",
          "Free mockup before payment"
        ],
        "cta": "See my free mockup",
        "href": "#contact"
      },
      {
        "name": "Premium Website",
        "price": "€2,500 – €3,000",
        "priceNote": "Excl. VAT — TODO-REVIEW",
        "highlight": true,
        "desc": "For clinics, practices and professionals who want a high-end image.",
        "features": [
          "High-end design",
          "Multiple pages (team, services, gallery)",
          "Integrated online booking",
          "Advanced SEO",
          "1-year hosting included",
          "Delivered in 5 to 7 days",
          "Free mockup before payment"
        ],
        "cta": "See my free mockup",
        "href": "#contact"
      },
      {
        "name": "Monthly Maintenance",
        "price": "€40",
        "priceNote": "/month",
        "highlight": false,
        "desc": "To keep your site up to date without worrying about it.",
        "features": [
          "Hosting & domain name",
          "Automatic backups",
          "Minor edits included",
          "Security updates",
          "Responsive support"
        ],
        "cta": "Contact me",
        "href": "#contact"
      }
    ]
  },
  "testimonials": {
    "badge": "They trusted me",
    "headline": "What they say.",
    "items": []
  },
  "about": {
    "badge": "Who am I?",
    "headline": ["Clément Seguin,", "independent web designer."],
    "desc": "I build websites for independent professionals and SMBs. No agency, no intermediary — you work directly with me, from the first call to delivery.",
    "cta": { "label": "Learn more about me →", "href": "/en/about" }
  },
  "faq": {
    "badge": "FAQ",
    "headline": "Frequently asked questions.",
    "items": [
      { "q": "Do I pay before seeing the result?",              "a": "No. The mockup is free and commitment-free. You only pay after validating it."                              },
      { "q": "What is included in the 5 days?",                "a": "Design + development + go-live + domain configuration + working contact form."                               },
      { "q": "Do I keep ownership of my website?",             "a": "Yes, 100%. Code, hosting, domain — everything belongs to you."                                              },
      { "q": "What if I need changes after delivery?",         "a": "Minor edits are included for the first month. After that, monthly maintenance at €40/month or on demand."   },
      { "q": "I'm not technical — is that a problem?",         "a": "That's exactly who I work for. You don't need to handle anything technical."                                 }
    ],
    "cta": { "label": "Another question? Write to me", "href": "#contact" }
  },
  "cta": {
    "badge": "Ready to start?",
    "headline": "Your free mockup is waiting.",
    "subheadline": "30 minutes call. One free mockup. No commitment.",
    "primary":   { "label": "Book a call",    "href": "https://cal.com/clement-seguin/strategy-call-30-min" },
    "secondary": { "label": "Send an email",  "href": "mailto:hello@clement-seguin.fr"                       },
    "note": "Or directly: hello@clement-seguin.fr",
    "checklist": ["Free mockup, no commitment", "Reply within 24h", "No agency, no intermediary"],
    "calendlyLabel": "Book via Cal.com",
    "calendlyCta":   "See my availability"
  },
  "contact": {
    "badge": "Contact",
    "headline": "Let's talk about your project.",
    "desc": "Describe your activity in a few words. I'll reply within 24h with an initial idea.",
    "successTitle": "Message sent!",
    "successDesc":  "I'll reply within 24h with an initial idea for your website.",
    "submitLabel":  "Send",
    "fields": [
      { "name": "name",     "label": "Your name",     "type": "text",     "placeholder": "John Smith"                   },
      { "name": "email",    "label": "Email",          "type": "email",    "placeholder": "john@example.com"             },
      { "name": "activity", "label": "Your activity",  "type": "text",     "placeholder": "Physiotherapist in London"    },
      { "name": "message",  "label": "Your project",   "type": "textarea", "placeholder": "I'm looking for a site for..." }
    ],
    "spamNote": "Your data is never sold.",
    "errorMsg": "An error occurred. Please try again or write to me directly."
  },
  "footer": {
    "logo": "CS.",
    "tagline": "Websites for freelancers & SMBs — free mockup, delivered in 5 days.",
    "groups": [
      {
        "title": "Navigation",
        "links": [
          { "label": "Offers",    "href": "#offres"    },
          { "label": "Portfolio", "href": "#works"     },
          { "label": "About",     "href": "/en/about"  }
        ]
      },
      {
        "title": "Contact",
        "links": [
          { "label": "Book a call",             "href": "https://cal.com/clement-seguin/strategy-call-30-min" },
          { "label": "hello@clement-seguin.fr", "href": "mailto:hello@clement-seguin.fr"                       }
        ]
      }
    ],
    "legal": [
      { "label": "Legal notice", "href": "/en/legal"   },
      { "label": "Terms",        "href": "/en/cgv"     },
      { "label": "Privacy",      "href": "/en/privacy" }
    ],
    "copyright": "© 2026 Clément Seguin. All rights reserved."
  },
  "notFound": {
    "title": "Page not found",
    "desc":  "The page you're looking for doesn't exist or has been moved.",
    "cta":   "Back to home"
  },
  "legal": {
    "company": "TODO-EIK — Clément Seguin (legal structure to be confirmed)",
    "siret":   "TODO-EIK",
    "address": "TODO-EIK"
  }
}
```

- [ ] **Step 2: Build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add data/content.en.json
git commit -m "feat: add content.en.json with full EN translation"
```

---

## Task 6 — Créer app/[locale]/layout.tsx

**Files:**
- Modify: `app/layout.tsx`
- Create: `app/[locale]/layout.tsx`

**Interfaces:**
- Consumes: `getContent(locale)`, `LocaleSwitcher` (Task 8)
- Produces: layout par locale avec `lang` attr, hreflang, schema.org, Navbar, Footer

- [ ] **Step 1: Simplifier app/layout.tsx**

```typescript
// app/layout.tsx
import type { Viewport } from "next"
import { Instrument_Serif, DM_Sans } from "next/font/google"
import "./globals.css"

const displayFont = Instrument_Serif({
  subsets: ["latin"],
  weight: ["400"],
  style: ["normal", "italic"],
  variable: "--font-display",
  display: "swap",
  preload: true,
})

const bodyFont = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-body",
  display: "swap",
  preload: true,
})

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: dark)",  color: "#07080A" },
    { media: "(prefers-color-scheme: light)", color: "#07080A" },
  ],
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html suppressHydrationWarning className={`scroll-smooth ${displayFont.variable} ${bodyFont.variable}`}>
      <body suppressHydrationWarning className="font-body antialiased bg-bg-base text-text-primary overflow-x-hidden">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 2: Créer app/[locale]/layout.tsx**

```typescript
// app/[locale]/layout.tsx
import type { Metadata } from "next"
import Script from "next/script"
import { getContent, type Locale } from "@/lib/i18n"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { BackToTop } from "@/components/ui/BackToTop"
import { ScrollRevealInit } from "@/components/ui/ScrollRevealInit"

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
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } },
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
          { "@type": "Offer", name: "Site Vitrine", price: "1500", priceCurrency: "EUR" },
          { "@type": "Offer", name: "Site Premium", price: "2500", priceCurrency: "EUR" },
          { "@type": "Offer", name: "Maintenance",  price: "40",   priceCurrency: "EUR" },
        ],
        sameAs: ["https://linkedin.com/in/clementseguin", "https://www.instagram.com/clementwebbuilds/"],
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
    <html lang={locale} suppressHydrationWarning>
      <head>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      </head>
      <body suppressHydrationWarning>
        <div className="grain-overlay" aria-hidden="true" />
        <Navbar content={c.nav} meta={c.meta} locale={locale as Locale} />
        <main>{children}</main>
        <Footer content={c.footer} meta={c.meta} />
        <BackToTop />
        <Script src="https://analytics.ahrefs.com/analytics.js" data-key="A3OiQFMj+bOwDGGqq9Hzvg" strategy="afterInteractive" />
        <Script id="cal-init" strategy="lazyOnload">{`
          (function(C,A,L){let p=function(a,ar){a.q.push(ar)};let d=C.document;C.Cal=C.Cal||function(){let cal=C.Cal;let ar=arguments;if(!cal.loaded){cal.ns={};cal.q=cal.q||[];d.head.appendChild(d.createElement("script")).src=A;cal.loaded=true}if(ar[0]===L){const api=function(){p(api,arguments)};const namespace=ar[1];api.q=api.q||[];typeof namespace==="string"?(cal.ns[namespace]=api)&&p(api,ar):p(cal,ar);return}p(cal,ar)};})(window,"https://app.cal.com/embed/embed.js","init");
          Cal("init",{origin:"https://cal.com"});
        `}</Script>
        <ScrollRevealInit />
      </body>
    </html>
  )
}
```

Note: `Navbar` prend maintenant un prop `locale` (Task 8 le mettra à jour). En attendant, ajouter la prop mais ne pas la consommer encore dans Navbar — TypeScript acceptera l'extra prop si le composant utilise `...rest` ou si on met à jour l'interface en même temps.

- [ ] **Step 3: Build**

```bash
npm run build
```

- [ ] **Step 4: Commit**

```bash
git add app/layout.tsx "app/[locale]/layout.tsx"
git commit -m "feat: add [locale]/layout.tsx with hreflang, schema.org ProfessionalService, lang attr"
```

---

## Task 7 — Commenter admin + docs/admin-restoration.md

**Files:**
- Create: `docs/admin-restoration.md`

- [ ] **Step 1: Vérifier que app/_disabled/admin/ contient tous les fichiers**

```bash
ls app/_disabled/admin/
```

Expected: `page.tsx`, `layout.tsx`, `login/`, `products/`, `projects/`

- [ ] **Step 2: Créer docs/admin-restoration.md**

```markdown
# Admin — Guide de réactivation

## État actuel

L'admin est désactivé depuis le 2026-07-19 (branche feature/repositioning-fr-en).
Tout le code est archivé dans `app/_disabled/`.

## Ce qui est archivé

| Source (désactivé)              | Description                         |
|---|---|
| `app/_disabled/admin/`          | Pages admin (login, products, projects) |
| `app/_disabled/api/admin/`      | Routes API CRUD (produits, projets, upload) |
| `app/_disabled/api/webhooks/`   | Webhook Stripe                      |
| `app/_disabled/shop/`           | Pages boutique                      |
| `app/_disabled/projects/`       | Pages projets dédiées               |

## Dépendances à réactiver

- `lib/airtable.ts` — toujours présent, non modifié
- Variables d'environnement requises :
  `ADMIN_SECRET`, `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`,
  `STRIPE_WEBHOOK_SECRET`, `STRIPE_SECRET_KEY`

## Procédure de réactivation

1. Créer une branche `feat/reactivate-admin`
2. Déplacer les fichiers de `app/_disabled/` vers leurs emplacements d'origine
3. Adapter les pages shop et projects pour le routing i18n (`app/[locale]/shop/`, etc.)
4. Ajouter les variables d'env dans Netlify
5. Tester le build et le workflow CRUD Airtable
6. Retirer les redirections 301 `/shop → /` de next.config.ts
```

- [ ] **Step 3: Commit**

```bash
git add docs/admin-restoration.md
git commit -m "docs: add admin-restoration.md — guide to reactivate disabled admin"
```

---

## Task 8 — LocaleSwitcher + Navbar + ForWho

**Files:**
- Create: `components/layout/LocaleSwitcher.tsx`
- Modify: `components/layout/Navbar.tsx`
- Create: `components/sections/ForWho.tsx`

**Interfaces:**
- Consumes: `locale: Locale` prop depuis `[locale]/layout.tsx`
- Produces: switcher FR/EN, navbar nettoyée, section ForWho pour la homepage

- [ ] **Step 1: Créer components/layout/LocaleSwitcher.tsx**

```typescript
// components/layout/LocaleSwitcher.tsx
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import type { Locale } from "@/lib/i18n"

export function LocaleSwitcher({ locale }: { locale: Locale }) {
  const pathname = usePathname()

  const getFrPath = () => {
    if (pathname.startsWith("/en")) {
      return pathname.replace(/^\/en/, "") || "/"
    }
    return pathname
  }

  const getEnPath = () => {
    if (pathname.startsWith("/en")) return pathname
    return `/en${pathname === "/" ? "" : pathname}`
  }

  return (
    <div className="flex items-center gap-1 text-sm font-body">
      <Link
        href={getFrPath()}
        className={cn(
          "px-1.5 py-0.5 rounded transition-colors duration-200",
          locale === "fr" ? "text-text-primary font-medium" : "text-text-secondary hover:text-text-primary"
        )}
        aria-label="Version française"
      >
        FR
      </Link>
      <span className="text-text-tertiary text-xs">/</span>
      <Link
        href={getEnPath()}
        className={cn(
          "px-1.5 py-0.5 rounded transition-colors duration-200",
          locale === "en" ? "text-text-primary font-medium" : "text-text-secondary hover:text-text-primary"
        )}
        aria-label="English version"
      >
        EN
      </Link>
    </div>
  )
}
```

- [ ] **Step 2: Réécrire components/layout/Navbar.tsx**

```typescript
// components/layout/Navbar.tsx
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { LocaleSwitcher } from "@/components/layout/LocaleSwitcher"
import type { getContent, Locale } from "@/lib/i18n"

type NavContent  = ReturnType<typeof getContent>["nav"]
type MetaContent = ReturnType<typeof getContent>["meta"]

interface NavbarProps {
  content: NavContent
  meta: MetaContent
  locale: Locale
}

function resolveHref(href: string): string {
  if (href.startsWith("#")) return "/" + href
  return href
}

export function Navbar({ content, meta, locale }: NavbarProps) {
  const [scrolled, setScrolled]   = useState(false)
  const [menuOpen, setMenuOpen]   = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40)
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-500",
        scrolled
          ? "bg-bg-base/90 backdrop-blur-xl border-b border-bg-border shadow-[0_1px_0_rgba(255,255,255,0.04)]"
          : "bg-transparent"
      )}
    >
      <nav className="section-container flex items-center justify-between h-16 lg:h-[70px]">
        <Link
          href={locale === "en" ? "/en/" : "/"}
          className="font-display text-xl text-text-primary hover:text-accent transition-colors duration-200"
        >
          {content.logo}
        </Link>

        <ul className="hidden lg:flex items-center gap-1">
          {content.links.map((link) => (
            <li key={link.href}>
              <Link
                href={resolveHref(link.href)}
                className="px-4 py-2 rounded-lg text-sm font-body text-text-secondary
                           hover:text-text-primary hover:bg-bg-surface transition-all duration-200"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden lg:flex items-center gap-4">
          <LocaleSwitcher locale={locale} />
          <Link href={resolveHref(content.cta.href)} className="btn-primary btn-sm">
            {content.cta.label}
          </Link>
        </div>

        <button
          className="lg:hidden p-2 text-text-secondary hover:text-text-primary transition-colors"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Menu"
        >
          <div className="w-5 flex flex-col gap-1.5">
            <span className={cn("block h-px bg-current transition-all duration-300", menuOpen ? "rotate-45 translate-y-2" : "")} />
            <span className={cn("block h-px bg-current transition-all duration-300", menuOpen ? "opacity-0" : "")} />
            <span className={cn("block h-px bg-current transition-all duration-300", menuOpen ? "-rotate-45 -translate-y-2" : "")} />
          </div>
        </button>
      </nav>

      <div
        className={cn(
          "lg:hidden overflow-hidden transition-all duration-400 bg-bg-surface border-b border-bg-border",
          menuOpen ? "max-h-[500px]" : "max-h-0"
        )}
      >
        <div className="section-container py-4 flex flex-col gap-1">
          {content.links.map((link) => (
            <Link
              key={link.href}
              href={resolveHref(link.href)}
              className="px-4 py-3 rounded-xl text-sm text-text-secondary hover:text-text-primary
                         hover:bg-bg-elevated transition-all"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}
          <div className="mt-3 pt-3 border-t border-bg-border flex items-center justify-between gap-3">
            <LocaleSwitcher locale={locale} />
            <Link
              href={resolveHref(content.cta.href)}
              className="btn-primary flex-1 text-center"
              onClick={() => setMenuOpen(false)}
            >
              {content.cta.label}
            </Link>
          </div>
        </div>
      </div>
    </header>
  )
}
```

- [ ] **Step 3: Créer components/sections/ForWho.tsx**

```typescript
// components/sections/ForWho.tsx
import type { SiteContent } from "@/lib/i18n"

type ForWhoContent = SiteContent["forWho"]

export function ForWho({ content }: { content: ForWhoContent }) {
  return (
    <section className="section-padding">
      <div className="section-container">
        <div className="text-center mb-16">
          <span className="badge-accent mb-6 inline-block">{content.badge}</span>
          <h2 className="section-headline">
            {content.headline[0]}{" "}
            <span className="gradient-text-accent">{content.headline[1]}</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {content.personas.map((persona) => (
            <div key={persona.title} className="card card-hover p-8 text-center">
              <div className="text-4xl mb-5" aria-hidden="true">{persona.icon}</div>
              <h3 className="font-display text-xl text-text-primary mb-2">
                {persona.title}
              </h3>
              <p className="text-sm text-text-tertiary mb-4 font-body">{persona.subtitle}</p>
              <p className="text-sm text-text-secondary leading-relaxed">{persona.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Build**

```bash
npm run build
```

Expected: 0 erreurs TS.

- [ ] **Step 5: Commit**

```bash
git add components/layout/LocaleSwitcher.tsx components/layout/Navbar.tsx components/sections/ForWho.tsx
git commit -m "feat: add LocaleSwitcher, update Navbar with locale prop, add ForWho section"
```

---

## Task 9 — Sitemap + robots.ts + next.config.ts

**Files:**
- Modify: `app/sitemap.ts`
- Modify: `app/robots.ts`
- Modify: `next.config.ts`

- [ ] **Step 1: Réécrire app/sitemap.ts**

```typescript
// app/sitemap.ts
import { MetadataRoute } from "next"

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://clement-seguin.fr"

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${BASE}/`,         lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${BASE}/en/`,      lastModified: now, changeFrequency: "weekly",  priority: 0.9 },
    { url: `${BASE}/about`,    lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE}/en/about`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
  ]
}
```

- [ ] **Step 2: Réécrire app/robots.ts**

```typescript
// app/robots.ts
import { MetadataRoute } from "next"

const BASE = process.env.NEXT_PUBLIC_SITE_URL || "https://clement-seguin.fr"

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/en/", "/about", "/en/about", "/legal", "/cgv", "/privacy", "/merci"],
        disallow: [
          "/admin", "/api/",
          "/shop", "/en/shop",
          "/projects", "/en/projects",
          "/blog", "/en/blog",
          "/open", "/en/open",
          "/uses", "/en/uses",
        ],
      },
    ],
    sitemap: `${BASE}/sitemap.xml`,
  }
}
```

- [ ] **Step 3: Mettre à jour next.config.ts — remplacer le tableau redirects()**

Dans `next.config.ts`, remplacer uniquement la fonction `redirects()` :

```typescript
async redirects() {
  return [
    // ── Anciennes routes i18n ─────────────────────────────
    { source: "/fr",           destination: "/",      permanent: true },
    { source: "/fr/:path*",    destination: "/:path*", permanent: true },
    { source: "/en/fr/:path*", destination: "/en/:path*", permanent: true },

    // ── Pages désactivées → homepage ─────────────────────
    { source: "/shop",            destination: "/", permanent: true },
    { source: "/shop/:path*",     destination: "/", permanent: true },
    { source: "/projects",        destination: "/", permanent: true },
    { source: "/projects/:path*", destination: "/", permanent: true },
    { source: "/blog",            destination: "/", permanent: true },
    { source: "/blog/:path*",     destination: "/", permanent: true },
    { source: "/open",            destination: "/", permanent: true },
    { source: "/uses",            destination: "/", permanent: true },

    // ── Anciennes URLs déjà existantes ────────────────────
    { source: "/projets",         destination: "/",    permanent: true },
    { source: "/projets/:slug",   destination: "/",    permanent: true },
    { source: "/terms",           destination: "/cgv", permanent: true },
    { source: "/en",              destination: "/en/", permanent: true },
  ]
},
```

- [ ] **Step 4: Build**

```bash
npm run build
```

- [ ] **Step 5: Commit**

```bash
git add app/sitemap.ts app/robots.ts next.config.ts
git commit -m "feat: update sitemap (FR/EN only), robots.txt, 301 redirections"
```

---

## Task 10 — Vérification finale

- [ ] **Step 1: Build de production propre**

```bash
npm run build
```

Expected: 0 erreurs. Output doit montrer les routes statiques `/fr` et `/en`.

- [ ] **Step 2: Test en local**

```bash
npm run dev
```

Checklist :

- [ ] `http://localhost:3000/` → homepage FR, `<html lang="fr">`
- [ ] `http://localhost:3000/en/` → homepage EN, `<html lang="en">`
- [ ] Switcher FR/EN visible et fonctionnel dans la navbar + mobile
- [ ] `/about` → À propos FR, indexable
- [ ] `/en/about` → About EN, indexable
- [ ] `/shop` → redirige vers `/`
- [ ] `/projects` → redirige vers `/`
- [ ] `/blog` → redirige vers `/`
- [ ] `/admin` → redirige vers `/admin/login`
- [ ] Footer : uniquement Offres/Réalisations/À propos + Contact
- [ ] `<title>` FR : "Création de site web pour indépendants et TPE"
- [ ] `<title>` EN : "Professional website for freelancers"
- [ ] `<link rel="alternate" hreflang="fr">` présent dans `<head>`
- [ ] Schema.org ProfessionalService dans `<head>`
- [ ] `/sitemap.xml` : 4 URLs uniquement (/, /en/, /about, /en/about)

- [ ] **Step 3: Lister les TODO restants**

```bash
grep -rn "TODO-REVIEW\|TODO-EIK\|TODO-PORTFOLIO" data/ app/ components/ --include="*.json" --include="*.tsx" --include="*.ts"
```

Communiquer la liste à Clément pour relecture avant merge.

- [ ] **Step 4: Commit final**

```bash
git add -A
git commit -m "feat: repositioning complete — FR/EN bilingue, pages SaaS masquées, copy réécrit"
```

---

## Post-merge : Actions manuelles (Clément)

1. `git checkout main && git merge feature/repositioning-fr-en`
2. Netlify : déclencher un rebuild manuel
3. **Google Search Console** :
   - Soumettre `https://clement-seguin.fr/sitemap.xml`
   - Outil de retrait d'URL pour : `/shop`, `/shop/*`, `/projects`, `/projects/*`, `/blog`, `/blog/*`, `/open`, `/uses`
4. Remplir les `TODO-EIK` dans les deux fichiers JSON quand la structure juridique est confirmée
5. Relire les `TODO-REVIEW` (stats hero, prix Premium, copy About)

---

## Récapitulatif des commits

| # | Message de commit |
|---|---|
| 1 | `feat: rewrite middleware for locale detection + admin protection` |
| 2 | `feat: move pages to app/[locale]/ — archive SaaS pages to _disabled/` |
| 3 | `feat: update i18n.ts — getContent(locale) loads content.fr.json or content.en.json` |
| 4 | `feat: add content.fr.json with full FR repositioning copy` |
| 5 | `feat: add content.en.json with full EN translation` |
| 6 | `feat: add [locale]/layout.tsx with hreflang, schema.org ProfessionalService, lang attr` |
| 7 | `docs: add admin-restoration.md — guide to reactivate disabled admin` |
| 8 | `feat: add LocaleSwitcher, update Navbar with locale prop, add ForWho section` |
| 9 | `feat: update sitemap (FR/EN only), robots.txt, 301 redirections` |
| 10 | `feat: repositioning complete — FR/EN bilingue, pages SaaS masquées, copy réécrit` |
