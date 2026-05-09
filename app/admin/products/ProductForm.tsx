"use client"

import { useState, useRef, useCallback } from "react"

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

export type FormValues = {
  name: string
  slug: string
  tagline: string
  description: string
  price: string
  category: string
  imageUrl: string
  featured: boolean
  status: "Draft" | "Active"
  downloadUrl: string
  buyLinks: string
}

export const FORM_DEFAULTS: FormValues = {
  name: "", slug: "", tagline: "", description: "",
  price: "", category: "", imageUrl: "", featured: false, status: "Draft", downloadUrl: "", buyLinks: "",
}

type Props = {
  initial?: Partial<FormValues>
  onSubmit: (values: FormValues) => Promise<{ error?: string }>
  submitLabel?: string
}

export function ProductForm({ initial, onSubmit, submitLabel = "Save →" }: Props) {
  const [form, setForm] = useState<FormValues>({ ...FORM_DEFAULTS, ...initial })
  const [slugEdited, setSlugEdited] = useState(!!initial?.slug)
  const [uploading, setUploading] = useState(false)
  const [uploadingFile, setUploadingFile] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)
  const deliverableRef = useRef<HTMLInputElement>(null)

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
    const fd = new FormData()
    fd.append("file", file)
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    if (res.ok) {
      const { url } = await res.json() as { url: string }
      set("imageUrl", url)
    }
    setUploading(false)
  }

  const handleDeliverable = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingFile(true)
    const fd = new FormData()
    fd.append("file", file)
    fd.append("deliverable", "true")
    const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
    if (res.ok) {
      const { url } = await res.json() as { url: string }
      set("downloadUrl", url)
    }
    setUploadingFile(false)
  }, [])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError("")
    const result = await onSubmit(form)
    if (result.error) { setError(result.error); setLoading(false) }
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

      {/* Deliverable file */}
      <div>
        <label className="label">Deliverable file</label>
        <p className="text-text-tertiary text-xs mb-2">
          Sent automatically to the customer after purchase. ZIP, PDF, any format.
        </p>
        {form.downloadUrl ? (
          <div className="card flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
              <span className="text-xl">📦</span>
              <span className="text-text-secondary text-sm truncate">{form.downloadUrl.split("/").pop()}</span>
            </div>
            <button type="button"
              onClick={() => { set("downloadUrl", ""); if (deliverableRef.current) deliverableRef.current.value = "" }}
              className="text-text-tertiary hover:text-red-400 text-xs transition-colors flex-shrink-0">
              ✕ Remove
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => deliverableRef.current?.click()} disabled={uploadingFile}
            className="w-full py-6 border-2 border-dashed border-bg-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-accent/40 transition-colors cursor-pointer bg-bg-elevated/30">
            {uploadingFile
              ? <span className="text-text-secondary text-sm">Uploading file...</span>
              : <>
                <span className="text-2xl">📦</span>
                <span className="text-text-secondary text-sm">Click to upload the deliverable</span>
                <span className="text-text-tertiary text-xs">ZIP, PDF, any format</span>
              </>
            }
          </button>
        )}
        <input ref={deliverableRef} type="file" className="hidden" onChange={handleDeliverable} />
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
          {(["Draft", "Active"] as const).map(s => (
            <label key={s} className="flex items-start gap-3 cursor-pointer">
              <input type="radio" name="status" value={s} checked={form.status === s}
                onChange={() => set("status", s)} className="accent-accent mt-0.5" />
              <span className="text-sm">
                <span className="font-medium text-text-primary">{s === "Draft" ? "Draft" : "Publish"}</span>
                <span className="text-text-secondary ml-2">
                  {s === "Draft" ? "— saves to Airtable only" : "— creates product + payment link in Stripe automatically"}
                </span>
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
        <button type="submit" className="btn-primary" disabled={loading || uploading || uploadingFile}>
          {loading ? (form.status === "Active" ? "Creating in Stripe..." : "Saving...") : submitLabel}
        </button>
      </div>
    </form>
  )
}
