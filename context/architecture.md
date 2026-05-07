# Architecture — clement-seguin.fr
_Voir CLAUDE.md pour le résumé. Ce fichier contient les détails techniques._

## Structure de routing (hybride)

```
app/
  layout.tsx              ← Root layout (fonts, metadata, JSON-LD)
  globals.css             ← Design system (Tailwind v4 après migration)

  [lang]/                 ← Pages freelance — i18n fr/en
    layout.tsx
    page.tsx              ← Homepage freelance
    blog/
      page.tsx
      [slug]/page.tsx
    api/
      contact/route.ts    ← Resend

  boutique/               ← Hors i18n — templates à vendre
    page.tsx
    [slug]/page.tsx

  projets/                ← Hors i18n — showcase build-in-public
    page.tsx
    [slug]/page.tsx

  open/                   ← Hors i18n — métriques publiques (Recharts)
    page.tsx

  uses/                   ← Hors i18n — stack/outils
    page.tsx

  admin/                  ← Hors i18n — dashboard interne (next-auth)
    layout.tsx
    login/page.tsx
    page.tsx              ← Dashboard
    products/page.tsx
    projects/page.tsx
    orders/page.tsx
    metrics/page.tsx
    waitlist/page.tsx

  api/
    auth/[...nextauth]/route.ts
    waitlist/route.ts
    webhooks/
      lemon-squeezy/route.ts
    admin/
      products/route.ts
      projects/route.ts
```

## Schéma Supabase (depuis indie-store)

Migré depuis `indie-store/supabase/migrations/001_initial.sql`.

### Tables principales

**products**
- id, slug, name, description, price, lemon_squeezy_product_id, lemon_squeezy_variant_id
- category, tags[], cover_image, preview_images[], features[], tech_stack[]
- status (draft|published|archived), download_url, created_at, updated_at

**projects**
- id, slug, name, description, short_description, status (live|beta|building|paused|archived)
- url, github_url, cover_image, tech_stack[], metrics (JSON), featured, created_at, updated_at

**orders**
- id, lemon_squeezy_order_id, product_id (FK), customer_email, customer_name
- amount, currency, status, created_at

**waitlist**
- id, email, source, created_at

**site_metrics**
- id, date, mrr, total_revenue, total_orders, total_customers, updated_at

## Middleware

Le middleware actuel (`middleware.ts`) gère uniquement la détection de langue pour `[lang]/`.
Après la fusion, il devra aussi exclure les routes hors i18n (`/boutique`, `/projets`, `/open`, `/uses`, `/admin`, `/api/auth`).

## Auth (admin uniquement)

next-auth v5 beta, Credentials provider uniquement.
Variables : `ADMIN_EMAIL` + `ADMIN_PASSWORD` + `NEXTAUTH_SECRET`.
Middleware protège `/admin/*` sauf `/admin/login`.

## LemonSqueezy

Merchant of Record — gère TVA EU automatiquement.
Webhook sur `/api/webhooks/lemon-squeezy` → sync commandes → table `orders`.
Variables : `LEMONSQUEEZY_API_KEY` + `LEMONSQUEEZY_WEBHOOK_SECRET`.
