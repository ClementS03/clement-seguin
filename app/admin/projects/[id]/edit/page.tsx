import { getProjectById } from "@/lib/airtable"
import { notFound } from "next/navigation"
import Link from "next/link"
import { EditProjectClient } from "./EditProjectClient"

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const project = await getProjectById(id)
  if (!project) notFound()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary mb-1">{project.name}</h1>
          <p className="text-text-secondary text-sm">{project.status} · {project.type || "—"}</p>
        </div>
        <Link href="/admin/projects" className="text-text-secondary text-sm hover:text-text-primary">← Projets</Link>
      </div>
      <EditProjectClient project={project} />
    </div>
  )
}
