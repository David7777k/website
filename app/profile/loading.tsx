export default function Loading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex items-center gap-4">
        <div className="w-20 h-20 bg-surface rounded-2xl" />
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-surface rounded w-48" />
          <div className="h-4 bg-surface rounded w-32" />
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-card p-4 space-y-2">
            <div className="h-8 bg-surface rounded w-12 mx-auto" />
            <div className="h-4 bg-surface rounded w-16 mx-auto" />
          </div>
        ))}
      </div>

      {/* Content skeleton */}
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="glass-card p-6 h-24" />
        ))}
      </div>
    </div>
  )
}