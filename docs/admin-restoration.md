# Admin — Guide de réactivation

**Status:** Désactivé depuis 2026-07-20 (branche `feature/repositioning-fr-en`)  
**Last verified:** 2026-07-20

---

## État actuel

L'interface admin et toutes les pages associées (boutique, projets, métriques) ont été archivées dans `app/_disabled/` pour simplifier le repositioning du site vers une cible unique (coachs, consultants, thérapeutes).

Tout le code est préservé et prêt à être réactivé sur une branche future.

---

## Ce qui est archivé

### Pages & Routes UI

| Source (désactivé)          | Destination finale | Description                                  |
|-----------------------------|-------------------|----------------------------------------------|
| `app/_disabled/admin/`      | `app/admin/`      | Interface de gestion admin (login requis)    |
| `app/_disabled/shop/`       | `app/[locale]/shop/` | Boutique de templates (public)             |
| `app/_disabled/projects/`   | `app/[locale]/projects/` | Showcase des projets (public)           |
| `app/_disabled/open/`       | `app/open/`       | Métriques publiques (hors i18n)            |
| `app/_disabled/uses/`       | `app/uses/`       | Stack d'outils (hors i18n)                 |
| `app/_disabled/blog/`       | `app/[locale]/blog/` | Blog alternatif (à merger avec courant)   |

### Routes API

| Source                          | Description                                    |
|---------------------------------|------------------------------------------------|
| `app/_disabled/api/admin/auth/` | Authentification admin (password simple)      |
| `app/_disabled/api/admin/products/` | CRUD produits (Airtable)                 |
| `app/_disabled/api/admin/products/[id]/promo/` | Promo codes (Stripe)         |
| `app/_disabled/api/admin/projects/` | CRUD projets (Airtable)                |
| `app/_disabled/api/admin/upload/` | Upload d'images (S3 ou autre)           |
| `app/_disabled/api/webhooks/stripe/` | Webhook Stripe (paiements)              |

### Composants

| Fichier                      | Usage                                   |
|------------------------------|----------------------------------------|
| `AdminTabs.tsx`              | Navigation tabset (Products / Projects) |
| `AdminLayout.tsx`            | Wrapper layout (header + navigation)   |
| `ProductForm.tsx`            | Formulaire de création/édition produit |
| `ProjectForm.tsx`            | Formulaire de création/édition projet  |
| `EditProductClient.tsx`      | Page édition produit                   |
| `EditProjectClient.tsx`      | Page édition projet                    |
| `DeleteButton.tsx`           | Bouton suppression (confirm + appel)   |
| `ProductCard.tsx`            | Card produit (shop public)             |
| `ShopClient.tsx`             | Client component filtres/tri (shop)    |
| `ProjectsGrid.tsx`           | Grille projets (public)                |
| `Lightbox.tsx`               | Galerie lightbox (projets)             |
| `MediaGallery.tsx`           | Galerie images (produit)               |

---

## Dépendances

### Bibliothèques (déjà installées)

```json
{
  "dependencies": {
    "airtable": "latest",
    "stripe": "latest",
    "next": "15.5.14"
  },
  "devDependencies": {}
}
```

### Utilitaires locaux

- `lib/airtable.ts` — présent & intact, **ne pas modifier**
  - `getProducts()`, `getProduct(slug)`, `getProductsAdmin()`, `getProductById(id)`
  - `getProjects()`, `getProject(slug)`, `getProjectsAdmin()`, `getProjectById(id)`
  - `airtableCreateProduct()`, `airtableUpdateProduct()`, `airtableDeleteProduct()`
  - `airtableCreateProject()`, `airtableUpdateProject()`, `airtableDeleteProject()`
  - `getProductByStripePriceId()` — pour webhooks

- `lib/rate-limit.ts` — requise pour auth admin
  - `rateLimit(key, options)` — limite 10 tentatives/15 min par IP

---

## Variables d'environnement requises

À ajouter à `.env.local` ET Netlify Environment Variables :

```bash
# Airtable (CRUD produits/projets)
AIRTABLE_API_KEY=pat_xxxxxxxxxxxxx
AIRTABLE_BASE_ID=appxxxxxxxxxxxxx

# Admin (authentification simple, mot de passe)
ADMIN_SECRET=your-secret-password-min-16-chars

# Stripe (paiements, webhooks)
STRIPE_SECRET_KEY=sk_live_xxxxxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxx

# Upload S3 (optionnel — pour app/_disabled/api/admin/upload/)
# AWS_S3_BUCKET=
# AWS_S3_REGION=
# AWS_S3_ACCESS_KEY_ID=
# AWS_S3_SECRET_ACCESS_KEY=
```

### Où les obtenir

- **AIRTABLE_API_KEY** → [airtable.com/api](https://airtable.com/api) → Personal access tokens
- **AIRTABLE_BASE_ID** → URL de ta base : `airtable.com/appXXXXXXXX/tblXXXX` → la partie `appXXXXXXXX`
- **ADMIN_SECRET** → Génère une clé aléatoire : `openssl rand -base64 24`
- **STRIPE_SECRET_KEY** → [dashboard.stripe.com/apikeys](https://dashboard.stripe.com/apikeys)
- **STRIPE_WEBHOOK_SECRET** → Stripe Dashboard → Webhooks → endpoint listenin

---

## Structure des tables Airtable

### Table "Products"

| Field Name         | Type   | Notes                                    |
|--------------------|--------|------------------------------------------|
| Name               | Text   | Nom du produit                           |
| Slug               | Text   | URL slug (unique)                        |
| Tagline            | Text   | Courte description                       |
| Description        | Text   | Description longue (markdown)            |
| Price              | Number | Prix en USD (cents)                      |
| Category           | Text   | Catégorie (ex: "Template", "Tool")      |
| Status             | Text   | "Active", "Draft", "Archived"           |
| Image URL          | Text   | URL de l'image principale                |
| Gallery            | Text   | URLs d'images (une par ligne)           |
| Video URL          | Text   | URL vidéo démo (YouTube)                 |
| Stack              | Multi-select | Technologies utilisées                  |
| Tags               | Multi-select | Tags SEO                                |
| Featured           | Checkbox | Affiché en évidence                     |
| Stripe Product ID  | Text   | ID Stripe (si payant)                   |
| Stripe Price ID    | Text   | ID Stripe Price (si payant)             |
| Buy URL            | Text   | Lien d'achat principal                  |
| Buy Links          | Text   | Liens alternatifs (format: `Label | URL\nLabel | URL`) |
| Download URL       | Text   | Lien téléchargement (fichiers)          |
| Features           | Text   | Features (une par ligne)                |
| Draft              | Checkbox | Cache le produit (même si Published)  |

### Table "Projects"

| Field Name      | Type   | Notes                                      |
|-----------------|--------|---------------------------------------------|
| Name            | Text   | Nom du projet                              |
| Slug            | Text   | URL slug (unique)                          |
| Tagline         | Text   | Courte description                         |
| Description     | Text   | Description longue                         |
| Status          | Text   | "Building", "Shipped", "Sunset"           |
| Type            | Text   | Type de projet (ex: "SaaS", "Tool", "Content") |
| URL             | Text   | URL du projet                              |
| Image URL       | Text   | Couverture du projet                       |
| Gallery         | Text   | URLs d'images (une par ligne)              |
| Video URL       | Text   | URL vidéo démo                             |
| Metrics         | Text   | Format: `Label | Value\nLabel | Value`    |
| MRR             | Number | Revenue mensuel (optionnel)                |
| Users           | Number | Nombre d'utilisateurs (optionnel)         |
| Stack           | Multi-select | Technologies utilisées                  |
| Featured        | Checkbox | Affiché en premier                       |
| Started         | Text   | Date de lancement (YYYY-MM-DD)           |

---

## Authentification Admin

### Workflow actuel

1. **Login** (`/admin/login`)
   - Formulaire password uniquement (pas de username)
   - Endpoint: `POST /api/admin/auth`
   - Stocke cookie `admin_token` (HTTPOnly, 7 jours)

2. **Middleware** (à créer)
   - Protège les routes `/admin/*`
   - Redirige vers `/admin/login` si absent/invalide

3. **Rate limiting**
   - 10 tentatives max par IP / 15 minutes
   - Retour 429 avec header `Retry-After`

### Améliorations recommandées (future)

- Remplacer password simple par **next-auth** (sessions DB)
- Ajouter **2FA** (TOTP)
- Audit trail (logs login/éditions)

---

## Procédure de réactivation

### Step 1 : Créer une branche de développement

```bash
git switch -c feat/reactivate-admin
```

### Step 2 : Déplacer les fichiers

```bash
# Pages & components
cp -r app/_disabled/admin app/admin
cp -r app/_disabled/shop app/[locale]/shop
cp -r app/_disabled/projects app/[locale]/projects
cp app/_disabled/open/page.tsx app/open/page.tsx
cp app/_disabled/uses/page.tsx app/uses/page.tsx

# Routes API
cp -r app/_disabled/api/admin app/api/admin
cp -r app/_disabled/api/webhooks app/api/webhooks
```

### Step 3 : Adapter les imports & routing

#### Pages publiques (shop, projects)

Ajouter `[locale]` au routing si nécessaire :

```typescript
// Avant (dans _disabled)
export default function ShopPage() { ... }
// → Route: /shop

// Après
export default function ShopPage() { ... }
// → Route: /[locale]/shop (ex: /en/shop, /fr/shop)
```

**Fichiers à modifier :**
- `app/[locale]/shop/page.tsx` — metadata.alternates.canonical
- `app/[locale]/projects/page.tsx` — metadata.alternates.canonical
- `app/[locale]/shop/[slug]/page.tsx` — getStaticParams, generateMetadata
- `app/[locale]/projects/[slug]/page.tsx` — getStaticParams, generateMetadata

#### Admin (protégé, pas de [locale])

L'admin RESTE à `/admin` (pas sous `[locale]`) car c'est un espace interne.

#### Blog optionnel

Si tu décides de réintégrer le blog depuis `_disabled/blog/`, le fusionner avec le code actuel (Notion + JSON fallback).

### Step 4 : Créer le middleware de protection admin

Créer `middleware.ts` (root):

```typescript
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protéger les routes admin
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("admin_token")?.value;

    // /admin/login est public
    if (pathname === "/admin/login") return NextResponse.next();

    // Autres routes admin → vérifier token
    if (!token) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin/login";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
```

### Step 5 : Ajouter les variables d'environnement

**Dans `.env.local` :**
```bash
AIRTABLE_API_KEY=pat_xxxxx
AIRTABLE_BASE_ID=appxxxxx
ADMIN_SECRET=your-password
STRIPE_SECRET_KEY=sk_xxxxx
STRIPE_WEBHOOK_SECRET=whsec_xxxxx
```

**Dans Netlify Environment Variables :**
- Tableau Netlify Dashboard → Build & Deploy → Environment
- Ajouter les mêmes 5 variables

### Step 6 : Tester localement

```bash
npm run dev
# Visiter http://localhost:3000/admin
# → Doit rediriger vers /admin/login
# → Entrer ADMIN_SECRET
# → Doit accéder à la dashboard
```

Vérifier :
- ✅ Login fonctionne
- ✅ CRUD produits fonctionne (Airtable)
- ✅ CRUD projets fonctionne (Airtable)
- ✅ Boutique publique affiche les produits
- ✅ Pages projets affichent les données

### Step 7 : Tester le build

```bash
npm run build
# Pas d'erreurs TS → bon signe
```

### Step 8 : Retirer les redirects 301 (optionnel)

Si tu réactives shop/projects, tu peux retirer les redirects dans `next.config.ts` :

```typescript
async redirects() {
  return [
    // ❌ À RETIRER si shop/projects sont actifs
    // { source: "/shop", destination: "/", permanent: true },
    // { source: "/projects", destination: "/", permanent: true },
  ];
}
```

### Step 9 : Commit & Push

```bash
git add .
git commit -m "feat: reactivate admin, shop, projects, open — restore disabled modules"
git push -u origin feat/reactivate-admin
```

### Step 10 : Créer une PR

Vérifier la PR :
- [ ] Tous les fichiers en place
- [ ] Pas d'erreurs TypeScript
- [ ] `npm run build` réussit
- [ ] Env vars configurées dans Netlify
- [ ] Admin login fonctionne en staging

Merge → Netlify rebuild automatique.

---

## Post-réactivation

### Checklist de vérification

- [ ] Admin login accessible et fonctionnel
- [ ] CRUD produits (create, read, update, delete) opérationnel
- [ ] CRUD projets opérationnel
- [ ] Boutique publique affiche les produits (featured en tête)
- [ ] Pages produits (slug) chargent correctement
- [ ] Pages projets (slug) chargent correctement
- [ ] SEO metadata correct (canonical, og:image)
- [ ] Webhooks Stripe configurés (testmode + live)
- [ ] Images uploadées via admin apparaissent
- [ ] Rate limiting auth actif (test 11+ tentatives → 429)

### Monitoring

Ajouter logs pour ces points critiques :

```typescript
// api/admin/products/route.ts
console.log(`[ADMIN] User created product: ${product.name}`);
console.log(`[ADMIN] Airtable sync failed: ${error.message}`);

// api/webhooks/stripe/route.ts
console.log(`[WEBHOOK] Stripe event: ${event.type} — product ${stripePriceId}`);
```

### Améliorations futures

1. **Auth robuste** — Remplacer password par next-auth + DB sessions
2. **Audit trail** — Enregistrer qui a modifié quoi et quand
3. **Notifications** — Email quand nouveau produit/projet créé
4. **Analytics** — Intégrer Vercel Analytics pour la boutique
5. **Webhooks avancés** — Sync Airtable ↔ Stripe bidirectionnel
6. **CDN images** — Déplacer uploads vers Cloudinary ou Vercel Blob
7. **Multilingual admin** — Traduire l'interface admin (EN/FR)

---

## Troubleshooting

### Admin login affiche 401

- ✅ Vérifier `ADMIN_SECRET` dans `.env.local` ET Netlify
- ✅ La valeur doit être EXACTE (sensible à la casse)
- ✅ Tester localement d'abord

### Produits ne s'affichent pas en boutique

- ✅ Vérifier `AIRTABLE_API_KEY` et `AIRTABLE_BASE_ID`
- ✅ Vérifier que table "Products" existe dans Airtable
- ✅ Cocher "Featured" sur au moins un produit
- ✅ Vérifier `Status ≠ "Archived"` et `Draft ≠ true`

### Erreur 429 au login

- C'est le rate limiting (correct!)
- Attendre 15 minutes avant de réessayer

### Images ne chargent pas

- ✅ Vérifier URLs d'images (http/https?)
- ✅ Images dans Airtable doivent être URLs (pas attachements)
- ✅ Vérifier CORS si URLs externes

### Webhook Stripe n'est pas appelé

- ✅ Endpoint `/api/webhooks/stripe` doit être accessible publiquement
- ✅ Vérifier `STRIPE_WEBHOOK_SECRET` dans Netlify
- ✅ Tester avec Stripe CLI : `stripe listen --forward-to localhost:3000/api/webhooks/stripe`

---

## Contact & Docs

- Airtable API docs: https://airtable.com/api
- Stripe API docs: https://stripe.com/docs/api
- Next.js Route Handlers: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
- Rate Limiting patterns: https://nextjs.org/docs/app/building-your-application/routing/middleware
