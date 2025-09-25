"use client"
import React from 'react'

export default function BottomNav() {
  return (
    <div className="fixed bottom-4 left-0 right-0 md:hidden flex justify-center">
      <div className="bg-[var(--panel)]/80 backdrop-blur-md rounded-2xl px-3 py-2 flex gap-3 items-center shadow-lg">
        <a href="#" className="text-sm px-3 py-2 rounded bg-white/6">Бронь</a>
        <a href="#" className="text-sm px-3 py-2 rounded bg-bamboo text-black font-semibold">🎡 Колесо</a>
        <a href="#" className="text-sm px-3 py-2 rounded bg-white/6">Музика</a>
      </div>
    </div>
  )
}
