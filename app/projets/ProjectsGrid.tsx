"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import type { Project } from "@/lib/airtable";

const STATUS: Record<string, { label: string; cls: string }> = {
  Live:     { label: "Live",        cls: "badge-accent" },
  Building: { label: "In Progress", cls: "badge-teal"   },
  Paused:   { label: "Paused",      cls: "badge"        },
};

const FILTERS = ["All", "Website", "SaaS", "Product", "Personal"] as const;
type Filter = (typeof FILTERS)[number];

function ProjectCard({ project }: { project: Project }) {
  const s = STATUS[project.status] ?? STATUS.Building;
  const [imgLoaded, setImgLoaded] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);
  useEffect(() => { if (imgRef.current?.complete) setImgLoaded(true); }, []);
  const hasMetrics =
    (project.mrr !== null && project.mrr > 0) ||
    (project.users !== null && project.users > 0);

  return (
    <div className="card card-hover flex flex-col gap-0 !p-0 overflow-hidden">
      {/* Image */}
      <div className="aspect-video bg-bg-elevated overflow-hidden relative">
        {/* Shimmer placeholder */}
        {!imgLoaded && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full h-full ambient-top-accent" />
            <span className="absolute text-text-tertiary text-xs tracking-widest uppercase">
              {project.type || project.stack[0] || "Project"}
            </span>
          </div>
        )}

        {project.imageUrl ? (
          <Image
            ref={imgRef}
            src={project.imageUrl}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover object-top transition-opacity duration-500 ${imgLoaded ? "opacity-100" : "opacity-0"}`}
            onLoad={() => setImgLoaded(true)}
          />
        ) : null}

        <span className={`absolute top-3 right-3 ${s.cls}`}>{s.label}</span>
        {project.type && (
          <span className="absolute top-3 left-3 badge text-xs">{project.type}</span>
        )}
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
          {hasMetrics ? (
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
            </div>
          ) : (
            <span />
          )}
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

export function ProjectsGrid({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<Filter>("All");

  const hasTypes = projects.some((p) => !!p.type);

  const filtered =
    active === "All"
      ? projects
      : projects.filter((p) => p.type === active);

  const featured = filtered.filter((p) => p.featured);
  const rest = filtered.filter((p) => !p.featured);
  const ordered = [...featured, ...rest];

  return (
    <>
      {/* Filters — only shown once Type field is filled in Airtable */}
      {hasTypes && (
        <div className="flex flex-wrap gap-2 mb-10">
          {FILTERS.map((f) => {
            const count =
              f === "All"
                ? projects.length
                : projects.filter((p) => p.type === f).length;
            if (f !== "All" && count === 0) return null;
            return (
              <button
                key={f}
                onClick={() => setActive(f)}
                className={active === f ? "badge-accent" : "badge"}
              >
                {f}
                {f !== "All" && (
                  <span className="ml-1 opacity-60">{count}</span>
                )}
              </button>
            );
          })}
        </div>
      )}

      {ordered.length === 0 ? (
        <div className="text-center py-32 border border-bg-border rounded-2xl">
          <p className="text-text-secondary text-lg mb-2">
            No {active !== "All" ? active.toLowerCase() + " " : ""}projects yet.
          </p>
          <button
            onClick={() => setActive("All")}
            className="text-accent text-sm hover:underline"
          >
            View all →
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {ordered.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </>
  );
}
