"use client"
import React from 'react'
import { usePathname } from 'next/navigation'

export default function BottomNav() {
  const pathname = usePathname()

  const navItems = [
    { href: '/', icon: '🏠', label: 'Головна' },
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

      {/* Floating Action Buttons - Right Bottom */}
      <div className="fixed bottom-24 right-4 lg:bottom-6 z-30 flex flex-col gap-3">
        {/* Tips Button */}
        <button className="w-14 h-14 rounded-2xl bg-panel border border-subtle text-accent text-xl shadow-lg hover:scale-105 transition-all duration-300 group">
          ❤️
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-panel border border-subtle rounded-xl text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Подякувати кальянщику
            <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-panel border-y-4 border-y-transparent"></div>
          </div>
        </button>

        {/* Main Wheel Button */}
        <button className="w-16 h-16 rounded-2xl bg-gradient-to-br from-bamboo to-bamboo-light text-black text-2xl shadow-2xl hover:scale-105 transition-all duration-300 group">
          <span className="group-hover:animate-spin transition-transform duration-500">🎡</span>
          
          {/* Tooltip */}
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 px-3 py-2 bg-panel border border-subtle rounded-xl text-white text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            Колесо фортуни
            <div className="absolute left-full top-1/2 -translate-y-1/2 w-0 h-0 border-l-4 border-l-panel border-y-4 border-y-transparent"></div>
          </div>
        </button>
      </div>
    </>
  )
}
