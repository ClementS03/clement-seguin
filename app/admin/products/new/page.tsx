"use client"

import { useState } from "react"
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
        <div className="card flex flex-col gap-3" style={{ borderColor: "rgba(45,158,107,0.2)", background: "rgba(45,158,107,0.05)" }}>
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

        <div className="flex gap-4 flex-wrap">
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
        <h1 className="font-display text-3xl text-text-primary mb-2">Nouveau produit</h1>
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
          <div className="card" style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}>
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
