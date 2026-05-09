"use client"

import { useState } from "react"
import { ProjectForm, type ProjectFormValues } from "../../ProjectForm"
import type { Project } from "@/lib/airtable"

export function EditProjectClient({ project }: { project: Project }) {
  const [saved, setSaved] = useState(false)

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
  }

  async function handleSubmit(values: ProjectFormValues) {
    const res = await fetch(`/api/admin/projects/${project.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        mrr: values.mrr ? Number(values.mrr) : null,
        users: values.users ? Number(values.users) : null,
      }),
    })
    const data = await res.json() as { error?: string }
    if (res.ok) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
      return {}
    }
    return { error: data.error ?? "Une erreur s'est produite." }
  }

  return (
    <div className="flex flex-col gap-6">
      {saved && (
        <div className="card flex items-center gap-2"
          style={{ borderColor: "rgba(45,158,107,0.2)", background: "rgba(45,158,107,0.05)" }}>
          <span className="text-accent">✓</span>
          <p className="text-text-primary text-sm font-medium">Sauvegardé</p>
        </div>
      )}
      <ProjectForm initial={initial} onSubmit={handleSubmit} submitLabel="Sauvegarder →" />
    </div>
  )
}
