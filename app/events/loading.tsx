export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-3">
        <div className="h-10 bg-surface rounded w-64" />
        <div className="h-5 bg-surface rounded w-96 max-w-full" />
      </div>

      {/* Events grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="glass-card overflow-hidden">
            <div className="aspect-video bg-surface" />
            <div className="p-6 space-y-3">
              <div className="h-6 bg-surface rounded w-3/4" />
              <div className="h-4 bg-surface rounded w-full" />
              <div className="h-4 bg-surface rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}