"use client"
import React from 'react'

export default function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40">
      <div className="glass-effect border-t border-subtle px-4 py-2">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {/* Home */}
          <a href="/" className="flex flex-col items-center space-y-1 p-2 rounded-xl hover:bg-glass transition-colors">
            <div className="w-8 h-8 flex items-center justify-center text-lg">🏠</div>
            <span className="text-xs text-muted">Головна</span>
          </a>

          {/* Events */}
          <a href="/events" className="flex flex-col items-center space-y-1 p-2 rounded-xl hover:bg-glass transition-colors">
            <div className="w-8 h-8 flex items-center justify-center text-lg">📅</div>
            <span className="text-xs text-muted">Події</span>
          </a>

          {/* Wheel - Featured */}
          <button className="flex flex-col items-center space-y-1 p-3 rounded-2xl bg-bamboo text-black font-semibold transform -translate-y-2 shadow-lg hover:scale-105 transition-all">
            <div className="w-10 h-10 flex items-center justify-center text-xl">🎡</div>
            <span className="text-xs">Колесо</span>
          </button>

          {/* Music */}
          <button className="flex flex-col items-center space-y-1 p-2 rounded-xl hover:bg-glass transition-colors">
            <div className="w-8 h-8 flex items-center justify-center text-lg">🎵</div>
            <span className="text-xs text-muted">Музика</span>
          </button>

          {/* Profile */}
          <button className="flex flex-col items-center space-y-1 p-2 rounded-xl hover:bg-glass transition-colors">
            <div className="w-8 h-8 flex items-center justify-center text-lg">👤</div>
            <span className="text-xs text-muted">Профіль</span>
          </button>
        </div>
      </div>
    </div>
  )
}
