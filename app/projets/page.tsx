import type { Metadata } from "next";
import { getProjects } from "@/lib/airtable";
import type { Project } from "@/lib/airtable";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects",
  description:
    "Things I'm building — some live, some experiments. Building in public.",
};

const STATUS: Record<string, { label: string; cls: string }> = {
  Live:     { label: "● Live",     cls: "badge-accent" },
  Building: { label: "◐ Building", cls: "badge-teal"   },
  Paused:   { label: "○ Paused",   cls: "badge"        },
};

function ProjectCard({ project }: { project: Project }) {
  const status = STATUS[project.status] ?? STATUS.Building;

  return (
    <div className="card card-hover flex flex-col gap-4">
      <div className="flex items-start justify-between gap-3">
        <h2 className="font-display text-xl text-text-primary">{project.name}</h2>
        <span className={`${status.cls} shrink-0`}>{status.label}</span>
      </div>

      <p className="text-text-secondary text-sm leading-relaxed flex-1">
        {project.tagline}
      </p>

      {project.stack.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {project.stack.map((s) => (
            <span key={s} className="pill text-xs">
              {s}
            </span>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-3 border-t border-bg-border">
        <div className="flex items-center gap-4 text-xs text-text-secondary">
          {project.mrr !== null && (
            <span>
              €{project.mrr}
              <span className="text-text-tertiary">/mo</span>
            </span>
          )}
          {project.users !== null && (
            <span>
              {project.users.toLocaleString("en")}
              <span className="text-text-tertiary"> users</span>
            </span>
          )}
        </div>
        {project.url && (
          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent text-sm font-medium hover:underline"
          >
            Visit →
          </a>
        )}
      </div>
    </div>
  );
}

export default async function ProjetsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <section className="section-padding">
        <div className="section-container">
          <header className="text-center mb-16">
            <div className="badge-teal mb-6 inline-block">Build in Public</div>
            <h1 className="section-headline mb-4">Projects</h1>
            <p className="section-subheadline max-w-xl mx-auto">
              Things I&apos;m building, experimenting with, or have built. Some make
              money, some don&apos;t — but all teach me something.
            </p>
          </header>

          {projects.length === 0 ? (
            <div className="text-center py-24">
              <p className="text-text-secondary text-lg mb-2">Projects coming soon.</p>
              <p className="text-text-tertiary text-sm">
                Follow me on Twitter/X for updates as I build in public.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
