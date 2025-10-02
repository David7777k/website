"use client"
import React, { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'

export default function BurgerMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const { data: session } = useSession()

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  const menuItems = [
    { href: '/events', icon: '📅', label: 'Афіша подій', show: true },
    { href: '/faq', icon: '❓', label: 'FAQ', show: true },
    { href: '/promos', icon: '🎁', label: 'Акції та бонуси', show: true },
    { href: '/profile', icon: '👤', label: 'Мій профіль', show: !!session },
    { href: '/staff', icon: '👷', label: 'Staff панель', show: session && ['staff', 'admin'].includes((session.user as any)?.role) },
    { href: '/admin', icon: '🛠️', label: 'Адмін панель', show: session && (session.user as any)?.role === 'admin' }
  ]

  return (
    <>
      {/* Burger Button */}
      <button
        onClick={toggleMenu}
        className="p-2 rounded-xl bg-panel border border-subtle hover:bg-glass transition-colors"
      >
        <div className="w-5 h-5 flex flex-col justify-center items-center">
          <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${isOpen ? 'rotate-45 translate-y-1' : ''}`}></span>
          <span className={`block h-0.5 w-5 bg-current my-0.5 transition-opacity duration-300 ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block h-0.5 w-5 bg-current transition-all duration-300 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`}></span>
        </div>
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={closeMenu}
        />
      )}

      {/* Slide Menu */}
      <div className={`fixed top-0 right-0 h-full w-80 max-w-[90vw] bg-[var(--bg)] border-l border-subtle z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="p-6 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl">
                🐼
              </div>
              <div>
                <h2 className="text-xl font-bold gradient-text-bamboo">PANDA</h2>
                <p className="text-xs text-muted">Меню налаштувань</p>
              </div>
            </div>
            <button
              onClick={closeMenu}
              className="p-2 rounded-xl bg-panel border border-subtle hover:bg-glass transition-colors"
            >
              ✕
            </button>
          </div>

          {/* User Info */}
          {session && (
            <div className="card mb-6">
              <div className="flex items-center gap-3">
                {session.user?.image ? (
                  <img 
                    src={session.user.image} 
                    alt={session.user.name || 'User'}
                    className="w-12 h-12 rounded-full"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-bamboo flex items-center justify-center text-black text-lg font-bold">
                    {session.user?.name?.charAt(0) || '?'}
                  </div>
                )}
                <div>
                  <h3 className="font-semibold">{session.user?.name}</h3>
                  <p className="text-sm text-muted capitalize">{(session.user as any)?.role || 'guest'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Menu Items */}
          <nav className="flex-1">
            <div className="space-y-2">
              {menuItems.filter(item => item.show).map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={closeMenu}
                  className="flex items-center gap-3 p-3 rounded-xl hover:bg-glass transition-colors group"
                >
                  <div className="w-10 h-10 rounded-xl bg-panel flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <span className="font-medium group-hover:text-bamboo transition-colors">
                    {item.label}
                  </span>
                </a>
              ))}

              {/* Divider */}
              <div className="h-px bg-subtle my-4"></div>

              {/* Settings */}
              <button className="flex items-center gap-3 p-3 rounded-xl hover:bg-glass transition-colors group w-full text-left">
                <div className="w-10 h-10 rounded-xl bg-panel flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                  ⚙️
                </div>
                <span className="font-medium group-hover:text-bamboo transition-colors">
                  Налаштування
                </span>
              </button>

              {/* Language Switch */}
              <div className="flex items-center gap-3 p-3">
                <div className="w-10 h-10 rounded-xl bg-panel flex items-center justify-center text-lg">
                  🌐
                </div>
                <div className="flex-1">
                  <span className="font-medium block mb-2">Мова</span>
                  <div className="flex items-center gap-1 p-1 bg-panel rounded-lg border border-subtle">
                    <button className="px-3 py-1 text-xs font-medium bg-bamboo text-black rounded-md">UA</button>
                    <button className="px-3 py-1 text-xs font-medium text-muted hover:text-white transition-colors rounded-md">RU</button>
                  </div>
                </div>
              </div>
            </div>
          </nav>

          {/* Footer Actions */}
          <div className="border-t border-subtle pt-6 space-y-3">
            {session ? (
              <button
                onClick={() => {
                  closeMenu()
                  signOut({ callbackUrl: '/' })
                }}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-accent/20 hover:text-accent transition-colors group w-full text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                  🚪
                </div>
                <span className="font-medium">
                  Вийти з аккаунта
                </span>
              </button>
            ) : (
              <a
                href="/api/auth/signin"
                onClick={closeMenu}
                className="flex items-center gap-3 p-3 rounded-xl hover:bg-bamboo/20 hover:text-bamboo transition-colors group w-full text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-bamboo/20 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                  🔑
                </div>
                <span className="font-medium">
                  Увійти
                </span>
              </a>
            )}

            <a
              href="tel:+380123456789"
              onClick={closeMenu}
              className="flex items-center gap-3 p-3 rounded-xl hover:bg-glass transition-colors group w-full text-left"
            >
              <div className="w-10 h-10 rounded-xl bg-panel flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                📞
              </div>
              <span className="font-medium">
                Зателефонувати
              </span>
            </a>
          </div>
        </div>
      </div>
    </>
  )
}