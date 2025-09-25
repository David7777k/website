import React from 'react'
import FloatingWheel from './components/FloatingWheel'
import HeroSlider from './components/HeroSlider'
import { prisma } from '../lib/prisma'

export default async function Home() {
  const events = await prisma.event.findMany({ where: { starts_at: { gt: new Date() } }, orderBy: { starts_at: 'asc' }, take: 5 })
  const slides = events.map(e => ({ id: e.id, title: e.title, description: e.description || '', poster_url: e.poster_url || null, starts_at: e.starts_at.toISOString() }))
  return (
    <main>
      {slides.length > 0 && <HeroSlider slides={slides} />}
      <section className="mt-6">
        <h2 className="text-2xl font-bold">Швидкі дії</h2>
        <div className="mt-4 grid grid-cols-2 gap-3">
          <button className="p-3 rounded-2xl bg-bamboo text-black">Бронь</button>
          <button className="p-3 rounded-2xl border border-white/20">Меню</button>
          <button className="p-3 rounded-2xl border border-white/20">Колесо фортуни</button>
          <button className="p-3 rounded-2xl border border-white/20">Музика</button>
        </div>
      </section>
      <FloatingWheel />
    </main>
  )
}

