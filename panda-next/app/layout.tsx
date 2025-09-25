import './globals.css'
import React from 'react'
import dynamic from 'next/dynamic'

const AuthButton = dynamic(() => import('./components/AuthButton'), { ssr: false })
const MobileNav = dynamic(() => import('./components/MobileNav'), { ssr: false })
const BottomNav = dynamic(() => import('./components/BottomNav'), { ssr: false })

export const metadata = {
  title: 'PANDA Hookah',
  description: 'PANDA — кальянная'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="uk">
      <body className="min-h-screen bg-[var(--bg)] text-[var(--text)] antialiased">
        <header className="p-4 border-b border-gray-800">
          <div className="max-w-5xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-black font-extrabold text-lg">🐼</div>
              <div>
                <h1 className="text-lg font-bold tracking-tight">PANDA</h1>
                <div className="text-xs text-[var(--muted)]">Кальянна • Київ</div>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-4">
              <a href="/" className="text-sm hover:underline">Головна</a>
              <a href="/events" className="text-sm hover:underline">Події</a>
              <a href="/menu" className="text-sm hover:underline">Меню</a>
              <a href="/faq" className="text-sm hover:underline">FAQ</a>
              <div className="h-6 w-px bg-gray-700" />
              <select className="bg-transparent text-sm border border-white/10 rounded px-2 py-1 bg-[transparent] text-[var(--text)]">
                <option value="uk">UA</option>
                <option value="ru">RU</option>
              </select>
              <button className="btn btn-ghost">Контакти</button>
              <AuthButton />
            </nav>
          </div>
        </header>
        <MobileNav />
        <main className="p-4 max-w-5xl mx-auto">{children}</main>
        <BottomNav />
      </body>
    </html>
  )
}
