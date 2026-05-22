"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ExternalLink } from "lucide-react"

// ── Types ──────────────────────────────────────────────────────────────────

export interface CarouselProject {
  id: string
  name: string
  category: string
  description: string
  tags: string[]
  url: string
  screenshot: string
  visitLabel?: string
}

// ── Hooks ──────────────────────────────────────────────────────────────────

function useNumberCycler(totalSteps: number, interval = 6000) {
  const [currentNumber, setCurrentNumber] = useState(0)

  useEffect(() => {
    const timerId = setTimeout(
      () => setCurrentNumber((prev) => (prev + 1) % totalSteps),
      interval
    )
    return () => clearTimeout(timerId)
  }, [currentNumber, totalSteps, interval])

  const setStep = useCallback(
    (stepIndex: number) => setCurrentNumber(stepIndex % totalSteps),
    [totalSteps]
  )

  return { currentNumber, setStep }
}

// ── Helpers ────────────────────────────────────────────────────────────────

function IconCheck() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 256 256"
      fill="currentColor"
      className="h-3 w-3"
    >
      <path d="m229.66 77.66-128 128a8 8 0 0 1-11.32 0l-56-56a8 8 0 0 1 11.32-11.32L96 188.69 218.34 66.34a8 8 0 0 1 11.32 11.32Z" />
    </svg>
  )
}

// ── ScreenshotPanel ────────────────────────────────────────────────────────

function ScreenshotPanel({ project }: { project: CarouselProject }) {
  const [loaded, setLoaded] = useState(false)
  const prevIdRef = useRef(project.id)

  if (prevIdRef.current !== project.id) {
    prevIdRef.current = project.id
    setLoaded(false)
  }

  return (
    <div className="h-full rounded-xl overflow-hidden border border-bg-border shadow-card-hover relative bg-bg-elevated">
      {!loaded && (
        <div className="absolute inset-0 flex flex-col gap-3 p-5 animate-pulse">
          <div className="h-5 bg-bg-surface rounded w-2/3" />
          <div className="h-3 bg-bg-surface rounded w-full" />
          <div className="h-3 bg-bg-surface rounded w-5/6" />
          <div className="h-28 bg-bg-surface rounded mt-1" />
          <div className="flex gap-2 mt-1">
            <div className="h-8 w-20 bg-bg-surface rounded-lg" />
            <div className="h-8 w-24 bg-bg-surface rounded-lg" />
          </div>
        </div>
      )}
      <img
        key={project.id}
        src={project.screenshot}
        alt={`Aperçu — ${project.name}`}
        className={`w-full h-full object-cover object-top transition-opacity duration-700 ${
          loaded ? "opacity-100" : "opacity-0"
        }`}
        onLoad={() => setLoaded(true)}
      />
    </div>
  )
}

// ── FeatureCard ────────────────────────────────────────────────────────────
// Using key={step} to remount → CSS animate-fade-up reruns on each slide change

function FeatureCard({ project, step }: { project: CarouselProject; step: number }) {
  return (
    <div className="relative w-full overflow-hidden rounded-2xl border border-bg-border bg-bg-elevated">
      {/* Ambient glow */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 0% 50%, rgba(45,158,107,0.07), transparent)",
        }}
      />

      {/* Grid: text | screenshot */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-[46%_54%] min-h-[420px]">

        {/* Left: project info — key forces remount → animation reruns */}
        <div
          key={step}
          className="animate-fade-up flex flex-col justify-center gap-6 p-8 md:p-12 md:pr-8"
        >
          <p className="text-xs font-semibold uppercase tracking-widest text-accent">
            {project.category}
          </p>

          <h3 className="font-display text-3xl md:text-4xl italic text-text-primary leading-tight tracking-tight">
            {project.name}
          </h3>

          <p className="text-base leading-loose text-text-secondary">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="badge-accent text-xs">
                {tag}
              </span>
            ))}
          </div>

          <a
            href={project.url}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary inline-flex items-center gap-2 text-sm self-start"
          >
            {project.visitLabel ?? "Voir le projet"}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </div>

        {/* Right: screenshot (desktop only) */}
        <div className="hidden md:flex md:items-center p-5 pl-0">
          <div className="w-full aspect-video">
            <ScreenshotPanel project={project} />
          </div>
        </div>

      </div>
    </div>
  )
}

// ── ProjectsNav ────────────────────────────────────────────────────────────

function ProjectsNav({
  projects,
  current,
  onChange,
}: {
  projects: CarouselProject[]
  current: number
  onChange: (index: number) => void
}) {
  return (
    <nav aria-label="Projects" className="flex justify-center px-4">
      <ol className="flex w-full flex-wrap items-center justify-center gap-2" role="list">
        {projects.map((project, idx) => {
          const isCompleted = current > idx
          const isCurrent = current === idx

          return (
            <li
              key={project.id}
              className={`transition-all duration-300 ${
                isCurrent ? "scale-100 opacity-100" : "scale-90 opacity-65"
              }`}
            >
              <button
                type="button"
                onClick={() => onChange(idx)}
                className={`flex items-center gap-2 rounded-full px-3.5 py-1.5 text-sm font-body font-medium transition-colors duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base ${
                  isCurrent
                    ? "bg-accent text-white"
                    : "bg-bg-elevated text-text-secondary hover:bg-bg-surface hover:text-text-primary border border-bg-border"
                }`}
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-xs font-semibold transition-colors duration-300 ${
                    isCurrent
                      ? "bg-white/20 text-white"
                      : isCompleted
                      ? "bg-accent text-white"
                      : "bg-bg-surface text-text-secondary"
                  }`}
                >
                  {isCompleted ? <IconCheck /> : idx + 1}
                </span>
                <span className="hidden sm:inline-block">{project.name}</span>
              </button>
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

// ── FeatureCarousel (main export) ──────────────────────────────────────────

export function FeatureCarousel({ projects }: { projects: CarouselProject[] }) {
  const { currentNumber: step, setStep } = useNumberCycler(projects.length)

  // Preload all screenshots so they're cached before the carousel auto-advances
  useEffect(() => {
    projects.forEach((p) => {
      const img = new Image()
      img.src = p.screenshot
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="flex flex-col gap-6 w-full max-w-5xl mx-auto">
      {/* Progress bar — resets via key on each slide change */}
      <div className="h-0.5 bg-bg-elevated rounded-full overflow-hidden">
        <div key={step} className="h-full bg-accent/50 rounded-full carousel-progress" />
      </div>

      <FeatureCard project={projects[step]} step={step} />
      <ProjectsNav current={step} onChange={setStep} projects={projects} />
    </div>
  )
}
