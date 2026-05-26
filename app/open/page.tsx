import type { Metadata } from "next";
import { getProjects } from "@/lib/airtable";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Open — Public Metrics",
  description:
    "Revenue, active projects, and growth metrics from my work as a solo web builder and indie maker — updated monthly. Building in public.",
  alternates: { canonical: "https://clement-seguin.fr/open" },
  openGraph: {
    url: "https://clement-seguin.fr/open",
    title: "Open — Public Metrics",
    description: "Revenue, active projects, and growth metrics from my work as a solo web builder and indie maker — updated monthly. Building in public.",
  },
};

function fmt(n: number): string {
  return n.toLocaleString("en");
}

export default async function OpenPage() {
  const projects = await getProjects();
  const live = projects.filter((p) => p.status === "Live");
  const totalMrr = live.reduce((s, p) => s + (p.mrr ?? 0), 0);
  const totalUsers = live.reduce((s, p) => s + (p.users ?? 0), 0);

  const updatedAt = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <section className="section-padding">
        <div className="section-container">
          <header className="text-center mb-16">
            <div className="badge-accent mb-6 inline-block">Transparency</div>
            <h1 className="section-headline mb-4">Open Metrics</h1>
            <p className="section-subheadline max-w-xl mx-auto">
              Real numbers, updated every hour. Building in public means sharing
              the wins and the struggles.
            </p>
          </header>

          {/* Summary */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-16">
            <div className="card text-center">
              <p className="text-text-secondary text-sm mb-3">Total MRR</p>
              <p className="font-display text-5xl text-text-primary">€{fmt(totalMrr)}</p>
              <p className="text-text-tertiary text-xs mt-2">per month</p>
            </div>
            <div className="card text-center">
              <p className="text-text-secondary text-sm mb-3">Live Projects</p>
              <p className="font-display text-5xl text-text-primary">{live.length}</p>
              <p className="text-text-tertiary text-xs mt-2">active products</p>
            </div>
            <div className="card text-center">
              <p className="text-text-secondary text-sm mb-3">Total Users</p>
              <p className="font-display text-5xl text-text-primary">{fmt(totalUsers)}</p>
              <p className="text-text-tertiary text-xs mt-2">across all projects</p>
            </div>
          </div>

          {/* Per-project breakdown */}
          {live.length > 0 ? (
            <div>
              <h2 className="text-xs font-medium text-text-secondary tracking-wider uppercase mb-6">
                Projects breakdown
              </h2>
              <div className="flex flex-col gap-4">
                {live.map((project) => (
                  <div
                    key={project.id}
                    className="card flex items-center gap-6"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1 flex-wrap">
                        <h3 className="font-medium text-text-primary">{project.name}</h3>
                        <span className="badge-accent text-xs">● Live</span>
                      </div>
                      <p className="text-text-secondary text-sm truncate">
                        {project.tagline}
                      </p>
                    </div>

                    <div className="text-right shrink-0">
                      {project.mrr !== null && (
                        <p className="font-display text-2xl text-text-primary">
                          €{fmt(project.mrr)}
                          <span className="text-text-secondary font-body text-sm">/mo</span>
                        </p>
                      )}
                      {project.users !== null && (
                        <p className="text-text-tertiary text-xs">
                          {fmt(project.users)} users
                        </p>
                      )}
                    </div>

                    {project.url && (
                      <a
                        href={project.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent text-sm shrink-0 hover:underline"
                      >
                        Visit →
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-text-secondary">No live projects yet. Check back soon.</p>
            </div>
          )}

          {/* User counts are set manually in Airtable (project.users field).
              Option B (automatic): one SUPABASE_ACCESS_TOKEN via Supabase Management API
              to fetch service_role keys and auth user counts per project dynamically. */}

          <p className="text-center text-text-tertiary text-xs mt-14">
            Updated every hour · Last build: {updatedAt}
          </p>
        </div>
      </section>
    </main>
  );
}
