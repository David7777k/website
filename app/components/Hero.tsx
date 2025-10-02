import React from 'react'
import { prisma } from '../../lib/prisma'

export default async function Hero() {
  const event = await prisma.event.findFirst({ where: { is_active: true }, orderBy: { starts_at: 'asc' } })
  if (!event) return (
    <section className="card p-6"> <div>Немає активних подій</div> </section>
  )

  const starts = new Date(event.starts_at)
  const ends = new Date(event.ends_at)

  return (
    <section className="card p-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{event.title}</h1>
          <p className="mt-2 text-gray-300">{event.description}</p>
          <div className="mt-2 text-sm text-gray-400">Початок: {starts.toLocaleString('uk-UA')}</div>
          <div className="mt-4 flex gap-3">
            <a href="/events" className="px-4 py-2 rounded-2xl bg-bamboo text-black">Деталі події</a>
            <button className="px-4 py-2 rounded-2xl border">Квитки</button>
          </div>
        </div>
        <div className="w-40 h-40 bg-white/5 rounded-2xl flex items-center justify-center">Poster</div>
      </div>
    </section>
  )
}
