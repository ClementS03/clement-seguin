"use client"

import { useState, useRef } from "react"
import dynamic from "next/dynamic"

const MDEditor = dynamic(() => import("@uiw/react-md-editor"), { ssr: false })

function slugify(str: string) {
  return str.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")
}

const STATUS_OPTIONS = ["Building", "Beta", "Live", "Paused", "Archived"]
const TYPE_OPTIONS = ["SaaS", "Tool", "App", "Template", "Website", "Other"]

export type ProjectFormValues = {
  name: string; slug: string; tagline: string; description: string
  status: string; type: string; url: string; imageUrl: string
  featured: boolean; mrr: string; users: string; started: string
  gallery: string; videoUrl: string
  metric1Label: string; metric1Value: string
  metric2Label: string; metric2Value: string
  metric3Label: string; metric3Value: string
  metric4Label: string; metric4Value: string
}

export const PROJECT_FORM_DEFAULTS: ProjectFormValues = {
  name: "", slug: "", tagline: "", description: "", status: "Building",
  type: "", url: "", imageUrl: "", featured: false, mrr: "", users: "", started: "",
  gallery: "", videoUrl: "",
  metric1Label: "", metric1Value: "", metric2Label: "", metric2Value: "",
  metric3Label: "", metric3Value: "", metric4Label: "", metric4Value: "",
}

export function metricsToString(form: ProjectFormValues): string {
  return [
    form.metric1Label && form.metric1Value ? `${form.metric1Label}|${form.metric1Value}` : "",
    form.metric2Label && form.metric2Value ? `${form.metric2Label}|${form.metric2Value}` : "",
    form.metric3Label && form.metric3Value ? `${form.metric3Label}|${form.metric3Value}` : "",
    form.metric4Label && form.metric4Value ? `${form.metric4Label}|${form.metric4Value}` : "",
  ].filter(Boolean).join("\n")
}

export function metricsFromString(raw: string): Partial<ProjectFormValues> {
  const lines = raw.split("\n").map(l => l.trim()).filter(Boolean)
  const get = (i: number) => {
    const line = lines[i] ?? ""
    const idx = line.indexOf("|")
    if (idx < 0) return { label: "", value: "" }
    return { label: line.slice(0, idx).trim(), value: line.slice(idx + 1).trim() }
  }
  const m1 = get(0); const m2 = get(1); const m3 = get(2); const m4 = get(3)
  return {
    metric1Label: m1.label, metric1Value: m1.value,
    metric2Label: m2.label, metric2Value: m2.value,
    metric3Label: m3.label, metric3Value: m3.value,
    metric4Label: m4.label, metric4Value: m4.value,
  }
}

type Props = {
  initial?: Partial<ProjectFormValues>
  onSubmit: (values: ProjectFormValues) => Promise<{ error?: string }>
  submitLabel?: string
  uploadFolder?: string
}

export function ProjectForm({ initial, onSubmit, submitLabel = "Save ->", uploadFolder = "projects" }: Props) {
  const [form, setForm] = useState<ProjectFormValues>({ ...PROJECT_FORM_DEFAULTS, ...initial })
  const [slugEdited, setSlugEdited] = useState(!!initial?.slug)
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const fileRef = useRef<HTMLInputElement>(null)

  function handleName(name: string) {
    setForm(prev => ({ ...prev, name, slug: slugEdited ? prev.slug : slugify(name) }))
  }

  function set<K extends keyof ProjectFormValues>(key: K, value: ProjectFormValues[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append("file", file)
      fd.append("folder", uploadFolder)
      const res = await fetch("/api/admin/upload", { method: "POST", body: fd })
      const data = await res.json() as { url?: string }
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
          onChange={e => set("tagline", e.target.value)} required placeholder="The OS for freelancers" />
      </div>

      <div>
        <label className="label">Description</label>
        <p className="text-text-tertiary text-xs mb-2">Supports Markdown — headings, bold, lists, links…</p>
        <div data-color-mode="dark">
          <MDEditor value={form.description} onChange={v => set("description", v ?? "")} height={300} preview="live" />
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div>
          <label className="label">Status</label>
          <select className="input w-full mt-1" value={form.status} onChange={e => set("status", e.target.value)}>
            {STATUS_OPTIONS.map(s => <option key={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Type</label>
          <select className="input w-full mt-1" value={form.type} onChange={e => set("type", e.target.value)}>
            <option value="">—</option>
            {TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
          </select>
        </div>
        <div>
          <label className="label">Start date</label>
          <input type="date" className="input w-full mt-1" value={form.started} onChange={e => set("started", e.target.value)} />
        </div>
      </div>

      <div>
        <label className="label">URL</label>
        <input className="input w-full mt-1" value={form.url} onChange={e => set("url", e.target.value)} placeholder="https://..." />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label className="label">MRR (€)</label>
          <input type="number" min="0" className="input w-full mt-1" value={form.mrr} onChange={e => set("mrr", e.target.value)} placeholder="0" />
        </div>
        <div>
          <label className="label">Users</label>
          <input type="number" min="0" className="input w-full mt-1" value={form.users} onChange={e => set("users", e.target.value)} placeholder="0" />
        </div>
      </div>

      <div className="card flex flex-col gap-3">
        <p className="text-text-secondary text-xs font-medium tracking-wider uppercase">Results / Metrics</p>
        <p className="text-text-tertiary text-xs">Up to 4 custom metrics — leave empty to hide the section.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {([1, 2, 3, 4] as const).map(n => {
            const lKey = `metric${n}Label` as keyof ProjectFormValues
            const vKey = `metric${n}Value` as keyof ProjectFormValues
            return (
              <div key={n} className="grid grid-cols-2 gap-2">
                <input className="input text-sm" placeholder="Label (e.g. Traffic)"
                  value={form[lKey] as string}
                  onChange={e => set(lKey, e.target.value)} />
                <input className="input text-sm" placeholder="Value (e.g. +40%)"
                  value={form[vKey] as string}
                  onChange={e => set(vKey, e.target.value)} />
              </div>
            )
          })}
        </div>
      </div>

      <div>
        <div className="flex items-baseline justify-between mb-1">
          <label className="label">Hero image</label>
          <span className="text-text-tertiary text-xs">1280x720px recommended</span>
        </div>
        {form.imageUrl ? (
          <div className="relative">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={form.imageUrl} alt="Preview" className="w-full aspect-video object-cover rounded-lg border border-bg-border" />
            <button type="button" onClick={() => { set("imageUrl", ""); if (fileRef.current) fileRef.current.value = "" }}
              className="absolute top-2 right-2 bg-bg-base/80 backdrop-blur-sm text-text-secondary hover:text-red-400 px-2 py-1 rounded text-xs border border-bg-border transition-colors">
              Remove
            </button>
          </div>
        ) : (
          <button type="button" onClick={() => fileRef.current?.click()} disabled={uploading}
            className="w-full aspect-video border-2 border-dashed border-bg-border rounded-lg flex flex-col items-center justify-center gap-2 hover:border-accent/40 transition-colors cursor-pointer bg-bg-elevated/30">
            {uploading ? <span className="text-text-secondary text-sm">Uploading...</span>
              : <><span className="text-2xl">Image</span><span className="text-text-secondary text-sm">Click to upload a screenshot</span></>}
          </button>
        )}
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
      </div>

      <div>
        <label className="label">Gallery</label>
        <textarea className="input w-full mt-1 min-h-[80px] resize-y font-mono text-xs" value={form.gallery}
          onChange={e => set("gallery", e.target.value)} placeholder={"https://...\nhttps://..."} />
        <p className="text-text-tertiary text-xs mt-1">One image URL per line — shown in the lightbox on the detail page.</p>
      </div>

      <div>
        <label className="label">Video URL</label>
        <input className="input w-full mt-1" value={form.videoUrl} onChange={e => set("videoUrl", e.target.value)}
          placeholder="https://youtube.com/... or https://vimeo.com/..." />
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input type="checkbox" checked={form.featured} onChange={e => set("featured", e.target.checked)} className="w-4 h-4 accent-accent" />
        <span className="text-text-secondary text-sm">Featured (shown first)</span>
      </label>

      {error && (
        <div className="card" style={{ borderColor: "rgba(239,68,68,0.2)", background: "rgba(239,68,68,0.05)" }}>
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <div className="pt-2">
        <button type="submit" className="btn-primary" disabled={loading || uploading}>
          {loading ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  )
}
