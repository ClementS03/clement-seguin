"use client"

import { useState } from "react"
import Link from "next/link"
import { ProjectForm, type ProjectFormValues } from "../ProjectForm"

export default function NewProjectPage() {
  const [done, setDone] = useState(false)

  async function handleSubmit(values: ProjectFormValues) {
    const res = await fetch("/api/admin/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...values,
        mrr: values.mrr ? Number(values.mrr) : null,
        users: values.users ? Number(values.users) : null,
      }),
    })
    const data = await res.json() as { error?: string }
    if (res.ok) { setDone(true); return {} }
    return { error: data.error ?? "Something went wrong." }
  }

  if (done) {
    return (
      <div className="flex flex-col gap-6">
        <div className="card flex flex-col gap-2"
          style={{ borderColor: "rgba(45,158,107,0.2)", background: "rgba(45,158,107,0.05)" }}>
          <h2 className="text-text-primary font-medium">Project created ✓</h2>
          <p className="text-text-secondary text-sm">The project is now visible on /projets.</p>
        </div>
        <Link href="/admin/projects" className="btn-primary self-start">← Back to projects</Link>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary mb-2">New project</h1>
          <p className="text-text-secondary text-sm">Added to Airtable and visible on /projets.</p>
        </div>
        <Link href="/admin/projects" className="text-text-secondary text-sm hover:text-text-primary">← Projects</Link>
      </div>
      <ProjectForm onSubmit={handleSubmit} submitLabel="Create project →" />
    </div>
  )
}
