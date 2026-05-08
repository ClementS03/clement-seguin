# Architecture — clement-seguin.fr
_Voir CLAUDE.md pour le résumé. Ce fichier contient les détails techniques._

## Structure de routing (actuelle — post Phase 1a)

```
app/
  layout.tsx              ← Root layout : fonts, metadata EN, Navbar, Footer, JSON-LD
  globals.css             ← Design system (Tailwind v3 — migration v4 à faire en Phase 1b)
  page.tsx                ← Homepage (sections freelance)
  not-found.tsx           ← 404
  sitemap.ts              ← Sitemap EN
  robots.ts               ← Robots

  blog/
    page.tsx              ← Liste des articles
    [slug]/page.tsx       ← Article dynamique

  boutique/               ← À créer — Phase 2
    page.tsx
    [slug]/page.tsx

  projets/                ← À créer — Phase 2
    page.tsx
    [slug]/page.tsx

  open/                   ← À créer — Phase 2
    page.tsx

  uses/                   ← À créer — Phase 2
    page.tsx

  admin/                  ← À créer — Phase 3 (protégé next-auth)
    layout.tsx
    login/page.tsx
    page.tsx
    products/page.tsx
    projects/page.tsx
    orders/page.tsx
    metrics/page.tsx
    waitlist/page.tsx

  api/
    contact/route.ts      ← Resend (existant)
    newsletter/route.ts   ← Newsletter (existant)
    unsubscribe/route.ts  ← Unsubscribe (existant)
    auth/[...nextauth]/route.ts   ← À créer Phase 1c
    waitlist/route.ts             ← À créer Phase 1c
    webhooks/
      lemon-squeezy/route.ts      ← À créer Phase 4
    admin/
      products/route.ts           ← À créer Phase 3
      projects/route.ts           ← À créer Phase 3
```

## Contenu

- `data/content.json` — tout le contenu du site (EN uniquement)
- `data/posts.json` — articles de blog EN (fallback si Notion absent)
- `lib/i18n.ts` — `getContent()`, `getPosts()`, `getPost(slug)` — sans locale
- `lib/notion.ts` — `getNotionPosts()`, `getNotionPost(slug)` — sans locale, filtre Language supprimé

**Note Notion :** La colonne `Language` dans la base Notion n'est plus utilisée. Elle peut rester sans impact, ou être supprimée de la DB Notion pour faire propre.

## Schéma Supabase (à ajouter — Phase 1c)

Migré depuis `indie-store/supabase/migrations/001_initial.sql`.

**products** — id, slug, name, description, price, lemon_squeezy_product_id, lemon_squeezy_variant_id, category, tags[], cover_image, preview_images[], features[], tech_stack[], status (draft|published|archived), download_url, created_at, updated_at

**projects** — id, slug, name, description, short_description, status (live|beta|building|paused|archived), url, github_url, cover_image, tech_stack[], metrics (JSON), featured, created_at, updated_at

**orders** — id, lemon_squeezy_order_id, product_id (FK), customer_email, customer_name, amount, currency, status, created_at

**waitlist** — id, email, source, created_at

**site_metrics** — id, date, mrr, total_revenue, total_orders, total_customers, updated_at

## Middleware

`middleware.ts` supprimé (Phase 1a). À recréer en Phase 1c quand next-auth v5 est ajouté, uniquement pour protéger `/admin/*`.

## Auth (à ajouter — Phase 1c)

next-auth v5 beta, Credentials provider uniquement.
Variables : `ADMIN_EMAIL` + `ADMIN_PASSWORD` + `NEXTAUTH_SECRET`.
Middleware protégera `/admin/*` sauf `/admin/login`.

## LemonSqueezy (à ajouter — Phase 4)

Merchant of Record — gère TVA EU automatiquement.
Webhook sur `/api/webhooks/lemon-squeezy` → sync commandes → table `orders`.
Variables : `LEMONSQUEEZY_API_KEY` + `LEMONSQUEEZY_WEBHOOK_SECRET`.
