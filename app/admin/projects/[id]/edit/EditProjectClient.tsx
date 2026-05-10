"use client"

import { useState } from "react"
import { ProjectForm, type ProjectFormValues, metricsToString, metricsFromString } from "../../ProjectForm"
import type { Project } from "@/lib/airtable"

export function EditProjectClient({ project }: { project: Project }) {
  const [saved, setSaved] = useState(false)

  const metricsRaw = project.metrics.map(m => `${m.label}|${m.value}`).join("\n")
  const initial: ProjectFormValues = {
    name: project.name,
    slug: project.slug,
    tagline: project.tagline,
    description: project.description,
    status: project.status,
    type: project.type,
    url: project.url,
    imageUrl: project.imageUrl ?? "",
    featured: project.featured,
    mrr: project.mrr !== null ? String(project.mrr) : "",
    users: project.users !== null ? String(project.users) : "",
    started: project.started,
    gallery: project.gallery.join("\n"),
    videoUrl: project.videoUrl ?? "",
    metric1Label: "", metric1Value: "", metric2Label: "", metric2Value: "",
    metric3Label: "", metric3Value: "", metric4Label: "", metric4Value: "",
    ...metricsFromString(metricsRaw),
  }

  async function handleSubmit(values: ProjectFormValues) {
    const res = await fetch(`/api/admin/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        mrr: values.mrr ? Number(values.mrr) : null,
        users: values.users ? Number(values.users) : null,
        metrics: metricsToString(values),
      }),
    })
    const data = await res.json() as { error?: string }
    if (res.ok) {
      setSaved(true)
      return {}
    }
    return { error: data.error ?? "Something went wrong." }
  }

  return (
    <div className="flex flex-col gap-6">
      {saved && (
        <div className="card flex items-center gap-2"
          style={{ borderColor: "rgba(45,158,107,0.2)", background: "rgba(45,158,107,0.05)" }}>
          <span className="text-accent">✓</span>
          <p className="text-text-primary text-sm font-medium">Saved</p>
        </div>
      )}
      <ProjectForm initial={initial} onSubmit={handleSubmit} submitLabel="Save →" />
    </div>
  )
}
