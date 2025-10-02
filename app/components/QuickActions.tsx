"use client"
import React from 'react'

export default function QuickActions() {
  return (
    <section className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <h2 className="text-2xl font-bold gradient-text-bamboo">Швидкі дії</h2>
        <div className="flex-1 h-px bg-gradient-to-r from-bamboo/50 to-transparent"></div>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Booking */}
        <button className="card-interactive group">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-bamboo flex items-center justify-center text-black text-xl group-hover:scale-110 transition-transform">
              📅
            </div>
            <div>
              <h3 className="font-semibold text-white">Бронювання</h3>
              <p className="text-xs text-muted mt-1">Забронювати стіл</p>
            </div>
          </div>
        </button>

        {/* Menu */}
        <a href="/menu" className="card-interactive group">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-panel flex items-center justify-center text-bamboo text-xl group-hover:scale-110 transition-transform">
              🍽️
            </div>
            <div>
              <h3 className="font-semibold text-white">Меню</h3>
              <p className="text-xs text-muted mt-1">Кальяни та напої</p>
            </div>
          </div>
        </a>

        {/* Wheel */}
        <button className="card-interactive group">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-bamboo to-bamboo-light flex items-center justify-center text-black text-xl group-hover:scale-110 transition-transform pulse-bamboo">
              🎡
            </div>
            <div>
              <h3 className="font-semibold text-white">Колесо фортуни</h3>
              <p className="text-xs text-muted mt-1">Виграй знижку!</p>
            </div>
          </div>
        </button>

        {/* Music */}
        <button className="card-interactive group">
          <div className="flex flex-col items-center text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-panel flex items-center justify-center text-bamboo text-xl group-hover:scale-110 transition-transform">
              🎵
            </div>
            <div>
              <h3 className="font-semibold text-white">Музика</h3>
              <p className="text-xs text-muted mt-1">Замов трек</p>
            </div>
          </div>
        </button>
      </div>
    </section>
  )
}