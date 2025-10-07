export default function Loading() {
  return (
    <div className="space-y-8 animate-pulse">
      {/* Tabs skeleton */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map(i => (
          <div key={i} className="h-10 bg-surface rounded-xl w-24" />
        ))}
      </div>

      {/* Menu items grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map(i => (
          <div key={i} className="glass-card p-6 space-y-4">
            <div className="aspect-square bg-surface rounded-xl" />
            <div className="space-y-2">
              <div className="h-6 bg-surface rounded w-3/4" />
              <div className="h-4 bg-surface rounded w-full" />
              <div className="h-8 bg-surface rounded w-24 mt-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}