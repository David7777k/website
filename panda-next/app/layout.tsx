import './globals.css'
import React from 'react'
import { Providers } from './providers'
import AuthButton from './components/AuthButton'
import MobileNav from './components/MobileNav'
import BottomNav from './components/BottomNav'

export const metadata = {
  title: 'PANDA Hookah',
  description: 'PANDA — кальянна в центрі Києва'
}

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="uk">
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased">
        <Providers session={undefined}>
          {/* Header */}
          <header className="sticky top-0 z-50 glass-effect border-b border-subtle">
            <div className="max-w-7xl mx-auto px-4 py-3">
              <div className="flex items-center justify-between">
                {/* Logo */}
                <a href="/" className="flex items-center gap-3 group">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    🐼
                  </div>
                  <div>
                    <h1 className="text-xl font-bold tracking-tight gradient-text-bamboo">PANDA</h1>
                    <div className="text-xs text-muted">Кальянна • Київ</div>
                  </div>
                </a>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-8">
                  <div className="flex items-center gap-6">
                    <a href="/" className="text-sm font-medium hover:text-bamboo transition-colors">Головна</a>
                    <a href="/events" className="text-sm font-medium hover:text-bamboo transition-colors">Афіша</a>
                    <a href="/menu" className="text-sm font-medium hover:text-bamboo transition-colors">Меню</a>
                    <a href="/music" className="text-sm font-medium hover:text-bamboo transition-colors">Музика</a>
                    <a href="/faq" className="text-sm font-medium hover:text-bamboo transition-colors">FAQ</a>
                    <a href="/promos" className="text-sm font-medium hover:text-bamboo transition-colors">Акції</a>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Language Selector */}
                    <div className="flex items-center gap-1 p-1 bg-panel rounded-lg border border-subtle">
                      <button className="px-3 py-1 text-xs font-medium bg-bamboo text-black rounded-md">UA</button>
                      <button className="px-3 py-1 text-xs font-medium text-muted hover:text-white transition-colors rounded-md">RU</button>
                    </div>
                    
                    {/* Contact button */}
                    <a href="tel:+380123456789" className="btn btn-ghost text-xs">
                      📞 Контакти
                    </a>
                    
                    {/* Auth */}
                    <AuthButton />
                  </div>
                </nav>

                {/* Mobile menu button */}
                <button className="lg:hidden p-2 rounded-xl bg-panel border border-subtle">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </header>

          {/* Mobile Navigation */}
          <MobileNav />
          
          {/* Main Content */}
          <main className="px-4 py-6 max-w-7xl mx-auto pb-32 lg:pb-8">
            {children}
          </main>

          {/* Bottom Navigation (Mobile) + Floating Actions */}
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}
