import React from 'react'

interface Event {
  id: number
  title: string
  description: string | null
  poster_url: string | null
  starts_at: Date
  ends_at: Date
  is_active: boolean
}

interface EventsSectionProps {
  events: Event[]
}

export default function EventsSection({ events }: EventsSectionProps) {
  if (!events || events.length === 0) {
    return null
  }

  const formatDateTime = (date: Date) => ({
    date: date.toLocaleDateString('uk-UA', { 
      weekday: 'short',
      day: 'numeric',
      month: 'short'
    }),
    time: date.toLocaleTimeString('uk-UA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  })

  return (
    <section className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold gradient-text-bamboo">📅 Афіша подій</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-bamboo/50 to-transparent"></div>
        </div>
        <a href="/events" className="btn btn-ghost text-sm">
          Всі події →
        </a>
      </div>

      {/* Events Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {events.slice(0, 6).map((event) => {
          const dateTime = formatDateTime(event.starts_at)
          
          return (
            <div key={event.id} className="card-interactive group">
              <div className="space-y-4">
                {/* Event Image */}
                <div className="w-full h-40 gradient-border-bamboo rounded-2xl overflow-hidden">
                  {event.poster_url ? (
                    <img 
                      src={event.poster_url} 
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                    />
                  ) : (
                    <div className="w-full h-full bg-panel flex items-center justify-center text-muted">
                      <div className="text-center">
                        <div className="text-4xl mb-2">🎪</div>
                        <div className="text-sm">Постер події</div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Event Info */}
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="font-bold text-lg group-hover:text-bamboo transition-colors line-clamp-2">
                      {event.title}
                    </h3>
                    {event.is_active && (
                      <span className="px-2 py-1 bg-accent/20 text-accent rounded-full text-xs font-medium whitespace-nowrap">
                        LIVE
                      </span>
                    )}
                  </div>

                  <p className="text-text-secondary text-sm line-clamp-2">
                    {event.description}
                  </p>

                  {/* Date & Time */}
                  <div className="flex items-center gap-3">
                    <div className="glass-effect px-3 py-2 rounded-xl flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">📅</span>
                        <div>
                          <div className="text-sm font-medium text-bamboo">{dateTime.date}</div>
                          <div className="text-xs text-muted">{dateTime.time}</div>
                        </div>
                      </div>
                    </div>

                    <button className="btn btn-primary text-sm px-4">
                      Детальніше
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Show More Button */}
      {events.length > 6 && (
        <div className="text-center">
          <a href="/events" className="btn btn-secondary">
            Показати всі події ({events.length})
          </a>
        </div>
      )}

      {/* Create Event CTA for logged in users */}
      <div className="card pattern-bamboo text-center">
        <div className="space-y-4">
          <div className="text-4xl">🎉</div>
          <h3 className="text-xl font-bold">Організуєте подію?</h3>
          <p className="text-text-secondary">
            Розкажіть нам про вашу подію і ми допоможемо її організувати в PANDA
          </p>
          <button className="btn btn-primary">
            📝 Запропонувати подію
          </button>
        </div>
      </div>
    </section>
  )
}