export default function Loading() {
  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 w-40 bg-bg-elevated rounded animate-pulse" />
        <div className="h-9 w-36 bg-bg-elevated rounded animate-pulse" />
      </div>
      <div className="card !p-0 overflow-hidden">
        <div className="divide-y divide-bg-border">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 px-6 py-4">
              <div className="w-16 h-10 bg-bg-elevated rounded animate-pulse shrink-0" />
              <div className="flex-1 min-w-0 space-y-2">
                <div className="h-4 w-52 bg-bg-elevated rounded animate-pulse" />
                <div className="h-3 w-36 bg-bg-elevated rounded animate-pulse" />
              </div>
              <div className="h-5 w-20 bg-bg-elevated rounded-full animate-pulse" />
              <div className="h-4 w-12 bg-bg-elevated rounded animate-pulse" />
              <div className="h-4 w-12 bg-bg-elevated rounded animate-pulse" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
