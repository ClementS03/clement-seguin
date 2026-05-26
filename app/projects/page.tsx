import type { Metadata } from "next";
import { getProjects } from "@/lib/airtable";
import { ProjectsGrid } from "./ProjectsGrid";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects — Clément Seguin",
  description: "B2B client sites, indie SaaS, and experiments — each project shipped solo, end-to-end, with real numbers and real progress.",
  alternates: { canonical: "https://clement-seguin.fr/projects" },
  openGraph: {
    title: "Projects — Clément Seguin",
    description: "B2B client sites, indie SaaS, and experiments — shipped solo, end-to-end.",
  },
};

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <section className="section-padding">
        <div className="section-container">
          <header className="mb-12">
            <div className="badge-teal mb-5 inline-block">Build in Public</div>
            <h1 className="section-headline mb-4">Projects</h1>
            <p className="section-subheadline max-w-xl">
              B2B client sites, indie SaaS, and experiments — each shipped solo, end-to-end.
              Real numbers, real progress.
            </p>
          </header>

          <ProjectsGrid projects={projects} />
        </div>
      </section>
    </main>
  );
}
