import type { Metadata } from "next";
import { getProjects } from "@/lib/airtable";
import { ProjectsGrid } from "./ProjectsGrid";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Projects",
  description: "Things I'm building — websites, SaaS, tools, and experiments. Building in public.",
};

export default async function ProjetsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-bg-base pt-24">
      <section className="section-padding">
        <div className="section-container">
          <header className="mb-12">
            <div className="badge-teal mb-5 inline-block">Build in Public</div>
            <h1 className="section-headline mb-4">Projects</h1>
            <p className="section-subheadline max-w-xl">
              Client sites, indie SaaS, and experiments — all in one place. Real numbers,
              real progress.
            </p>
          </header>

          <ProjectsGrid projects={projects} />
        </div>
      </section>
    </main>
  );
}
