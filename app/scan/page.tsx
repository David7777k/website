'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import QRScanner from '../components/QRScanner'
import { ScanLine, Shield } from 'lucide-react'

export default function ScanPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    } else if (status === 'authenticated' && session?.user?.role !== 'staff' && session?.user?.role !== 'admin') {
      router.push('/') // Only staff and admin can access scanner
    }
  }, [status, session, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-text-muted">Завантаження...</p>
        </div>
      </div>
    )
  }

  if (!session || (session.user.role !== 'staff' && session.user.role !== 'admin')) {
    return null
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Header */}
      <div className="text-center mb-8 space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 mb-4">
          <ScanLine className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Сканер QR-кодів</h1>
        <p className="text-text-muted">
          Валідація візитів та промокодів гостей
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/10 border border-accent/30 rounded-full text-sm">
          <Shield className="w-4 h-4 text-accent" />
          <span>Захищено HMAC-SHA256</span>
        </div>
      </div>

      {/* Scanner Component */}
      <QRScanner />
    </div>
  )
}