'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Sparkles, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import WheelModal from '../components/WheelModal'
import Button from '../components/ui/Button'
import Card from '../components/ui/Card'
import Badge from '../components/ui/Badge'

export default function WheelPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [showWheel, setShowWheel] = useState(false)
  const [wheelStatus, setWheelStatus] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/wheel')
      return
    }

    if (status === 'authenticated') {
      fetchWheelStatus()
    }
  }, [status, router])

  const fetchWheelStatus = async () => {
    try {
      setLoading(true)
      const res = await fetch('/api/wheel/status')
      const data = await res.json()
      setWheelStatus(data)
    } catch (error) {
      console.error('Failed to fetch wheel status:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleWheelClose = () => {
    setShowWheel(false)
    fetchWheelStatus() // Refresh status after spin
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-8 page-transition">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-text-muted hover:text-accent transition-colors">
          <ArrowLeft size={20} />
          <span>Назад</span>
        </Link>
      </div>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-4"
      >
        <motion.div
          className="text-8xl"
          animate={{
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1]
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        >
          🎡
        </motion.div>
        
        <h1 className="text-4xl md:text-6xl font-black text-gradient">
          Колесо Фортуни
        </h1>
        
        <p className="text-xl text-text-muted max-w-2xl mx-auto">
          Крутіть колесо та вигравайте знижки, безкоштовні напої та інші призи!
        </p>
      </motion.div>

      {/* Status Card */}
      <Card className="max-w-2xl mx-auto">
        <div className="space-y-6 text-center">
          {wheelStatus?.canSpin ? (
            <>
              <div className="space-y-3">
                <Badge variant="accent" className="text-base">
                  <Sparkles size={16} />
                  Безкоштовний спін доступний!
                </Badge>
                {wheelStatus.lastPrize && (
                  <p className="text-sm text-text-muted">
                    Останній приз: <span className="text-accent font-semibold">{wheelStatus.lastPrize}</span>
                  </p>
                )}
              </div>
              
              <Button
                variant="primary"
                size="lg"
                onClick={() => setShowWheel(true)}
                className="text-xl px-12 py-6 shadow-glow-strong"
              >
                <Sparkles size={24} />
                Крутити колесо
              </Button>
            </>
          ) : (
            <>
              <div className="space-y-3">
                <Badge variant="warn" className="text-base">
                  ⏳ Колесо заблоковано
                </Badge>
                {wheelStatus?.timeLeft && (
                  <div className="space-y-2">
                    <p className="text-lg font-semibold text-text-muted">
                      Наступний спін через:
                    </p>
                    <div className="flex items-center justify-center gap-4 text-accent">
                      <div className="space-y-1">
                        <div className="text-3xl font-black">{wheelStatus.timeLeft.days}</div>
                        <div className="text-xs text-text-muted">днів</div>
                      </div>
                      <div className="text-2xl">:</div>
                      <div className="space-y-1">
                        <div className="text-3xl font-black">{wheelStatus.timeLeft.hours}</div>
                        <div className="text-xs text-text-muted">годин</div>
                      </div>
                      <div className="text-2xl">:</div>
                      <div className="space-y-1">
                        <div className="text-3xl font-black">{wheelStatus.timeLeft.minutes}</div>
                        <div className="text-xs text-text-muted">хвилин</div>
                      </div>
                    </div>
                  </div>
                )}
                {wheelStatus?.lastPrize && (
                  <p className="text-sm text-text-muted mt-4">
                    Ваш останній приз: <span className="text-accent font-semibold">{wheelStatus.lastPrize}</span>
                  </p>
                )}
              </div>
              
              <Button variant="secondary" size="lg" disabled className="text-xl px-12 py-6">
                Колесо заблоковано
              </Button>
            </>
          )}
        </div>
      </Card>

      {/* Rules */}
      <Card className="max-w-2xl mx-auto">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-accent flex items-center gap-2">
            <Sparkles size={20} />
            Правила гри
          </h3>
          <ul className="space-y-3 text-text-muted">
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold">✓</span>
              <span>Безкоштовне обертання раз на 7 днів після підтвердження візиту</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold">✓</span>
              <span>Призи діють протягом 7 днів після виграшу</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold">✓</span>
              <span>Промокод можна використати один раз</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-accent font-bold">✓</span>
              <span>Всі виграші зберігаються в розділі "Бонуси" вашого профілю</span>
            </li>
          </ul>
        </div>
      </Card>

      {/* Prizes Preview */}
      <Card className="max-w-2xl mx-auto">
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-accent">🎁 Можливі призи</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              { icon: '💨', text: 'Знижка на кальян' },
              { icon: '🍽️', text: 'Знижка на кухню' },
              { icon: '🍵', text: 'Безкоштовний чай' },
              { icon: '🎵', text: 'Трек безкоштовно' },
              { icon: '🍹', text: 'Знижка на коктейль' },
              { icon: '👑', text: 'VIP привілеї' }
            ].map((prize, i) => (
              <div key={i} className="glass-card p-4 text-center space-y-2 hover:border-accent/50 transition-colors">
                <div className="text-3xl">{prize.icon}</div>
                <div className="text-sm font-medium text-text-muted">{prize.text}</div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Wheel Modal */}
      {showWheel && (
        <WheelModal open={showWheel} onClose={handleWheelClose} />
      )}
    </div>
  )
}
