"use client"
import React from 'react'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/events', icon: '📅', label: 'Афіша' },
    { href: '/menu', icon: '🍽️', label: 'Меню' },
    { href: '/music', icon: '🎵', label: 'Музика' },
    { href: '/profile', icon: '👤', label: 'Профіль' }
  ]

  return (
    <>
      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 lg:hidden z-40">
        <div className="glass-effect border-t border-subtle px-2 py-2">
          <div className="flex items-center justify-around max-w-md mx-auto">
            {navItems.map((item) => (
              <a 
                key={item.href}
                href={item.href} 
                className={`flex flex-col items-center space-y-1 p-2 rounded-xl transition-colors ${
                  pathname === item.href ? 'text-bamboo' : 'text-muted hover:text-white'
                }`}
              >
                <div className="w-8 h-8 flex items-center justify-center text-lg">
                  {item.icon}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Floating Action Dock */}
      <div className="fixed bottom-20 left-0 right-0 lg:bottom-6 z-30 pointer-events-none">
        <div className="flex justify-center items-end gap-3 px-4">
          {/* Heart Button */}
          <button className="pointer-events-auto w-14 h-14 rounded-2xl bg-panel border border-subtle text-accent text-xl shadow-lg hover:scale-105 transition-all duration-300 group">
            ❤️
            {/* Tooltip */}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-2 bg-panel border border-subtle rounded-xl text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Кальянщик
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-t-4 border-t-panel border-x-4 border-x-transparent"></div>
            </div>
          </button>

          {/* Main Wheel Button - Elevated */}
          <button className="pointer-events-auto w-16 h-16 rounded-2xl bg-gradient-to-br from-bamboo to-bamboo-light text-black text-2xl shadow-2xl hover:scale-110 transition-all duration-300 pulse-bamboo group relative transform -translate-y-2">
            <span className="group-hover:animate-spin transition-transform duration-500">🎡</span>
            
            {/* Tooltip */}
            <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 px-3 py-2 bg-panel border border-subtle rounded-xl text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
              Колесо фортуни
              <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-t-4 border-t-panel border-x-4 border-x-transparent"></div>
            </div>
          </button>
        </div>
      </div>
    </>
  )
}
