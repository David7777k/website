'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { motion } from 'framer-motion'
import { 
  Home, 
  Calendar, 
  Menu as MenuIcon, 
  Music, 
  User,
  Heart,
  Gift
} from 'lucide-react'

const navItems = [
  { icon: Home, label: 'Головна', href: '/' },
  { icon: Calendar, label: 'Афіша', href: '/events' },
  { icon: MenuIcon, label: 'Меню', href: '/menu' },
  { icon: Music, label: 'Музика', href: '/music' },
  { icon: User, label: 'Профіль', href: '/profile' },
]

const actionItems = [
  { icon: Gift, label: 'Колесо', href: '/wheel', glow: true },
  { icon: Heart, label: 'Оцінка', href: '/staff', pulse: true },
]

export default function BottomDock() {
  const pathname = usePathname()

  return (
    <>
      {/* Mobile Bottom Navigation */}
      <nav className="lg:hidden bottom-dock glass-highlight safe-bottom">
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            const Icon = item.icon
            
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`dock-item ${isActive ? 'active' : ''}`}
              >
                <Icon size={24} strokeWidth={2} />
                <span className="text-[10px] font-medium mt-0.5">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* Floating Action Buttons (Always visible) */}
      <div className="fixed bottom-24 right-4 lg:bottom-8 flex flex-col gap-3 z-40">
        {actionItems.map((item) => {
          const Icon = item.icon
          
          return (
            <motion.a
              key={item.href}
              href={item.href}
              className={`
                flex items-center justify-center w-14 h-14 
                bg-accent text-base rounded-2xl shadow-glow
                hover:shadow-glow-strong transition-all duration-200
                ${item.glow ? 'animate-pulse-glow' : ''}
                ${item.pulse ? 'animate-pulse' : ''}
              `}
              whileHover={{ scale: 1.1, rotate: 5 }}
              whileTap={{ scale: 0.95 }}
              title={item.label}
            >
              <Icon size={24} strokeWidth={2.5} />
            </motion.a>
          )
        })}
      </div>

      {/* Desktop Top Navigation */}
      <nav className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-surface/80 backdrop-blur-xl border-b border-gray-800 safe-top">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.span 
                className="text-4xl"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                🐼
              </motion.span>
              <span className="text-2xl font-bold text-gradient">PANDA</span>
            </Link>

            {/* Navigation Links */}
            <div className="flex items-center gap-2">
              {navItems.map((item) => {
                const isActive = pathname === item.href
                const Icon = item.icon
                
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl
                      font-medium text-sm transition-all duration-200
                      ${isActive 
                        ? 'text-accent bg-accent/10 border border-accent/30' 
                        : 'text-text-muted hover:text-accent hover:bg-surface/50'
                      }
                    `}
                  >
                    <Icon size={18} strokeWidth={2} />
                    <span>{item.label}</span>
                  </Link>
                )
              })}
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              {actionItems.map((item) => {
                const Icon = item.icon
                
                return (
                  <motion.a
                    key={item.href}
                    href={item.href}
                    className={`
                      flex items-center gap-2 px-4 py-2 rounded-xl
                      font-semibold text-sm transition-all duration-200
                      ${item.glow 
                        ? 'bg-accent text-base shadow-glow hover:shadow-glow-strong' 
                        : 'bg-danger text-white shadow-sm hover:shadow-md'
                      }
                    `}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Icon size={18} strokeWidth={2.5} />
                    <span>{item.label}</span>
                  </motion.a>
                )
              })}
            </div>
          </div>
        </div>
      </nav>
    </>
  )
}