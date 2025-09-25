"use client"
import React, { useState, useEffect } from 'react'
import WheelModal from './WheelModal'

export default function FloatingWheel() {
  const [open, setOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    let lastScrollY = window.scrollY
    
    const updateScrollDirection = () => {
      const scrollY = window.scrollY
      const direction = scrollY > lastScrollY ? "down" : "up"
      
      if (direction !== (scrollY > lastScrollY ? "down" : "up")) {
        setIsVisible(scrollY === 0 || direction === "up")
      }
      
      lastScrollY = scrollY > 0 ? scrollY : 0
    }

    const throttledUpdateScrollDirection = () => {
      setTimeout(updateScrollDirection, 100)
    }

    window.addEventListener("scroll", throttledUpdateScrollDirection)
    return () => window.removeEventListener("scroll", throttledUpdateScrollDirection)
  }, [])

  return (
    <>
      {/* Floating Wheel Button */}
      <div className={`fixed right-4 bottom-20 lg:bottom-6 z-40 transition-all duration-300 ${
        isVisible ? 'translate-y-0 opacity-100' : 'translate-y-16 opacity-0'
      }`}>
        <button 
          onClick={() => setOpen(true)} 
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-bamboo to-bamboo-light text-black text-2xl shadow-2xl hover:scale-110 transition-all duration-300 pulse-bamboo group relative"
        >
          <span className="group-hover:animate-spin transition-transform duration-500">🎡</span>
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-panel border border-subtle rounded-xl text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Колесо фортуни
            <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-panel border-y-4 border-y-transparent"></div>
          </div>
        </button>
      </div>

      {/* Tips Button */}
      <div className="fixed right-4 bottom-36 lg:bottom-24 z-40">
        <button className="w-14 h-14 rounded-2xl bg-panel border border-subtle text-accent text-xl shadow-lg hover:scale-105 transition-all duration-300 group">
          💰
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-panel border border-subtle rounded-xl text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
            Чайові майстру
            <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-panel border-y-4 border-y-transparent"></div>
          </div>
        </button>
      </div>

      <WheelModal open={open} onClose={() => setOpen(false)} />
    </>
  )
}
