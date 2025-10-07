export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Header */}
      <div className="space-y-3">
        <div className="h-10 bg-surface rounded w-64" />
        <div className="h-5 bg-surface rounded w-96 max-w-full" />
      </div>

      {/* Search bar */}
      <div className="h-14 bg-surface rounded-xl" />

      {/* Queue */}
      <div className="space-y-4">
        <div className="h-6 bg-surface rounded w-32" />
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-card p-4 flex items-center gap-4">
            <div className="w-16 h-16 bg-surface rounded-xl" />
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-surface rounded w-3/4" />
              <div className="h-4 bg-surface rounded w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}