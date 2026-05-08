import type { Metadata } from "next";
import { getProjects } from "@/lib/airtable";
import type { Project } from "@/lib/airtable";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I'm building — some live, some experiments. Building in public.",
};

const STATUS: Record<string, { label: string; cls: string; dot: string }> = {
  Live:     { label: "Live",     cls: "badge-accent", dot: "●" },
  Building: { label: "Building", cls: "badge-teal",   dot: "◐" },
  Paused:   { label: "Paused",   cls: "badge",        dot: "○" },
};

function ProjectCard({ project }: { project: Project }) {
  const s = STATUS[project.status] ?? STATUS.Building;

  return (
    <div className="card card-hover flex flex-col gap-0 !p-0 overflow-hidden">
      {/* Image */}
      <div className="aspect-video bg-bg-elevated overflow-hidden relative">
        {project.imageUrl ? (
          <img
            src={project.imageUrl}
            alt={project.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full ambient-top-accent flex items-center justify-center">
            <span className="text-text-tertiary text-xs tracking-widest uppercase">
              {project.stack[0] ?? "Project"}
            </span>
          </div>
        )}
        <span className={`absolute top-3 right-3 ${s.cls}`}>
          {s.dot} {s.label}
        </span>
      </div>

      {/* Content */}
      <div className="flex flex-col gap-3 p-5 flex-1">
        <h2 className="font-display text-xl text-text-primary leading-snug">
          {project.name}
        </h2>

        <p className="text-text-secondary text-sm leading-relaxed flex-1">
          {project.tagline}
        </p>

        {project.stack.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {project.stack.map((s) => (
              <span key={s} className="pill text-xs">{s}</span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-3 border-t border-bg-border">
          <div className="flex items-center gap-4 text-xs text-text-secondary">
            {project.mrr !== null && project.mrr > 0 && (
              <span>
                €{project.mrr.toLocaleString("en")}
                <span className="text-text-tertiary">/mo</span>
              </span>
            )}
            {project.users !== null && project.users > 0 && (
              <span>
                {project.users.toLocaleString("en")}
                <span className="text-text-tertiary"> users</span>
              </span>
            )}
            {(project.mrr === null || project.mrr === 0) &&
              (project.users === null || project.users === 0) && (
                <span className="text-text-tertiary italic">Early stage</span>
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
    </div>
  );
}

export default async function ProjetsPage() {
  const projects = await getProjects();
  const featured = projects.filter((p) => p.featured);
  const rest = projects.filter((p) => !p.featured);
  const ordered = [...featured, ...rest];

  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <section className="section-padding">
        <div className="section-container">
          <header className="mb-16">
            <div className="badge-teal mb-5 inline-block">Build in Public</div>
            <h1 className="section-headline mb-4">Projects</h1>
            <p className="section-subheadline max-w-xl">
              Things I&apos;m building, experimenting with, or have shipped. Real numbers,
              real progress.
            </p>
          </header>

          {ordered.length === 0 ? (
            <div className="text-center py-32 border border-bg-border rounded-2xl">
              <p className="text-text-secondary text-lg mb-2">Projects coming soon.</p>
              <p className="text-text-tertiary text-sm">
                Follow{" "}
                <a href="https://x.com/clembuild" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">
                  @clembuild
                </a>{" "}
                for live updates.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {ordered.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
