# Admin + LemonSqueezy Product Sync — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Créer une interface admin protégée par mot de passe qui permet de créer un produit (nom, slug, tagline, prix…) et le publie automatiquement dans LemonSqueezy + Airtable en un clic.

**Architecture:** Middleware Next.js 15 sur `/admin/*` compare un cookie httpOnly à `ADMIN_SECRET`. L'API route `/api/admin/products` appelle l'API LemonSqueezy (créer product → créer variant → extraire checkout URL) puis crée l'enregistrement Airtable avec tous les IDs LS. Pas de Supabase, pas de next-auth — juste fetch + cookies.

**Tech Stack:** Next.js 15 App Router, LemonSqueezy API v1 (JSON:API), Airtable REST API, cookies httpOnly, TypeScript

---

## Fichiers concernés

| Action | Fichier | Responsabilité |
|--------|---------|----------------|
| Create | `middleware.ts` | Protège `/admin/*` sauf `/admin/login` |
| Create | `lib/lemonsqueezy.ts` | Helpers pour l'API LS (create product, variant, URL) |
| Modify | `lib/airtable.ts` | Ajoute `airtableCreateProduct()` |
| Create | `app/api/admin/auth/route.ts` | POST → vérifie password → set cookie |
| Create | `app/api/admin/products/route.ts` | POST → orchestre LS + Airtable |
| Create | `app/admin/login/page.tsx` | Formulaire de connexion (client) |
| Create | `app/admin/layout.tsx` | Layout admin minimaliste |
| Create | `app/admin/page.tsx` | Page d'accueil admin (liens) |
| Create | `app/admin/products/new/page.tsx` | Formulaire création produit (client) |
| Modify | `.env.local` | Nouvelles vars LS + ADMIN_SECRET |
| Modify | `.env.example` | Documenter les nouvelles vars |

---

## Pré-requis Airtable

Avant de coder, ajouter 2 champs dans la table **Products** d'Airtable :
- `LS Product ID` (type: Single line text)
- `LS Variant ID` (type: Single line text)

---

## Task 1 : Variables d'environnement

**Files:**
- Modify: `.env.local`
- Modify: `.env.example`

- [ ] **Step 1 : Ajouter les vars dans `.env.local`**

Ajouter à la fin du fichier (les valeurs viennent du dashboard LemonSqueezy) :
```
# Admin
ADMIN_SECRET=choisir-un-mot-de-passe-fort

# LemonSqueezy
LEMONSQUEEZY_API_KEY=        # Settings → API → ton token
LEMONSQUEEZY_STORE_ID=       # Settings → Stores → ID numérique
LEMONSQUEEZY_STORE_SLUG=     # Settings → Stores → slug (ex: clement-seguin)
```

- [ ] **Step 2 : Mettre à jour `.env.example`**

```
# Admin
ADMIN_SECRET=

# LemonSqueezy
LEMONSQUEEZY_API_KEY=
LEMONSQUEEZY_STORE_ID=
LEMONSQUEEZY_STORE_SLUG=
LEMONSQUEEZY_WEBHOOK_SECRET=
```

- [ ] **Step 3 : Commit**

```bash
git add .env.example
git commit -m "chore: add admin + lemonsqueezy env vars"
```

---

## Task 2 : Middleware d'authentification admin

**Files:**
- Create: `middleware.ts` (racine du projet)

- [ ] **Step 1 : Créer `middleware.ts`**

```typescript
import { NextRequest, NextResponse } from "next/server"

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === "/admin/login") return NextResponse.next()

  const token = req.cookies.get("admin_token")?.value
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.redirect(new URL("/admin/login", req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
```

- [ ] **Step 2 : Vérifier le build**

```bash
cd "C:/Users/cleme/Downloads/Projets web/clement-seguin"
npx tsc --noEmit
```

Expected: aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add middleware.ts
git commit -m "feat: add admin auth middleware"
```

---

## Task 3 : API route d'authentification

**Files:**
- Create: `app/api/admin/auth/route.ts`

- [ ] **Step 1 : Créer la route**

```typescript
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const { password } = await req.json() as { password: string }

  if (!password || password !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set("admin_token", process.env.ADMIN_SECRET!, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 7, // 7 jours
    path: "/",
  })
  return res
}
```

- [ ] **Step 2 : Vérifier le build**

```bash
npx tsc --noEmit
```

Expected: aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add app/api/admin/auth/route.ts
git commit -m "feat: add admin auth API route"
```

---

## Task 4 : Page de connexion admin

**Files:**
- Create: `app/admin/login/page.tsx`

- [ ] **Step 1 : Créer la page login**

```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import type { Metadata } from "next"

export default function AdminLoginPage() {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    })

    if (res.ok) {
      router.push("/admin")
    } else {
      setError("Mot de passe incorrect.")
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-bg-base flex items-center justify-center">
      <div className="w-full max-w-sm px-6">
        <h1 className="font-display text-3xl text-text-primary mb-8 text-center">
          Admin
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="label">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input w-full mt-1"
              autoFocus
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "..." : "Sign in →"}
          </button>
        </form>
      </div>
    </main>
  )
}
```

- [ ] **Step 2 : Tester manuellement**

```bash
npm run dev
```

Aller sur `http://localhost:3000/admin` → doit rediriger vers `/admin/login`.
Entrer un mauvais mot de passe → "Mot de passe incorrect."
Entrer `ADMIN_SECRET` du `.env.local` → redirige vers `/admin` (page 404 pour l'instant, normal).

- [ ] **Step 3 : Commit**

```bash
git add app/admin/login/page.tsx
git commit -m "feat: add admin login page"
```

---

## Task 5 : Layout et page d'accueil admin

**Files:**
- Create: `app/admin/layout.tsx`
- Create: `app/admin/page.tsx`

- [ ] **Step 1 : Créer `app/admin/layout.tsx`**

```typescript
import type { ReactNode } from "react"
import Link from "next/link"

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-bg-base">
      <header className="border-b border-bg-border px-6 py-4 flex items-center gap-4">
        <Link href="/" className="text-accent font-semibold text-sm">
          CS
        </Link>
        <span className="text-text-tertiary">/</span>
        <Link href="/admin" className="text-text-secondary text-sm hover:text-text-primary transition-colors">
          Admin
        </Link>
      </header>
      <main className="max-w-3xl mx-auto px-6 py-12">{children}</main>
    </div>
  )
}
```

- [ ] **Step 2 : Créer `app/admin/page.tsx`**

```typescript
import Link from "next/link"

export default function AdminPage() {
  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl text-text-primary mb-2">Admin</h1>
        <p className="text-text-secondary text-sm">Gestion des produits.</p>
      </div>

      <div className="grid gap-4">
        <Link
          href="/admin/products/new"
          className="card card-hover flex items-center justify-between group"
        >
          <div>
            <h2 className="text-text-primary font-medium">Nouveau produit</h2>
            <p className="text-text-secondary text-sm mt-1">
              Créer dans LemonSqueezy + Airtable
            </p>
          </div>
          <span className="text-accent group-hover:translate-x-1 transition-transform">→</span>
        </Link>
      </div>
    </div>
  )
}
```

- [ ] **Step 3 : Vérifier**

```bash
npm run dev
```

Aller sur `http://localhost:3000/admin` (connecté) → page admin visible avec le lien.

- [ ] **Step 4 : Commit**

```bash
git add app/admin/layout.tsx app/admin/page.tsx
git commit -m "feat: add admin layout and home page"
```

---

## Task 6 : Helpers LemonSqueezy

**Files:**
- Create: `lib/lemonsqueezy.ts`

- [ ] **Step 1 : Créer `lib/lemonsqueezy.ts`**

```typescript
const LS_BASE = "https://api.lemonsqueezy.com/v1"

function lsHeaders(): HeadersInit {
  return {
    Accept: "application/vnd.api+json",
    "Content-Type": "application/vnd.api+json",
    Authorization: `Bearer ${process.env.LEMONSQUEEZY_API_KEY}`,
  }
}

type LSError = { detail: string }
type LSResponse<T> = { data: T; errors?: LSError[] }

async function lsFetch<T>(path: string, body: unknown): Promise<T> {
  const res = await fetch(`${LS_BASE}${path}`, {
    method: "POST",
    headers: lsHeaders(),
    body: JSON.stringify(body),
  })
  const json: LSResponse<T> = await res.json()
  if (!res.ok || json.errors?.length) {
    throw new Error(json.errors?.[0]?.detail ?? `LS API error on ${path}`)
  }
  return json.data
}

export async function lsCreateProduct(
  name: string,
  description: string
): Promise<string> {
  const data = await lsFetch<{ id: string }>("/products", {
    data: {
      type: "products",
      attributes: { name, description },
      relationships: {
        store: {
          data: {
            type: "stores",
            id: String(process.env.LEMONSQUEEZY_STORE_ID),
          },
        },
      },
    },
  })
  return data.id
}

export async function lsCreateVariant(
  productId: string,
  priceEur: number
): Promise<string> {
  const data = await lsFetch<{ id: string }>("/variants", {
    data: {
      type: "variants",
      attributes: {
        name: "Default",
        price: Math.round(priceEur * 100), // LS uses cents
        is_subscription: false,
        pay_what_you_want: false,
      },
      relationships: {
        product: {
          data: { type: "products", id: productId },
        },
      },
    },
  })
  return data.id
}

export function lsCheckoutUrl(variantId: string): string {
  const slug = process.env.LEMONSQUEEZY_STORE_SLUG
  return `https://${slug}.lemonsqueezy.com/checkout/buy/${variantId}`
}
```

- [ ] **Step 2 : Vérifier le build**

```bash
npx tsc --noEmit
```

Expected: aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add lib/lemonsqueezy.ts
git commit -m "feat: add lemonsqueezy API helpers"
```

---

## Task 7 : Écriture dans Airtable

**Files:**
- Modify: `lib/airtable.ts`

- [ ] **Step 1 : Ajouter le type `NewProduct` et la fonction `airtableCreateProduct`**

Ajouter à la fin de `lib/airtable.ts` (après les fonctions existantes) :

```typescript
export type NewProduct = {
  name: string
  slug: string
  tagline: string
  description: string
  price: number
  category: string
  imageUrl: string
  featured: boolean
  lsProductId: string
  lsVariantId: string
  buyUrl: string
}

export async function airtableCreateProduct(p: NewProduct): Promise<Product> {
  if (!API_KEY || !BASE_ID) throw new Error("Airtable credentials missing")

  const res = await fetch(
    `https://api.airtable.com/v0/${BASE_ID}/${encodeURIComponent("Products")}`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        fields: {
          Name: p.name,
          Slug: p.slug,
          Tagline: p.tagline,
          Description: p.description,
          Price: p.price,
          Category: p.category,
          Status: "Active",
          "Buy URL": p.buyUrl,
          ...(p.imageUrl && { "Image URL": p.imageUrl }),
          Featured: p.featured,
          "LS Product ID": p.lsProductId,
          "LS Variant ID": p.lsVariantId,
        },
      }),
    }
  )

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Airtable create failed: ${err}`)
  }

  const record: AirtableRecord = await res.json()
  return toProduct(record)
}
```

- [ ] **Step 2 : Vérifier le build**

```bash
npx tsc --noEmit
```

Expected: aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add lib/airtable.ts
git commit -m "feat: add airtableCreateProduct write function"
```

---

## Task 8 : API route de création produit

**Files:**
- Create: `app/api/admin/products/route.ts`

- [ ] **Step 1 : Créer la route**

```typescript
import { NextRequest, NextResponse } from "next/server"
import { lsCreateProduct, lsCreateVariant, lsCheckoutUrl } from "@/lib/lemonsqueezy"
import { airtableCreateProduct } from "@/lib/airtable"

type ProductPayload = {
  name: string
  slug: string
  tagline: string
  description?: string
  price: number
  category?: string
  imageUrl?: string
  featured?: boolean
}

export async function POST(req: NextRequest) {
  const token = req.cookies.get("admin_token")?.value
  if (!token || token !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await req.json() as ProductPayload
  const { name, slug, tagline, description = "", price, category = "", imageUrl = "", featured = false } = body

  if (!name || !slug || !tagline || !price || price <= 0) {
    return NextResponse.json({ error: "Champs requis manquants ou prix invalide." }, { status: 400 })
  }

  try {
    // 1. LemonSqueezy : créer le produit
    const lsProductId = await lsCreateProduct(name, description)

    // 2. LemonSqueezy : créer le variant (prix)
    const lsVariantId = await lsCreateVariant(lsProductId, price)

    // 3. Construire l'URL de checkout
    const buyUrl = lsCheckoutUrl(lsVariantId)

    // 4. Créer l'enregistrement Airtable
    const product = await airtableCreateProduct({
      name,
      slug,
      tagline,
      description,
      price,
      category,
      imageUrl,
      featured,
      lsProductId,
      lsVariantId,
      buyUrl,
    })

    return NextResponse.json({ success: true, product, buyUrl })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Erreur inconnue"
    console.error("[admin/products]", err)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
```

- [ ] **Step 2 : Vérifier le build**

```bash
npx tsc --noEmit
```

Expected: aucune erreur.

- [ ] **Step 3 : Commit**

```bash
git add app/api/admin/products/route.ts
git commit -m "feat: add admin product creation API (LS + Airtable)"
```

---

## Task 9 : Formulaire de création produit

**Files:**
- Create: `app/admin/products/new/page.tsx`

- [ ] **Step 1 : Créer la page**

```typescript
"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"

function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
}

type FormState = {
  name: string
  slug: string
  slugEdited: boolean
  tagline: string
  description: string
  price: string
  category: string
  imageUrl: string
  featured: boolean
}

const INITIAL: FormState = {
  name: "",
  slug: "",
  slugEdited: false,
  tagline: "",
  description: "",
  price: "",
  category: "",
  imageUrl: "",
  featured: false,
}

export default function NewProductPage() {
  const router = useRouter()
  const [form, setForm] = useState<FormState>(INITIAL)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [result, setResult] = useState<{ buyUrl: string } | null>(null)

  function handleName(name: string) {
    setForm((prev) => ({
      ...prev,
      name,
      slug: prev.slugEdited ? prev.slug : slugify(name),
    }))
  }

  function handleSlug(slug: string) {
    setForm((prev) => ({ ...prev, slug, slugEdited: true }))
  }

  function set<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")

    const res = await fetch("/api/admin/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        slug: form.slug,
        tagline: form.tagline,
        description: form.description,
        price: Number(form.price),
        category: form.category,
        imageUrl: form.imageUrl,
        featured: form.featured,
      }),
    })

    const data = await res.json()

    if (res.ok) {
      setResult({ buyUrl: data.buyUrl })
    } else {
      setError(data.error ?? "Une erreur s'est produite.")
    }
    setLoading(false)
  }

  if (result) {
    return (
      <div className="flex flex-col gap-6">
        <div className="card border-accent/20 bg-accent/5 flex flex-col gap-3">
          <h2 className="text-text-primary font-medium">Produit créé ✓</h2>
          <p className="text-text-secondary text-sm">
            LemonSqueezy + Airtable mis à jour. URL de checkout :
          </p>
          <a
            href={result.buyUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent text-sm break-all hover:underline"
          >
            {result.buyUrl}
          </a>
          <p className="text-text-tertiary text-xs">
            Prochaine étape : ouvre LemonSqueezy et attache le fichier livrable au variant.
          </p>
        </div>

        <div className="flex gap-4">
          <Link href="/boutique" className="btn-primary">
            Voir la boutique →
          </Link>
          <button
            onClick={() => { setResult(null); setForm(INITIAL) }}
            className="btn-secondary"
          >
            Créer un autre produit
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl text-text-primary mb-2">
          Nouveau produit
        </h1>
        <p className="text-text-secondary text-sm">
          Publie automatiquement sur LemonSqueezy et Airtable.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Nom *</label>
            <input
              className="input w-full mt-1"
              value={form.name}
              onChange={(e) => handleName(e.target.value)}
              required
              placeholder="FreelanceOS Template"
            />
          </div>

          <div>
            <label className="label">Slug *</label>
            <input
              className="input w-full mt-1"
              value={form.slug}
              onChange={(e) => handleSlug(e.target.value)}
              required
              placeholder="freelanceos-template"
            />
          </div>
        </div>

        <div>
          <label className="label">Tagline *</label>
          <input
            className="input w-full mt-1"
            value={form.tagline}
            onChange={(e) => set("tagline", e.target.value)}
            required
            placeholder="The Notion template for freelancers"
          />
        </div>

        <div>
          <label className="label">Description</label>
          <textarea
            className="input w-full mt-1 min-h-[100px] resize-y"
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Description complète affichée dans la boutique..."
          />
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="label">Prix (EUR) *</label>
            <input
              type="number"
              min="1"
              step="1"
              className="input w-full mt-1"
              value={form.price}
              onChange={(e) => set("price", e.target.value)}
              required
              placeholder="29"
            />
          </div>

          <div>
            <label className="label">Catégorie</label>
            <input
              className="input w-full mt-1"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              placeholder="Template, Tool, Guide..."
            />
          </div>
        </div>

        <div>
          <label className="label">Image URL</label>
          <input
            className="input w-full mt-1"
            value={form.imageUrl}
            onChange={(e) => set("imageUrl", e.target.value)}
            placeholder="https://..."
          />
        </div>

        <label className="flex items-center gap-3 cursor-pointer">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) => set("featured", e.target.checked)}
            className="w-4 h-4 accent-accent"
          />
          <span className="text-text-secondary text-sm">
            Featured (affiché en premier dans la boutique)
          </span>
        </label>

        {error && (
          <div className="card border-red-500/20 bg-red-500/5">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex items-center gap-4 pt-2">
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Création en cours..." : "Créer le produit →"}
          </button>
          <Link href="/admin" className="text-text-secondary text-sm hover:text-text-primary">
            Annuler
          </Link>
        </div>
      </form>
    </div>
  )
}
```

- [ ] **Step 2 : Tester le flow complet**

```bash
npm run dev
```

1. Aller sur `http://localhost:3000/admin/products/new`
2. Remplir le formulaire (nom, tagline, prix test = 1)
3. Soumettre → vérifier dans le dashboard LemonSqueezy qu'un produit + variant ont été créés
4. Vérifier dans Airtable qu'un record a été créé avec le bon `Buy URL`, `LS Product ID`, `LS Variant ID`
5. Aller sur `/boutique` → le produit doit apparaître (après revalidation ou dev refresh)

- [ ] **Step 3 : Commit**

```bash
git add app/admin/products/new/page.tsx
git commit -m "feat: add admin new product form"
```

---

## Task 10 : Configurer le webhook dans LemonSqueezy

- [ ] **Step 1 : Dans le dashboard LemonSqueezy**

Settings → Webhooks → Add webhook :
- URL : `https://clement-seguin.fr/api/webhooks/lemonsqueezy`
- Events : `order_created`
- Signing secret : générer et copier

- [ ] **Step 2 : Ajouter le secret dans les env vars**

`.env.local` :
```
LEMONSQUEEZY_WEBHOOK_SECRET=le_secret_copié
```

Et dans Netlify : Site settings → Environment variables → ajouter les 4 vars LS + `ADMIN_SECRET`.

- [ ] **Step 3 : Configurer la thank-you page dans LS**

Pour chaque produit créé : dans LemonSqueezy → Product → Edit → Checkout → "Thank you page URL" :
```
https://clement-seguin.fr/merci
```

- [ ] **Step 4 : Ajouter les champs LS dans Airtable**

Dans la table Products de la base Airtable :
- Ajouter champ `LS Product ID` (Single line text)
- Ajouter champ `LS Variant ID` (Single line text)

- [ ] **Step 5 : Push + vérifier le déploiement Netlify**

```bash
git push
```

Vérifier dans Netlify que le build passe et que les env vars sont bien chargées.

---

## Récapitulatif du flow final

```
Admin (/admin/products/new)
  ↓ POST /api/admin/products
    ↓ LS API: POST /v1/products → lsProductId
    ↓ LS API: POST /v1/variants → lsVariantId
    ↓ URL: https://{slug}.lemonsqueezy.com/checkout/buy/{variantId}
    ↓ Airtable: POST → record créé avec buyUrl + LS IDs
  ↓ Succès: affiche l'URL de checkout

Client (/boutique)
  → clic "Buy now" → buyUrl (checkout LS)
  → paiement → webhook /api/webhooks/lemonsqueezy
  → email Resend avec receipt_url
  → redirect → /merci
```
