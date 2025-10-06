'use client'

import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import QRDisplay from '@/app/components/QRDisplay'
import { QrCode, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function ProfileQRPage() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

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

  if (!session) return null

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      {/* Back Button */}
      <Link 
        href="/profile" 
        className="inline-flex items-center gap-2 text-text-muted hover:text-accent transition-colors mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Назад до профілю
      </Link>

      {/* Header */}
      <div className="text-center mb-8 space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/20 mb-4">
          <QrCode className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold">Мій QR-код</h1>
        <p className="text-text-muted">
          Покажіть цей код персоналу для підтвердження візиту
        </p>
      </div>

      {/* QR Display */}
      <QRDisplay type="visit" />

      {/* Info Cards */}
      <div className="mt-8 space-y-4">
        <div className="glass-card p-6 space-y-4">
          <h3 className="font-bold text-lg">💡 Як це працює?</h3>
          <ol className="space-y-3 text-sm text-text-muted">
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs">
                1
              </span>
              <span>Згенеруйте QR-код у своєму профілі</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs">
                2
              </span>
              <span>Покажіть код персоналу при відвідуванні</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs">
                3
              </span>
              <span>Персонал відскануює код</span>
            </li>
            <li className="flex gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-accent/20 text-accent flex items-center justify-center font-bold text-xs">
                4
              </span>
              <span>Візит автоматично зараховується + бонуси</span>
            </li>
          </ol>
        </div>

        <div className="glass-card p-6 bg-accent/10 border border-accent/30">
          <div className="flex items-start gap-3">
            <span className="text-2xl">🎁</span>
            <div>
              <h4 className="font-bold mb-1">Бонуси за візити</h4>
              <p className="text-sm text-text-muted">
                Кожен підтверджений візит приносить бали та шанс виграти призи в колесі фортуни!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}