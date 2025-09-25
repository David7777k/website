import React from 'react'
import FloatingWheel from './components/FloatingWheel'
import HeroSlider from './components/HeroSlider'
import QuickActions from './components/QuickActions'
import FeaturedSection from './components/FeaturedSection'
import { prisma } from '../lib/prisma'

export default async function Home() {
  const events = await prisma.event.findMany({ 
    where: { starts_at: { gt: new Date() } }, 
    orderBy: { starts_at: 'asc' }, 
    take: 5 
  })
  
  const slides = events.map(e => ({ 
    id: e.id, 
    title: e.title, 
    description: e.description || '', 
    poster_url: e.poster_url || null, 
    starts_at: e.starts_at.toISOString() 
  }))

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      {slides.length > 0 && (
        <section className="mb-8">
          <HeroSlider slides={slides} />
        </section>
      )}

      {/* Quick Actions */}
      <QuickActions />

      {/* Featured Sections */}
      <FeaturedSection />

      {/* Floating Elements */}
      <FloatingWheel />
    </div>
  )
}

