export default function Loading() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center space-y-6">
      <div className="text-6xl animate-bounce">🎡</div>
      <div className="w-16 h-16 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      <p className="text-text-muted font-medium">Завантаження колеса...</p>
    </div>
  )
}