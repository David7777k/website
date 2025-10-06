import './globals.css'
import React from 'react'
import { Providers } from './providers'
import BottomDock from './components/BottomDock'

export const metadata = {
  title: 'PANDA Hookah Lounge',
  description: 'Найкраща кальянна в центрі Києва з унікальною атмосферою'
}

export default function RootLayout({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <html lang="uk">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
      </head>
      <body className="min-h-screen bg-base text-text antialiased">
        <Providers session={undefined}>
          {/* Main Content */}
          <main className="px-4 py-6 max-w-7xl mx-auto pb-32 lg:pb-8 lg:pt-24">
            {children}
          </main>

          {/* Bottom Dock Navigation + Floating Actions */}
          <BottomDock />
        </Providers>
      </body>
    </html>
  )
}
