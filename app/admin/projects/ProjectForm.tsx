"use client"

import { useState, useRef } from "react"
import { useUploadThing } from "@/lib/uploadthing"

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

const STATUS_OPTIONS = ["Building", "Beta", "Live", "Paused", "Archived"]
const TYPE_OPTIONS = ["SaaS", "Tool", "App", "Template", "Website", "Other"]

export type ProjectFormValues = {
  name: string; slug: string; tagline: string; description: string
  status: string; type: string; url: string; imageUrl: string
  featured: boolean; mrr: string; users: string; started: string
}

export const PROJECT_FORM_DEFAULTS: ProjectFormValues = {
  name: "", slug: "", tagline: "", description: "", status: "Building",
  type: "", url: "", imageUrl: "", featured: false, mrr: "", users: "", started: "",
}

type Props = {
  initial?: Partial<ProjectFormValues>
  onSubmit: (values: ProjectFormValues) => Promise<{ error?: string }>
  submitLabel?: string
  uploadFolder?: string
}

export function ProjectForm({ initial, onSubmit, submitLabel = "Save →", uploadFolder = "projects" }: Props) {
  const [form, setForm] = useState<ProjectFormValues>({ ...PROJECT_FORM_DEFAULTS, ...initial })
  const [slugEdited, setSlugEdited] = useState(!!initial?.slug)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  const { startUpload, isUploading } = useUploadThing("projectImage", {
    onClientUploadComplete: (res) => { if (res?.[0]?.url) set("imageUrl", res[0].url) },
  })

  function handleName(name: string) {
    setForm(prev => ({ ...prev, name, slug: slugEdited ? prev.slug : slugify(name) }))
  }

  function set<K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    await startUpload([file])
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
            onChange={e => handleName(e.target.value)} required placeholder="FreelanceOS" />
        </div>
        <div>
          <label className="label">Slug *</label>
          <input className="input w-full mt-1" value={form.slug}
            onChange={e => { setSlugEdited(true); set("slug", e.target.value) }}
            required placeholder="freelanceos" />
        </div>
      </div>

      <div>
        <label className="label">Tagline *</label>
        <input className="input w-full mt-1" value={form.tagline}
          onChange={e => set("tagline", e.target.value)} required
          placeholder="The OS for freelancers" />
      </div>

      <div>
        <label className="label">Description</label>
        <textarea className="input w-full mt-1 min-h-[100px] resize-y" value={form.description}
          onChange={e => set("description", e.target.value)} />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="label">Status</label>
          <select className="input w-full mt-1" value={form.status}
            onChange={e => set("status", e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Type</label>
          <select className="input w-full mt-1" value={form.type}
            onChange={e => set("type", e.target.value)}>
            <option value="">—</option>
            {TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Start date</label>
          <input type="date" className="input w-full mt-1" value={form.started}
            onChange={e => set("started", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="label">URL</label>
        <input className="input w-full mt-1" value={form.url}
          onChange={e => set("url", e.target.value)} placeholder="https://..." />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">MRR (€)</label>
          <input type="number" min="0" className="input w-full mt-1" value={form.mrr}
            onChange={e => set("mrr", e.target.value)} placeholder="0" />
        </div>
        <div>
          <label className="label">Users</label>
          <input type="number" min="0" className="input w-full mt-1" value={form.users}
            onChange={e => set("users", e.target.value)} placeholder="0" />
        </div>
      </div>

      {/* Image */}
      <div>
        <div className="flex items-baseline justify-between mb-1">
          <label className="label">Image / Screenshot</label>
          <span className="text-text-tertiary text-xs">Recommended: 1280×720px (16:9) — auto-resized on upload</span>
        </div>
        <div className="mt-0">
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
            <button type="button" onClick={() => fileRef.current?.click()} disabled={isUploading}
              className="w-full aspect-video border-2 border-dashed border-bg-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-accent/40 transition-colors cursor-pointer bg-bg-elevated/30">
              {isUploading
                ? <span className="text-text-secondary text-sm">Uploading...</span>
                : <>
                  <span className="text-2xl">🖼️</span>
                  <span className="text-text-secondary text-sm">Click to upload a screenshot</span>
                  <span className="text-text-tertiary text-xs">PNG, JPG, WebP</span>
                </>
              }
            </button>
          )}
          <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
        </div>
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={form.featured}
          onChange={e => set("featured", e.target.checked)} className="w-4 h-4 accent-accent" />
        <span className="text-text-secondary text-sm">Featured (shown first)</span>
      </label>

      {error && (
        <div className="card" style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="pt-2">
        <button type="submit" className="btn-primary" disabled={loading || isUploading}>
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  )
}
