import Link from "next/link"
import { getProjectsAdmin } from "@/lib/airtable"
import { DeleteButton } from "./DeleteButton"

const STATUS_STYLE: Record<string, string> = {
  Live: "badge-accent",
  Building: "badge-teal",
  Beta: "badge-teal",
  Paused: "text-text-tertiary text-xs",
  Archived: "text-text-tertiary text-xs",
}

export default async function AdminProjectsPage() {
  const projects = await getProjectsAdmin()

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl text-text-primary mb-1">Projets</h1>
          <p className="text-text-secondary text-sm">{projects.length} projet{projects.length !== 1 ? "s" : ""}</p>
        </div>
        <Link href="/admin/projects/new" className="btn-primary btn-sm">+ Nouveau</Link>
      </div>

      {projects.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-text-secondary">Aucun projet. <Link href="/admin/projects/new" className="text-accent hover:underline">Créer le premier →</Link></p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {projects.map((p) => (
            <div key={p.id} className="card flex items-center gap-4">
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt={p.name}
                  className="w-16 h-10 object-cover rounded border border-bg-border flex-shrink-0" />
              ) : (
                <div className="w-16 h-10 bg-bg-elevated rounded border border-bg-border flex-shrink-0 flex items-center justify-center">
                  <span className="text-text-tertiary text-xs">—</span>
                </div>
              )}

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-text-primary font-medium text-sm truncate">{p.name}</span>
                  <span className={STATUS_STYLE[p.status] ?? "badge-teal"}>{p.status}</span>
                  {p.type && <span className="text-text-tertiary text-xs">· {p.type}</span>}
                </div>
                <p className="text-text-tertiary text-xs mt-0.5">{p.tagline}</p>
              </div>

              {p.mrr !== null && (
                <span className="text-text-primary font-display text-sm flex-shrink-0">€{p.mrr}/mo</span>
              )}

              <div className="flex items-center gap-4 flex-shrink-0">
                <Link href={`/admin/projects/${p.id}/edit`} className="text-accent text-sm hover:underline">Éditer</Link>
                <DeleteButton projectId={p.id} projectName={p.name} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
