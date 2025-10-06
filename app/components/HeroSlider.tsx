"use client"
import React, { useEffect, useRef, useState } from 'react'

type Slide = { id: number, title: string, description?: string, poster_url?: string | null, starts_at: string }

export default function HeroSlider({ slides }: { slides: Slide[] }) {
  const [index, setIndex] = useState(0)
  const [dragging, setDragging] = useState(false)
  const startX = useRef<number | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const id = setInterval(() => setIndex(i => (i + 1) % slides.length), 8000)
    return () => clearInterval(id)
  }, [slides.length])

  useEffect(() => {
    if (index >= slides.length) setIndex(0)
  }, [slides.length])

  const onPointerDown = (e: React.PointerEvent) => { 
    startX.current = e.clientX; 
    setDragging(true) 
  }
  
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

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return {
      date: date.toLocaleDateString('uk-UA', { day: '2-digit', month: 'short' }),
      time: date.toLocaleTimeString('uk-UA', { hour: '2-digit', minute: '2-digit' })
    }
  }

  if (!slides || slides.length === 0) return null

  return (
    <div className="relative overflow-hidden rounded-3xl pattern-bamboo shadow-2xl">
      <div className="h-80 md:h-[28rem] bg-gradient-to-r from-black/80 via-transparent to-black/40">
        <div className="h-full flex items-center">
          <div className="w-full px-6 md:px-8">
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-700 ease-out" 
                ref={containerRef}
                onPointerDown={onPointerDown}
                onPointerMove={onPointerMove}
                onPointerUp={onPointerUp}
                onPointerCancel={onPointerUp}
                style={{ transform: `translateX(-${index * 100}%)` }}
              >
                {slides.map((slide) => {
                  const dateInfo = formatDate(slide.starts_at)
                  return (
                    <div key={slide.id} className="min-w-full flex items-center gap-6 md:gap-12 p-4 md:p-8">
                      {/* Content */}
                      <div className="flex-1 space-y-6">
                        <div>
                          <div className="inline-flex items-center gap-2 px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium mb-4">
                            <span className="w-2 h-2 bg-accent rounded-full animate-pulse"></span>
                            LIVE EVENT
                          </div>
                          <h1 className="text-3xl md:text-6xl font-black tracking-tight mb-4 gradient-text-bamboo">
                            {slide.title}
                          </h1>
                          <p className="text-lg md:text-xl text-text-secondary max-w-2xl leading-relaxed">
                            {slide.description}
                          </p>
                        </div>

                        <div className="flex flex-wrap items-center gap-4">
                          {/* Date & Time */}
                          <div className="flex items-center gap-4">
                            <div className="glass-effect px-4 py-3 rounded-2xl">
                              <div className="flex items-center gap-3">
                                <div className="text-2xl">📅</div>
                                <div>
                                  <div className="text-sm font-medium text-bamboo">{dateInfo.date}</div>
                                  <div className="text-xs text-muted">{dateInfo.time}</div>
                                </div>
                              </div>
                            </div>
                          </div>

                          {/* CTA Button */}
                          <a href="/events" className="btn btn-primary text-base px-8 py-4 rounded-2xl">
                            Деталі події
                            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </a>
                        </div>
                      </div>

                      {/* Poster */}
                      <div className="hidden md:block">
                        <div className="w-64 h-64 lg:w-80 lg:h-80 gradient-border-bamboo rounded-3xl overflow-hidden shadow-2xl">
                          {slide.poster_url ? (
                            <img 
                              src={slide.poster_url} 
                              alt={`Постер ${slide.title}`}
                              className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                            />
                          ) : (
                            <div className="w-full h-full bg-panel flex items-center justify-center">
                              <div className="text-center text-muted">
                                <div className="text-4xl mb-2">🎪</div>
                                <div className="text-sm">Постер</div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Navigation Arrows */}
              <button 
                onClick={() => setIndex(i => Math.max(0, i-1))}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 glass-effect rounded-2xl flex items-center justify-center hover:bg-bamboo/20 transition-colors group"
                disabled={index === 0}
              >
                <svg className="w-6 h-6 group-hover:text-bamboo transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={() => setIndex(i => Math.min(slides.length-1, i+1))}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 glass-effect rounded-2xl flex items-center justify-center hover:bg-bamboo/20 transition-colors group"
                disabled={index === slides.length - 1}
              >
                <svg className="w-6 h-6 group-hover:text-bamboo transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Indicators */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                {slides.map((_, i) => (
                  <button 
                    key={i} 
                    onClick={() => setIndex(i)} 
                    className={`w-3 h-3 rounded-full transition-all duration-300 ${
                      i === index 
                        ? 'bg-bamboo w-8' 
                        : 'bg-white/20 hover:bg-white/40'
                    }`} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
