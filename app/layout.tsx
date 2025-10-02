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
          {/* New Header Component */}
          <Header />
          
          {/* Main Content */}
          <main className="px-4 py-6 max-w-7xl mx-auto pb-32 lg:pb-8 pt-24">
            {children}
          </main>

          {/* Bottom Navigation (Mobile) + Floating Actions */}
          <BottomNav />
        </Providers>
      </body>
    </html>
  )
}
