"use client"
import React, { useEffect, useRef, useState } from 'react'

type Slide = { id: number, title: string, description?: string, poster_url?: string | null, starts_at: string }

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % slides.length), 6000)
    return () => clearInterval(id)
  }, [slides.length])

  useEffect(() => {
    // reset index if slides change
    if (index >= slides.length) setIndex(0)
  }, [slides.length])

  const onPointerDown = (e: React.PointerEvent) => { startX.current = e.clientX; setDragging(true) }
  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragging || startX.current === null || !containerRef.current) return
    const dx = e.clientX - startX.current
    containerRef.current.style.transform = `translateX(calc(${-index * 100}% + ${dx}px))`
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (!dragging || startX.current === null) return
    const dx = e.clientX - startX.current
    setDragging(false)
    startX.current = null
    if (dx > 50) setIndex(i => Math.max(0, i - 1))
    else if (dx < -50) setIndex(i => Math.min(slides.length - 1, i + 1))
    if (containerRef.current) containerRef.current.style.transform = ''
  }

  if (!slides || slides.length === 0) return null

  return (
    <div className="relative overflow-hidden rounded-2xl pattern-bamboo">
      <div className="h-64 md:h-96 bg-gradient-to-r from-black/60 via-transparent to-black/20 flex items-center">
        <div className="max-w-6xl mx-auto w-full p-4">
          <div className="relative overflow-hidden">
            <div
              className={`flex transition-transform duration-500`} 
              ref={containerRef}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={onPointerUp}
              style={{ transform: `translateX(-${index * 100}%)` }}
            >
              {slides.map((s) => (
                <div key={s.id} className="min-w-full flex items-center gap-8 p-6">
                  <div className="flex-1">
                    <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">{s.title}</h2>
                    <p className="mt-2 text-[var(--muted)] hidden md:block max-w-xl">{s.description}</p>
                    <div className="mt-6 flex items-center gap-3">
                      <span className="px-3 py-2 rounded bg-white/6 text-sm">Початок: {new Date(s.starts_at).toLocaleString('uk-UA')}</span>
                      <a href="/events" className="ml-4 btn btn-primary">Деталі події</a>
                    </div>
                  </div>
                  <div className="w-44 h-44 md:w-56 md:h-56 bg-white/5 rounded-3xl overflow-hidden shadow-lg">
                    {s.poster_url ? <img src={s.poster_url} alt="poster" className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center">Poster</div>}
                  </div>
                </div>
              ))}
            </div>

            {/* controls */}
            <button aria-label="prev" onClick={() => setIndex(i => Math.max(0, i-1))} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/6 w-10 h-10 rounded-full">‹</button>
            <button aria-label="next" onClick={() => setIndex(i => Math.min(slides.length-1, i+1))} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/6 w-10 h-10 rounded-full">›</button>

            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, i) => (
                <button key={i} onClick={() => setIndex(i)} className={`w-2 h-2 rounded-full ${i===index ? 'bg-[var(--bamboo)]' : 'bg-white/20'}`} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
