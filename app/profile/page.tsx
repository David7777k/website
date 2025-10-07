'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { motion } from 'framer-motion'

interface ProfileData {
  id: string
  name: string
  email: string
  phone?: string
  avatar?: string
  status: string
  referralCode?: string
  referralLink: string
  visitCount: number
  bonusPoints: number
  referralCount: number
  activeCoupons: Array<{
    id: number
    title: string
    code: string
    type: string
    validUntil: string
    discount: string
  }>
  recentVisits: Array<{
    id: number
    date: string
    status: string
    amount?: number
  }>
}

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [qrCode, setQrCode] = useState<string | null>(null)
  const [copied, setCopied] = useState<'promo' | 'referral' | null>(null)
  const [loading, setLoading] = useState(true)
  const [qrLoading, setQrLoading] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // Fetch profile data
  useEffect(() => {
    if (status === 'authenticated') {
      fetchProfileData()
      // Auto-generate QR code on first load
      if (!qrCode) {
        handleGenerateQR()
      }
    }
  }, [status])

  const fetchProfileData = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setProfileData(data)
      } else {
        console.error('Failed to fetch profile data')
      }
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleCopy = async (text: string, type: 'promo' | 'referral') => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(type)
      setTimeout(() => setCopied(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const handleGenerateQR = async () => {
    setQrLoading(true)
    try {
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'visit',
          subject: 'Підтвердження візиту'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setQrCode(data.qr_png)
      } else {
        console.error('Failed to generate QR code')
      }
    } catch (error) {
      console.error('Error generating QR:', error)
    } finally {
      setQrLoading(false)
    }
  }

  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="min-h-screen bg-base flex items-center justify-center">
        <div className="text-center">
          <p className="text-text-muted">Помилка завантаження даних профілю</p>
          <button 
            onClick={fetchProfileData}
            className="mt-4 btn-primary"
          >
            Спробувати знову
          </button>
        </div>
      </div>
    )
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  }

  return (
    <div className="min-h-screen bg-base page-transition">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8 space-y-6">
        {/* Profile Header */}
        <motion.div 
          className="glass-card p-6"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-accent to-accent-hover rounded-2xl flex items-center justify-center text-3xl border-2 border-accent/30 flex-shrink-0">
              {profileData.avatar ? (
                <img src={profileData.avatar} alt={profileData.name} className="rounded-2xl w-full h-full object-cover" />
              ) : (
                '👤'
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold text-text mb-1 truncate">
                {profileData.name}
              </h1>
              <p className="text-text-muted text-sm truncate">{profileData.email}</p>
            </div>

            {/* Status Badge */}
            <div className="bg-accent/20 border border-accent/50 rounded-full px-4 py-1.5 hidden sm:block">
              <span className="text-accent font-semibold text-sm">{profileData.status}</span>
            </div>

            {/* Settings Icon */}
            <Link href="/profile/settings" className="text-text-muted hover:text-accent transition-colors flex-shrink-0">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          className="grid grid-cols-3 gap-4"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="glass-card p-4 text-center">
            <div className="text-3xl font-bold text-accent mb-1">{profileData.visitCount}</div>
            <div className="text-sm text-text-muted">Візитів</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-3xl font-bold text-accent mb-1">{profileData.bonusPoints}</div>
            <div className="text-sm text-text-muted">Бонусів</div>
          </div>
          <div className="glass-card p-4 text-center">
            <div className="text-3xl font-bold text-accent mb-1">{profileData.referralCount}</div>
            <div className="text-sm text-text-muted">Рефералів</div>
          </div>
        </motion.div>

        {/* QR Code Section */}
        <motion.div 
          className="glass-card p-6"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-accent" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <h2 className="text-lg font-semibold text-text">QR-код візиту</h2>
          </div>

          <div className="bg-white rounded-xl p-6 mb-4">
            {!qrCode ? (
              <div className="flex flex-col items-center justify-center h-48">
                <p className="text-gray-600 text-center mb-4">QR код з'явиться після створення</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center">
                <img src={qrCode} alt="QR Code" className="w-48 h-48" />
                <p className="text-gray-600 text-sm mt-2">Покажіть цей код персоналу</p>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerateQR}
            disabled={qrLoading}
            className="w-full btn-primary"
          >
            {qrLoading ? (
              <><span className="spinner"></span> Створення...</>
            ) : (
              'Створити QR-код візиту'
            )}
          </button>
        </motion.div>

        {/* Active Promotions */}
        <motion.div 
          className="glass-card p-6"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text">Активні промокоди</h2>
            <Link href="/promos" className="text-accent hover:text-accent-hover text-sm transition-colors">
              Історія →
            </Link>
          </div>

          {profileData.activeCoupons.length > 0 ? (
            <div className="space-y-4">
              {profileData.activeCoupons.map((promo) => (
                <div key={promo.id} className="bg-accent/10 border border-accent/30 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-text font-semibold mb-1">{promo.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-text-muted">
                        <span>🎡 {promo.type}</span>
                        <span>•</span>
                        <span>Діє до {promo.validUntil}</span>
                      </div>
                    </div>
                    <div className="text-accent font-bold text-xl">{promo.discount}</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-surface/80 rounded-lg px-4 py-2 font-mono text-text text-sm overflow-x-auto">
                      {promo.code}
                    </div>
                    <button
                      onClick={() => handleCopy(promo.code, 'promo')}
                      className="btn-primary whitespace-nowrap"
                    >
                      {copied === 'promo' ? '✓ Скопійовано' : '📋 Копіювати'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-center py-8">У вас поки немає активних промокодів</p>
          )}
        </motion.div>

        {/* Referral Section */}
        <motion.div 
          className="glass-card p-6"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">👥</span>
            <h2 className="text-lg font-semibold text-text">Запроси друга</h2>
          </div>

          <p className="text-text-muted text-sm mb-4">
            Отримай 100 бонусів за кожного запрошеного друга
          </p>

          <div className="flex flex-col sm:flex-row items-stretch gap-2">
            <div className="flex-1 bg-surface/80 rounded-lg px-4 py-3 text-text text-sm overflow-x-auto min-w-0">
              <code className="whitespace-nowrap">{profileData.referralLink}</code>
            </div>
            <button
              onClick={() => handleCopy(profileData.referralLink, 'referral')}
              className="btn-primary whitespace-nowrap"
            >
              {copied === 'referral' ? '✓ Скопійовано' : 'Копіювати'}
            </button>
          </div>
        </motion.div>

        {/* Recent Visits */}
        <motion.div 
          className="glass-card p-6"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-text">Останні візити</h2>
            <Link href="/profile/visits" className="text-accent hover:text-accent-hover text-sm transition-colors">
              Всі візити →
            </Link>
          </div>

          {profileData.recentVisits.length > 0 ? (
            <div className="space-y-3">
              {profileData.recentVisits.map((visit) => (
                <div key={visit.id} className="flex items-center justify-between bg-surface/50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🍃</span>
                    </div>
                    <div>
                      <span className="text-text font-medium block">{visit.date}</span>
                      {visit.amount && (
                        <span className="text-text-dim text-sm">{visit.amount} грн</span>
                      )}
                    </div>
                  </div>
                  <span className={`text-sm px-3 py-1 rounded-full ${
                    visit.status === 'Підтверджено' 
                      ? 'bg-accent/20 text-accent' 
                      : visit.status === 'Очікує'
                      ? 'bg-warn/20 text-warn'
                      : 'bg-text-dim/20 text-text-dim'
                  }`}>
                    {visit.status}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-text-muted text-center py-8">У вас поки немає візитів</p>
          )}
        </motion.div>
      </div>
    </div>
  )
}
