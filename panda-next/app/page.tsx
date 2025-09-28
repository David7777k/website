import React from 'react'
import HeroSlider from './components/HeroSlider'
import QuickActions from './components/QuickActions'
import FeaturedSection from './components/FeaturedSection'
import EventsSection from './components/EventsSection'
import { prisma } from '../lib/prisma'

export default async function Home() {
  // Get events for hero slider (top 3)
  const heroEvents = await prisma.event.findMany({ 
    where: { starts_at: { gt: new Date() } }, 
    orderBy: { starts_at: 'asc' }, 
    take: 3 
  })
  
  // Get all upcoming events for events section
  const upcomingEvents = await prisma.event.findMany({ 
    where: { starts_at: { gt: new Date() } }, 
    orderBy: { starts_at: 'asc' }, 
    take: 10 
  })
  
  const heroSlides = heroEvents.map(e => ({ 
    id: e.id, 
    title: e.title, 
    description: e.description || '', 
    poster_url: e.poster_url || null, 
    starts_at: e.starts_at.toISOString() 
  }))

  return (
    <div className="min-h-screen space-y-8">
      {/* Hero Section */}
      {heroSlides.length > 0 && (
        <section className="mb-8">
          <HeroSlider slides={heroSlides} />
        </section>
      )}

      {/* Quick Actions */}
      <QuickActions />

      {/* Events Section */}
      <EventsSection events={upcomingEvents} />

      {/* Featured Sections */}
      <FeaturedSection />
    </div>
  )
}

