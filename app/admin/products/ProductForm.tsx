"use client"

import { useState, useRef } from "react"

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export type FormValues = {
  name: string
  slug: string
  tagline: string
  description: string
  features: string
  price: string
  category: string
  imageUrl: string
  featured: boolean
  status: "Draft" | "Active" | "External"
  downloadUrl: string
  buyLinks: string
}

export const FORM_DEFAULTS: FormValues = {
  name: "", slug: "", tagline: "", description: "", features: "",
  price: "", category: "", imageUrl: "", featured: false, status: "Draft", downloadUrl: "", buyLinks: "",
}

const STATUS_OPTIONS: { value: FormValues["status"]; label: string; desc: string }[] = [
  { value: "Draft",    label: "Draft",    desc: "— saved to Airtable, hidden from shop" },
  { value: "Active",   label: "Stripe",   desc: "— creates product + payment link in Stripe automatically" },
  { value: "External", label: "External", desc: "— live in shop, uses Buy Links only, nothing in Stripe" },
]

type Props = {
  initial?: Partial<FormValues>
  onSubmit: (values: FormValues) => Promise<{ error?: string }>
  submitLabel?: string
}

export function ProductForm({ initial, onSubmit, submitLabel = "Save →" }: Props) {
  const [form, setForm] = useState<FormValues>({ ...FORM_DEFAULTS, ...initial })
  const [slugEdited, setSlugEdited] = useState(!!initial?.slug)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  function handleName(name: string) {
    setForm(prev => ({ ...prev, name, slug: slugEdited ? prev.slug : slugify(name) }))
  }

  function set<K extends keyof FormValues>(key: K, value: FormValues[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", "products")
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      const data = await res.json() as { url?: string; error?: string }
      if (data.url) set("imageUrl", data.url)
    } catch { /* silent */ }
    setUploading(false)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = await onSubmit(form)
    setLoading(false)
    if (result.error) setError(result.error)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">Name *</label>
          <input className="input w-full mt-1" value={form.name}
            onChange={e => handleName(e.target.value)} required placeholder="FreelanceOS Template" />
        </div>
        <div>
          <label className="label">Slug *</label>
          <input className="input w-full mt-1" value={form.slug}
            onChange={e => { setSlugEdited(true); set("slug", e.target.value) }}
            required placeholder="freelanceos-template" />
        </div>
      </div>

      <div>
        <label className="label">Tagline *</label>
        <input className="input w-full mt-1" value={form.tagline}
          onChange={e => set("tagline", e.target.value)} required
          placeholder="The Notion template for freelancers" />
      </div>

      <div>
        <label className="label">Description</label>
        <textarea className="input w-full mt-1 min-h-[100px] resize-y" value={form.description}
          onChange={e => set("description", e.target.value)}
          placeholder="Full description shown in the shop..." />
      </div>

      <div>
        <label className="label">Stripe Features</label>
        <textarea className="input w-full mt-1 min-h-[80px] resize-y" value={form.features}
          onChange={e => set("features", e.target.value)}
          placeholder={"Instant download after purchase\nLifetime updates included\nWorks with Webflow, Framer & more"} />
        <p className="text-text-tertiary text-xs mt-1">
          One feature per line — displayed as a bullet list on the Stripe checkout page.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">Price (EUR) *</label>
          <input type="number" min="1" step="1" className="input w-full mt-1"
            value={form.price} onChange={e => set("price", e.target.value)} required placeholder="29" />
        </div>
        <div>
          <label className="label">Category</label>
          <input className="input w-full mt-1" value={form.category}
            onChange={e => set("category", e.target.value)} placeholder="Template, Tool, Guide..." />
        </div>
      </div>

      {/* Image */}
      <div>
        <div className="flex items-baseline justify-between mb-1">
          <label className="label">Product image</label>
          <span className="text-text-tertiary text-xs">Recommended: 1200×630px — auto-resized on upload</span>
        </div>
        {form.imageUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.imageUrl} alt="Preview"
              className="w-full aspect-video object-cover rounded-lg border border-bg-border" />
            <button type="button"
              onClick={() => { set("imageUrl", ""); if (fileRef.current) fileRef.current.value = "" }}
              className="absolute top-2 right-2 bg-bg-base/80 backdrop-blur-sm text-text-secondary hover:text-red-400 px-2 py-1 rounded text-xs border border-bg-border transition-colors">
              ✕ Remove
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="w-full aspect-video border-2 border-dashed border-bg-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-accent/40 transition-colors cursor-pointer bg-bg-elevated/30">
            {uploading
              ? <span className="text-text-secondary text-sm">Uploading...</span>
              : <>
                <span className="text-2xl">🖼️</span>
                <span className="text-text-secondary text-sm">Click to upload an image</span>
                <span className="text-text-tertiary text-xs">PNG, JPG, WebP · max 10MB</span>
              </>
            }
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      {/* Deliverable URL */}
      <div>
        <label className="label">Download URL</label>
        <div className="flex gap-2 mt-1">
          <input className="input flex-1" value={form.downloadUrl}
            onChange={e => set("downloadUrl", e.target.value)}
            placeholder="https://notion.so/... ou https://drive.google.com/..." />
          {form.downloadUrl && (
            <a href={form.downloadUrl} target="_blank" rel="noopener noreferrer"
              className="btn-secondary text-xs px-3 flex items-center">
              Test ↗
            </a>
          )}
        </div>
        <p className="text-text-tertiary text-xs mt-1">
          Lien envoyé automatiquement au client après achat. Notion, Google Drive, Gumroad…
        </p>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={form.featured}
          onChange={e => set("featured", e.target.checked)} className="w-4 h-4 accent-accent" />
        <span className="text-text-secondary text-sm">Featured (shown first)</span>
      </label>

      {/* Buy Links */}
      <div>
        <label className="label">Buy Links</label>
        <textarea className="input w-full mt-1 min-h-[80px] resize-y font-mono text-xs" value={form.buyLinks}
          onChange={e => set("buyLinks", e.target.value)}
          placeholder={"Webflow Marketplace|https://webflow.com/...\nEtsy|https://etsy.com/...\nhttps://gumroad.com/..."} />
        <p className="text-text-tertiary text-xs mt-1">
          One link per line. Format: <code className="text-accent">Label|URL</code> or plain URL (label auto-detected from domain). Shown as CTA buttons on the product page.
        </p>
      </div>

      {/* Status */}
      <div className="card flex flex-col gap-3">
        <p className="text-text-secondary text-xs font-medium tracking-wider uppercase">Status</p>
        <div className="flex flex-col gap-2">
          {STATUS_OPTIONS.map(({ value, label, desc }) => (
            <label key={value} className="flex items-start gap-3 cursor-pointer">
              <input type="radio" name="status" value={value} checked={form.status === value}
                onChange={() => set("status", value)} className="accent-accent mt-0.5" />
              <span className="text-sm">
                <span className="font-medium text-text-primary">{label}</span>
                <span className="text-text-secondary ml-2">{desc}</span>
              </span>
            </label>
          ))}
        </div>
      </div>

      {error && (
        <div className="card" style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="pt-2">
        <button type="submit" className="btn-primary" disabled={loading || uploading}>
          {loading ? (form.status === "Active" ? "Creating in Stripe..." : "Saving...") : submitLabel}
        </button>
      </div>
    </form>
  )
}
