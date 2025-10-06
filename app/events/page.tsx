import React from 'react'
import { prisma } from '../../lib/prisma'

export const metadata = {
  title: 'Події | PANDA Hookah',
  description: 'Афіша подій кальянної PANDA в Києві'
}

export default async function EventsPage() {
  const now = new Date()
  const upcomingEvents = await prisma.event.findMany({
    where: { starts_at: { gte: now } },
    orderBy: { starts_at: 'asc' }
  })
  
  const pastEvents = await prisma.event.findMany({
    where: { starts_at: { lt: now } },
    orderBy: { starts_at: 'desc' },
    take: 6
  })

  const formatDateTime = (date: Date) => ({
    date: date.toLocaleDateString('uk-UA', { 
      weekday: 'long',
      day: 'numeric',
      month: 'long'
    }),
    time: date.toLocaleTimeString('uk-UA', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  })

  const EventCard = ({ event, isPast = false }: { event: any, isPast?: boolean }) => {
    const dateTime = formatDateTime(event.starts_at)
    
    return (
      <div className={`card-interactive group ${isPast ? 'opacity-60' : ''}`}>
        <div className="flex flex-col md:flex-row gap-6">
          {/* Event poster */}
          <div className="w-full md:w-32 h-48 md:h-32 gradient-border-bamboo rounded-2xl overflow-hidden">
            {event.poster_url ? (
              <img 
                src={event.poster_url} 
                alt={event.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
              />
            ) : (
              <div className="w-full h-full bg-panel flex items-center justify-center text-muted">
                <div className="text-center">
                  <div className="text-2xl mb-1">🎪</div>
                  <div className="text-xs">Постер</div>
                </div>
              </div>
            )}
          </div>

          {/* Event info */}
          <div className="flex-1 space-y-4">
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                  isPast 
                    ? 'bg-muted/20 text-muted'
                    : 'bg-accent/20 text-accent'
                }`}>
                  <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                  {isPast ? 'ЗАВЕРШЕНО' : 'LIVE EVENT'}
                </span>
                {event.is_active && !isPast && (
                  <span className="px-2 py-1 bg-bamboo/20 text-bamboo rounded-full text-xs font-medium">
                    Активна подія
                  </span>
                )}
              </div>
              
              <h3 className="text-xl md:text-2xl font-bold mb-2 group-hover:text-bamboo transition-colors">
                {event.title}
              </h3>
              
              <p className="text-text-secondary leading-relaxed">
                {event.description}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <div className="glass-effect px-4 py-2 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="text-xl">📅</div>
                  <div>
                    <div className="text-sm font-medium text-bamboo">{dateTime.date}</div>
                    <div className="text-xs text-muted">{dateTime.time}</div>
                  </div>
                </div>
              </div>

              {!isPast && (
                <button className="btn btn-primary">
                  Детальніше
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black gradient-text-bamboo">
          Афіша подій
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Не пропусти найцікавіші події в кальянній PANDA
        </p>
      </div>

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Майбутні події</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-bamboo/50 to-transparent"></div>
            <span className="text-sm text-muted">{upcomingEvents.length} подій</span>
          </div>
          
          <div className="space-y-4">
            {upcomingEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))}
          </div>
        </section>
      )}

      {/* No upcoming events */}
      {upcomingEvents.length === 0 && (
        <section className="text-center py-12">
          <div className="card max-w-md mx-auto">
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-xl font-semibold mb-2">Поки що немає майбутніх подій</h3>
            <p className="text-text-secondary">Слідкуй за нашими оновленнями в соціальних мережах</p>
          </div>
        </section>
      )}

      {/* Past Events */}
      {pastEvents.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">Минулі події</h2>
            <div className="flex-1 h-px bg-gradient-to-r from-muted/30 to-transparent"></div>
          </div>
          
          <div className="space-y-4">
            {pastEvents.map(event => (
              <EventCard key={event.id} event={event} isPast />
            ))}
          </div>
        </section>
      )}

      {/* Call to action */}
      <section className="card pattern-bamboo text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <h3 className="text-2xl font-bold">Хочеш першим дізнатися про нові події?</h3>
          <p className="text-text-secondary">
            Підписуйся на наші соціальні мережі та отримуй сповіщення про всі нові події
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <a href="#" className="btn btn-primary">
              📱 Instagram
            </a>
            <a href="#" className="btn btn-secondary">
              📢 Telegram
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}