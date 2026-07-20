# CLAUDE.md — Projet clement-seguin.fr

Référence complète du projet pour Claude. À lire en priorité avant toute modification.

---

## Identité

- **Nom :** Clément Seguin
- **Activité :** Webdesigner freelance — sites web pour TPE/PME et indépendants
- **Cible :** Praticiens santé/bien-être, artisans, cliniques & cabinets
- **Positionnement :** Maquette gratuite avant paiement · Livré en 5 jours · À partir de 1 500 €
- **Acquisition :** 100% téléphone + visio — le site sert de preuve et réassurance
- **Domaine :** clement-seguin.fr
- **Email :** hello@clement-seguin.fr
- **Hébergement :** Netlify (branche `main` → déploiement auto)
- **Repo GitHub :** ClementS03/clement-seguin

---

## Stack technique

- **Framework :** Next.js 15 — App Router, TypeScript strict
- **CSS :** Tailwind CSS v4 (CSS-first) + classes custom dans `app/globals.css`
- **Fonts :** Instrument Serif (display) + DM Sans (body) via `next/font/google`
- **Email :** Resend (`app/api/contact/route.ts`)
- **i18n :** FR/EN — `app/[locale]/` — `/` = FR (défaut), `/en/` = EN
- **Déploiement :** Netlify, rebuild auto sur push main

---

## Architecture fichiers

```
app/
  layout.tsx                ← Root layout : fonts, globals.css, <html>/<body> shell
  robots.ts                 ← Robots.txt dynamique
  sitemap.ts                ← Sitemap : 4 URLs uniquement (/, /en/, /about, /en/about)
  not-found.tsx             ← Page 404 globale
  [locale]/                 ← locale = "fr" (/) ou "en" (/en/)
    layout.tsx              ← Layout par locale : Navbar, Footer, hreflang, schema.org
    page.tsx                ← Homepage : Hero, ForWho, Process, Works, Offers, Testimonials, About, FAQ, CTA
    about/page.tsx          ← À propos (indexable)
    legal/page.tsx          ← Mentions légales (noindex)
    privacy/page.tsx        ← Confidentialité (noindex)
    cgv/page.tsx            ← CGV (noindex)
    merci/page.tsx          ← Confirmation contact (noindex)
    blog/page.tsx           ← NOINDEX — retourne notFound()
    shop/page.tsx           ← NOINDEX — retourne notFound()
    projects/page.tsx       ← NOINDEX — retourne notFound()
    open/page.tsx           ← NOINDEX — retourne notFound()
    uses/page.tsx           ← NOINDEX — retourne notFound()
  _disabled/                ← Code archivé (admin, shop, blog, projects…) — NE PAS SUPPRIMER
  api/
    contact/route.ts        ← Formulaire contact (Resend, rate-limit 5req/10min)
    newsletter/route.ts     ← Inscription newsletter
    unsubscribe/route.ts    ← Désinscription newsletter
    media/[...key]/route.ts ← Proxy media

components/
  layout/
    Navbar.tsx              ← Nav responsive + LocaleSwitcher — prend prop locale: Locale
    Footer.tsx              ← Footer piloté par content.footer.groups[]
    LocaleSwitcher.tsx      ← Client component FR/EN — usePathname() pour préserver le path
    HtmlLangSetter.tsx      ← Client component : patche document.lang côté client
  sections/
    Hero.tsx                ← SERVER COMPONENT — LCP, pas de "use client"
    ForWho.tsx              ← 3 cartes personas (praticien / artisan / clinique)
    Process.tsx             ← 3 étapes (maquette → validation → livraison)
    Works.tsx               ← Slider projets — lit content.works.projects[]
    Offers.tsx              ← Cartes tarifs
    Testimonials.tsx        ← Avis clients — se cache si items: []
    About.tsx               ← Section courte homepage
    FAQ.tsx
    CTA.tsx                 ← Formulaire contact inline

data/
  content.fr.json           ← TOUT le texte FR — source de vérité
  content.en.json           ← TOUT le texte EN — même structure exacte que FR

lib/
  i18n.ts                   ← getContent(locale: "fr" | "en"): SiteContent
  utils.ts                  ← cn() helper

middleware.ts               ← Rewrite / → /fr en interne · /en/* passé direct · /admin/* protégé
```

---

## i18n — Comment ça marche

| URL visiteur | Ce que fait le middleware | Locale servi |
|---|---|---|
| `/` | Rewrite interne → `/fr` (URL reste `/`) | `fr` |
| `/about` | Rewrite interne → `/fr/about` | `fr` |
| `/en/` | Passthrough | `en` |
| `/en/about` | Passthrough | `en` |

**RÈGLE ABSOLUE :** Ne jamais ajouter de redirect `/fr → /` ou `/en → /en/` dans `next.config.ts`. Ça crée une boucle infinie sur Netlify avec le middleware rewrite.

---

## Contenu — Comment modifier

- **Texte FR :** `data/content.fr.json`
- **Texte EN :** `data/content.en.json`
- **Toujours modifier les 2 fichiers** en même temps
- **Ne jamais hardcoder de texte** dans les composants `.tsx`
- `lib/i18n.ts` expose `getContent(locale)` — `SiteContent = typeof contentFr`

### Ajouter un projet au slider (Works)

Dans `content.fr.json` ET `content.en.json` → clé `works.projects[]` :
```json
{
  "id": "mon-projet",
  "name": "Nom du projet",
  "category": "Type de site",
  "description": "Description courte",
  "tags": ["Tag1", "Tag2"],
  "url": "https://...",
  "screenshot": "/projects/mon-projet.jpg"
}
```
Screenshot à placer dans `public/projects/` (format recommandé : JPG, ~1200×800).

### Ajouter des témoignages

Dans `content.fr.json` → `testimonials.items[]`. La section se cache automatiquement si vide.

---

## Offres (tarifs actuels — 2026-07)

| Offre | Prix HT | Délai | Cible |
|---|---|---|---|
| Vitrine Essentiel | 1 500€ | 5 jours | Artisans, petits indépendants |
| Vitrine Pro ⭐ | 2 900€ | 7 jours | Praticiens santé, consultants |
| Clinique & Cabinet | 5 000€ | 10-14 jours | Cliniques, cabinets multi-praticiens |
| Maintenance | 150€/mois | — | Tous |

---

## Design system

### Couleurs (`app/globals.css`)

| Variable | Valeur | Usage |
|---|---|---|
| `accent` | `#2D9E6B` | CTAs, accents principaux |
| `teal` | `#4ECBA8` | Badges succès, checkmarks |
| `bg-base` | `#07080A` | Fond de page |
| `bg-surface` | `#0C0F0D` | Cards, panels |
| `bg-elevated` | `#141A15` | Inputs, éléments surélevés |
| `text-primary` | `#EDF2ED` | Texte principal |
| `text-secondary` | `#8A9A8B` | Texte atténué |

### Classes custom importantes

```css
.btn-primary / .btn-secondary
.badge-accent / .badge-teal
.card / .card-hover
.section-headline / .section-subheadline
.section-container / .section-padding
.reveal / .reveal-delay-1 / .reveal-delay-2   /* animations scroll */
.gradient-text-accent / .text-gradient-hero
.grain-overlay                                 /* texture fond, fixed, z-9999 */
```

---

## SEO

- **Hreflang** : généré dans `[locale]/layout.tsx` via `alternates.languages`
- **Schema.org** : `ProfessionalService` JSON-LD dans `[locale]/layout.tsx`
- **Sitemap** : `https://clement-seguin.fr/sitemap.xml` — 4 URLs seulement
- **Robots** : disallow sur toutes les pages désactivées (shop, blog, projects, open, uses)

---

## Formulaire de contact

- **Route :** `POST /api/contact`
- **Service :** Resend
- **Variables d'env requises :**
  - `RESEND_API_KEY`
  - `CONTACT_EMAIL_TO` (hello@clement-seguin.fr)
  - `NEXT_PUBLIC_SITE_URL` (https://clement-seguin.fr)

---

## Pages désactivées — app/_disabled/

Code conservé mais inaccessible en prod. Pour réactiver : voir `docs/admin-restoration.md`.

| Dossier | Contenu |
|---|---|
| `_disabled/admin/` | Dashboard admin (CRUD produits, projets Airtable) |
| `_disabled/api/admin/` | Routes API Airtable |
| `_disabled/api/webhooks/` | Webhook Stripe |
| `_disabled/shop/` | Boutique produits digitaux |
| `_disabled/projects/` | Portfolio public (Airtable) |
| `_disabled/blog/` | Blog Notion |
| `_disabled/open/` | Métriques publiques |
| `_disabled/uses/` | Page stack/outils |

---

## TODO restants

- **TODO-EIK** : SIRET + adresse dans `data/content.fr.json` et `content.en.json` → clé `legal`
- **TODO-REVIEW** : Détails perso optionnels dans `app/[locale]/about/page.tsx` ligne ~114
- **Témoignages** : Ajouter dans `content.fr.json` → `testimonials.items[]` quand disponibles

---

## Commandes utiles

```bash
npm run dev       # Dev local → localhost:3000
npm run build     # Build de prod (tester avant push)
npx tsc --noEmit  # Vérification TypeScript seule
```

---

## Règles importantes pour Claude

1. **Ne jamais hardcoder de texte** dans les composants — tout passe par les JSON
2. **Toujours modifier content.fr.json ET content.en.json** en même temps
3. **Hero.tsx est un Server Component** — ne pas ajouter `"use client"`
4. **Navbar.tsx prend un prop `locale: Locale`** — ne pas l'oublier
5. **Ne jamais ajouter de redirects `/fr` ou `/en`** dans next.config.ts — boucle infinie Netlify
6. **`app/_disabled/`** — ne jamais supprimer, c'est l'archive du code désactivé
7. **Tester `npm run build`** avant tout push sur main
