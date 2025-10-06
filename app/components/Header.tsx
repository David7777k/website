'use client'

import React, { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import NotificationBell from './NotificationBell'
import NotificationPanel from './NotificationPanel'
import { useNotifications } from './NotificationSystem'

interface Language {
  code: 'uk' | 'ru'
  name: string
  flag: string
}

const languages: Language[] = [
  { code: 'uk', name: 'Українська', flag: '🇺🇦' },
  { code: 'ru', name: 'Русский', flag: '🇷🇺' }
]

export default function Header() {
  const { data: session, status } = useSession()
  const { unreadCount } = useNotifications()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [currentLang, setCurrentLang] = useState<'uk' | 'ru'>('uk')

  // Close mobile menu on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsMobileMenuOpen(false)
      }
    }

    const handleClickOutside = (e: MouseEvent) => {
      const menu = document.getElementById('mobile-menu')
      const button = document.getElementById('mobile-menu-button')
      if (menu && !menu.contains(e.target as Node) && !button?.contains(e.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener('keydown', handleEscape)
    document.addEventListener('mousedown', handleClickOutside)
    
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isMobileMenuOpen])

  const [showNotifications, setShowNotifications] = useState(false)

  const navItems = [
    { href: '/', label: 'Головна', icon: '🏠' },
    { href: '/menu', label: 'Меню', icon: '🍽️' },
    { href: '/music', label: 'Музика', icon: '🎵' },
    { href: '/events', label: 'Афіша', icon: '📅' },
    { href: '/bookings', label: 'Бронювання', icon: '📅' },
    { href: '/scan', label: 'Сканер', icon: '📱' },
    { href: '/referrals', label: 'Реферали', icon: '👥' },
  ]

  const toggleLanguage = () => {
    setCurrentLang(currentLang === 'uk' ? 'ru' : 'uk')
  }

  const handleMobileMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      <header className="panda-nav">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-3 group">
              <motion.div 
                className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                whileHover={{ scale: 1.1, rotate: 5 }}
                whileTap={{ scale: 0.95 }}
              >
                🐼
              </motion.div>
              <div>
                <h1 className="text-xl font-bold tracking-tight panda-gradient-text">PANDA</h1>
                <div className="text-xs text-gray-400">Кальянна • Київ</div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-8">
              <div className="flex items-center gap-6">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="text-sm font-medium text-gray-300 hover:text-green-400 transition-colors duration-200 flex items-center gap-2"
                  >
                    <span className="text-base">{item.icon}</span>
                    {item.label}
                  </Link>
                ))}
              </div>

              <div className="flex items-center gap-4">
                {/* Language Switcher */}
                <div className="panda-lang-switcher">
                  <button
                    onClick={() => setCurrentLang('uk')}
                    className={currentLang === 'uk' ? 'active' : ''}
                  >
                    🇺🇦 UA
                  </button>
                  <button
                    onClick={() => setCurrentLang('ru')}
                    className={currentLang === 'ru' ? 'active' : ''}
                  >
                    🇷🇺 RU
                  </button>
                </div>

                {/* Contact */}
                <a 
                  href="tel:+380937045713" 
                  className="panda-btn panda-btn-ghost text-xs"
                >
                  📞 Контакти
                </a>

                {/* Auth Button */}
                {status === 'loading' ? (
                  <div className="w-8 h-8 animate-spin rounded-full border-2 border-green-500 border-t-transparent"></div>
                ) : session ? (
                  <div className="flex items-center gap-3">
                    {/* Notifications */}
                    <NotificationBell
                      onClick={() => setShowNotifications(true)}
                      unreadCount={unreadCount}
                    />
                    
                    <Link href="/profile" className="flex items-center gap-2 text-sm text-gray-300 hover:text-green-400 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-semibold">
                        {session.user?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      {session.user?.name}
                    </Link>
                    <button
                      onClick={() => signOut()}
                      className="text-xs text-gray-400 hover:text-red-400 transition-colors"
                    >
                      Вийти
                    </button>
                  </div>
                ) : (
                  <Link href="/auth/login" className="panda-btn panda-btn-primary">
                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">🔑</div>
                    Увійти
                  </Link>
                )}
              </div>
            </nav>

            {/* Mobile Menu Button */}
            <div className="lg:hidden flex items-center gap-3">
              {session && (
                <Link href="/profile" className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-white text-sm font-semibold">
                    {session.user?.name?.[0]?.toUpperCase() || '?'}
                  </div>
                </Link>
              )}
              
              <motion.button
                id="mobile-menu-button"
                onClick={handleMobileMenuToggle}
                className="p-2 rounded-xl bg-gray-800 border border-gray-700 hover:bg-gray-700 transition-colors"
                whileTap={{ scale: 0.95 }}
              >
                <motion.div 
                  className="w-6 h-6 flex flex-col justify-center items-center"
                  animate={isMobileMenuOpen ? "open" : "closed"}
                >
                  <motion.span
                    className="block h-0.5 w-6 bg-white"
                    variants={{
                      closed: { rotate: 0, translateY: 0 },
                      open: { rotate: 45, translateY: 6 }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    className="block h-0.5 w-6 bg-white my-1"
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                  <motion.span
                    className="block h-0.5 w-6 bg-white"
                    variants={{
                      closed: { rotate: 0, translateY: 0 },
                      open: { rotate: -45, translateY: -6 }
                    }}
                    transition={{ duration: 0.3 }}
                  />
                </motion.div>
              </motion.button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              className="panda-mobile-menu-overlay"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={closeMobileMenu}
            />
            
            <motion.div
              id="mobile-menu"
              className="panda-mobile-menu"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {/* Menu Header */}
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center text-2xl">
                    🐼
                  </div>
                  <div>
                    <h2 className="text-xl font-bold panda-gradient-text">PANDA</h2>
                    <p className="text-xs text-gray-400">Меню навігації</p>
                  </div>
                </div>
                <button
                  onClick={closeMobileMenu}
                  className="p-2 rounded-xl bg-gray-700 border border-gray-600 hover:bg-gray-600 transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Navigation Items */}
              <nav className="flex-1">
                <div className="space-y-2">
                  {navItems.map((item, index) => (
                    <motion.div
                      key={item.href}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Link
                        href={item.href}
                        onClick={closeMobileMenu}
                        className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-700 transition-colors group"
                      >
                        <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                          {item.icon}
                        </div>
                        <span className="font-medium group-hover:text-green-400 transition-colors">
                          {item.label}
                        </span>
                      </Link>
                    </motion.div>
                  ))}

                  <div className="h-px bg-gray-700 my-6"></div>

                  {/* Settings Items */}
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <Link
                      href="/settings"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-700 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                        ⚙️
                      </div>
                      <span className="font-medium group-hover:text-green-400 transition-colors">
                        Налаштування
                      </span>
                    </Link>
                  </motion.div>

                  {/* Language Switcher */}
                  <div className="flex items-center gap-3 p-4">
                    <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg">
                      🌐
                    </div>
                    <div className="flex-1">
                      <span className="font-medium block mb-2">Мова</span>
                      <div className="panda-lang-switcher">
                        <button
                          onClick={() => setCurrentLang('uk')}
                          className={currentLang === 'uk' ? 'active' : ''}
                        >
                          🇺🇦 UA
                        </button>
                        <button
                          onClick={() => setCurrentLang('ru')}
                          className={currentLang === 'ru' ? 'active' : ''}
                        >
                          🇷🇺 RU
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </nav>

              {/* Bottom Actions */}
              <div className="border-t border-gray-700 pt-6 space-y-3">
                {session ? (
                  <>
                    <div className="flex items-center gap-3 p-4 rounded-xl bg-gray-700/50">
                      <div className="w-10 h-10 rounded-xl bg-green-600 flex items-center justify-center text-white font-semibold">
                        {session.user?.name?.[0]?.toUpperCase() || '?'}
                      </div>
                      <div>
                        <div className="font-medium text-white">{session.user?.name}</div>
                        <div className="text-xs text-gray-400">{session.user?.email}</div>
                      </div>
                    </div>
                    
                    <Link
                      href="/profile"
                      onClick={closeMobileMenu}
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-green-500/20 hover:text-green-400 transition-colors group w-full text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                        👤
                      </div>
                      <span className="font-medium">Особистий кабінет</span>
                    </Link>
                    
                    <button
                      onClick={() => {
                        signOut()
                        closeMobileMenu()
                      }}
                      className="flex items-center gap-3 p-4 rounded-xl hover:bg-red-500/20 hover:text-red-400 transition-colors group w-full text-left"
                    >
                      <div className="w-10 h-10 rounded-xl bg-red-500/20 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                        🚪
                      </div>
                      <span className="font-medium">Вийти</span>
                    </button>
                  </>
                ) : (
                  <Link
                    href="/auth/login"
                    onClick={closeMobileMenu}
                    className="flex items-center gap-3 p-4 rounded-xl hover:bg-green-500/20 hover:text-green-400 transition-colors group w-full text-left"
                  >
                    <div className="w-10 h-10 rounded-xl bg-green-500/20 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                      🔑
                    </div>
                    <span className="font-medium">Увійти</span>
                  </Link>
                )}

                <a
                  href="tel:+380937045713"
                  className="flex items-center gap-3 p-4 rounded-xl hover:bg-gray-700 transition-colors group w-full text-left"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-700 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    📞
                  </div>
                  <span className="font-medium">Зателефонувати</span>
                </a>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </>
  )
}