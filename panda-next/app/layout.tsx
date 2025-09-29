import './globals.css'
import React from 'react'
import { Providers } from './providers'
import Header from './components/Header'
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
                    <a href="/menu" className="text-sm font-medium hover:text-bamboo transition-colors">Меню</a>
                    <a href="/music" className="text-sm font-medium hover:text-bamboo transition-colors">Музика</a>
                    <a href="/events" className="text-sm font-medium hover:text-bamboo transition-colors">Афіша</a>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {/* Contact button */}
                    <a href="tel:+380123456789" className="btn btn-ghost text-xs">
                      📞 Контакти
                    </a>
                    
                    {/* Auth */}
                    <AuthButton />
                    
                    {/* Burger Menu */}
                    <BurgerMenu />
                  </div>
                </nav>

                {/* Mobile Actions */}
                <div className="lg:hidden flex items-center gap-2">
                  <AuthButton />
                  <BurgerMenu />
                </div>
              </div>
            </div>
          </header>

          {/* Mobile Navigation - Hidden as we moved to burger */}
          <div className="hidden"><MobileNav /></div>
          
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
