import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { getProjects } from "@/lib/airtable";
import { Lightbox } from "./Lightbox";

type Params = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const projects = await getProjects();
  return projects.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://clement-seguin.fr";
  const projects = await getProjects();
  const project = projects.find(p => p.slug === slug);
  if (!project) return {};

  const url = `${SITE_URL}/projects/${slug}`;

  return {
    title: `${project.name} — Clément Seguin`,
    description: project.tagline,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: `${project.name} — Clément Seguin`,
      description: project.tagline,
      siteName: "Clément Seguin — Sites that close deals",
      ...(project.imageUrl && { images: [{ url: project.imageUrl }] }),
    },
  };
}

function embedUrl(url: string): string | null {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
  if (yt) return `https://www.youtube.com/embed/${yt[1]}?rel=0`;
  const vm = url.match(/vimeo\.com\/(\d+)/);
  if (vm) return `https://player.vimeo.com/video/${vm[1]}`;
  return null;
}

export default async function ProjectPage({ params }: Params) {
  const { slug } = await params;
  const projects = await getProjects();
  const project = projects.find(p => p.slug === slug);
  if (!project) notFound();

  const embed = project.videoUrl ? embedUrl(project.videoUrl) : null;
  const hasResults = project.metrics.length > 0 || (project.mrr !== null && project.mrr > 0) || (project.users !== null && project.users > 0);

  const allMetrics = [
    ...(project.mrr !== null && project.mrr > 0 ? [{ label: "MRR", value: `€${project.mrr.toLocaleString("en")}` }] : []),
    ...(project.users !== null && project.users > 0 ? [{ label: "Users", value: project.users.toLocaleString("en") }] : []),
    ...project.metrics,
  ].slice(0, 4);

  return (
    <main className="min-h-screen bg-bg-base pt-24 pb-24">
      <div className="max-w-4xl mx-auto px-6">

        {/* Breadcrumb */}
        <Link href="/projects" className="text-text-tertiary text-sm hover:text-accent transition-colors mb-8 inline-flex items-center gap-1">
          ← Projects
        </Link>

        {/* Header */}
        <header className="mt-6 mb-10">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            {project.type && <span className="badge text-xs">{project.type}</span>}
            {project.status === "Live" && <span className="badge-accent text-xs">Live</span>}
            {project.status === "Building" && <span className="badge-teal text-xs">In Progress</span>}
            {project.started && <span className="text-text-tertiary text-xs">Since {project.started}</span>}
          </div>

          <h1 className="font-display text-4xl md:text-5xl text-text-primary mb-4 leading-tight">
            {project.name}
          </h1>
          <p className="text-text-secondary text-xl leading-relaxed max-w-2xl">
            {project.tagline}
          </p>

          {project.url && (
            <a href={project.url} target="_blank" rel="noopener noreferrer"
              className="btn-primary inline-flex mt-6">
              Visit project ↗
            </a>
          )}
        </header>

        {/* Hero image */}
        {project.imageUrl && (
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-bg-border mb-10">
            <Image src={project.imageUrl} alt={project.name} fill
              className="object-cover" sizes="(max-width: 1024px) 100vw, 896px" priority />
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-10">
          {/* Main content */}
          <div className="md:col-span-2 flex flex-col gap-10">

            {/* Description markdown */}
            {project.description && (
              <section>
                <div className="markdown-body max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {project.description}
                  </ReactMarkdown>
                </div>
              </section>
            )}

            {/* Video */}
            {embed && (
              <section>
                <h2 className="font-display text-2xl text-text-primary mb-4">Demo</h2>
                <div className="relative aspect-video rounded-xl overflow-hidden border border-bg-border">
                  <iframe src={embed} className="absolute inset-0 w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen />
                </div>
              </section>
            )}

            {/* Gallery */}
            {project.gallery.length > 0 && (
              <section>
                <h2 className="font-display text-2xl text-text-primary mb-4">Screenshots</h2>
                <Lightbox images={project.gallery} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <aside className="flex flex-col gap-6">

            {/* Results */}
            {hasResults && (
              <div className="card flex flex-col gap-4">
                <p className="text-text-tertiary text-xs font-medium tracking-wider uppercase">Metrics</p>
                <div className="grid grid-cols-2 gap-3">
                  {allMetrics.map(m => (
                    <div key={m.label} className="flex flex-col gap-1">
                      <span className="font-display text-2xl text-accent">{m.value}</span>
                      <span className="text-text-tertiary text-xs">{m.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Stack */}
            {project.stack.length > 0 && (
              <div className="card flex flex-col gap-3">
                <p className="text-text-tertiary text-xs font-medium tracking-wider uppercase">Tech Stack</p>
                <div className="flex flex-wrap gap-2">
                  {project.stack.map(s => <span key={s} className="pill text-xs">{s}</span>)}
                </div>
              </div>
            )}

            {/* Meta */}
            <div className="card flex flex-col gap-3">
              <p className="text-text-tertiary text-xs font-medium tracking-wider uppercase">Info</p>
              {project.type && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-tertiary">Type</span>
                  <span className="text-text-primary">{project.type}</span>
                </div>
              )}
              {project.status && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-tertiary">Status</span>
                  <span className="text-text-primary">{project.status === "Building" ? "In Progress" : project.status}</span>
                </div>
              )}
              {project.started && (
                <div className="flex justify-between text-sm">
                  <span className="text-text-tertiary">Started</span>
                  <span className="text-text-primary">{project.started}</span>
                </div>
              )}
              {project.url && (
                <a href={project.url} target="_blank" rel="noopener noreferrer"
                  className="text-accent text-sm hover:underline mt-1">
                  Visit ↗
                </a>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
