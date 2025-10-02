'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [qrGenerated, setQrGenerated] = useState(false)
  const [copied, setCopied] = useState<'promo' | 'referral' | null>(null)
  const [loading, setLoading] = useState(false)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login')
    }
  }, [status, router])

  // Mock user data
  const user = {
    name: session?.user?.name || "Panda",
    email: session?.user?.email || "david32m3lko@gmail.com",
    avatar: session?.user?.image || null,
    status: "Гість",
    visitCount: 0,
    bonusPoints: 0,
    referralCount: 0,
    referralCode: "A157098C0D1CE2F8F0548",
    referralLink: `https://panda.com/ref/${session?.user?.id || 'A157098C0D1CE2F8F0548'}`,
  }

  const activePromos = [
    {
      id: 1,
      title: "5% скидка на меню",
      code: "WHEEL89C87C78",
      type: "Колесо фортуни",
      validUntil: "10.10.2025",
      discount: "5.00%"
    }
  ]

  const recentVisits = [
    { date: "03.10.2025", status: "Ожидает" },
    { date: "03.10.2025", status: "Ожидает" },
    { date: "03.10.2025", status: "Ожидает" },
  ]

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
    setLoading(true)
    // Simulate API call
    setTimeout(() => {
      setQrGenerated(true)
      setLoading(false)
    }, 1000)
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black">
      <div className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
          <div className="flex items-center gap-4">
            {/* Avatar */}
            <div className="w-16 h-16 bg-gradient-to-br from-lime-500 to-green-600 rounded-2xl flex items-center justify-center text-3xl border-2 border-lime-500/30">
              {user.avatar ? (
                <img src={user.avatar} alt={user.name} className="rounded-2xl w-full h-full object-cover" />
              ) : (
                '👤'
              )}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-white mb-1">
                {user.name}
              </h1>
              <p className="text-gray-400 text-sm">{user.email}</p>
            </div>

            {/* Status Badge */}
            <div className="bg-lime-500/20 border border-lime-500/50 rounded-full px-4 py-1.5">
              <span className="text-lime-400 font-semibold text-sm">{user.status}</span>
            </div>

            {/* Settings Icon */}
            <Link href="/profile/settings" className="text-gray-400 hover:text-white transition-colors">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </Link>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
            <div className="text-3xl font-bold text-lime-400 mb-1">{user.visitCount}</div>
            <div className="text-sm text-gray-400">Візитів</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
            <div className="text-3xl font-bold text-lime-400 mb-1">{user.bonusPoints}</div>
            <div className="text-sm text-gray-400">Бонусов</div>
          </div>
          <div className="bg-gray-900 rounded-xl p-4 text-center border border-gray-800">
            <div className="text-3xl font-bold text-lime-400 mb-1">{user.referralCount}</div>
            <div className="text-sm text-gray-400">Рефералов</div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <svg className="w-6 h-6 text-lime-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v1m6 11h2m-6 0h-2v4m0-11v3m0 0h.01M12 12h4.01M16 20h4M4 12h4m12 0h.01M5 8h2a1 1 0 001-1V5a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1zm12 0h2a1 1 0 001-1V5a1 1 0 00-1-1h-2a1 1 0 00-1 1v2a1 1 0 001 1zM5 20h2a1 1 0 001-1v-2a1 1 0 00-1-1H5a1 1 0 00-1 1v2a1 1 0 001 1z" />
            </svg>
            <h2 className="text-lg font-semibold text-white">QR-код визита</h2>
          </div>

          <div className="bg-white rounded-xl p-6 mb-4">
            {!qrGenerated ? (
              <div className="flex flex-col items-center justify-center h-48">
                <p className="text-gray-400 text-center mb-4">QR код появится после создания</p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48">
                <div className="w-32 h-32 bg-gray-900 rounded-lg flex items-center justify-center">
                  <span className="text-white text-xs">QR CODE</span>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={handleGenerateQR}
            disabled={loading}
            className="w-full bg-lime-500 hover:bg-lime-600 text-black font-semibold py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Створення...' : 'Создать QR-код визита'}
          </button>
        </div>

        {/* Active Promotions */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Активные промокоды</h2>
            <Link href="/promos" className="text-lime-400 hover:text-lime-300 text-sm">
              История →
            </Link>
          </div>

          {activePromos.length > 0 ? (
            <div className="space-y-4">
              {activePromos.map((promo) => (
                <div key={promo.id} className="bg-gradient-to-r from-lime-500/10 to-green-500/10 border border-lime-500/30 rounded-xl p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-white font-semibold mb-1">{promo.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-400">
                        <span>🎡 {promo.type}</span>
                        <span>•</span>
                        <span>Действует до {promo.validUntil}</span>
                      </div>
                    </div>
                    <div className="text-lime-400 font-bold text-xl">{promo.discount}</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-800 rounded-lg px-4 py-2 font-mono text-white text-sm">
                      {promo.code}
                    </div>
                    <button
                      onClick={() => handleCopy(promo.code, 'promo')}
                      className="bg-lime-500 hover:bg-lime-600 text-black font-semibold px-6 py-2 rounded-lg transition-all flex items-center gap-2"
                    >
                      {copied === 'promo' ? (
                        <>✓ QR</>
                      ) : (
                        <>📋 QR</>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">У вас пока нет активных промокодов</p>
          )}
        </div>

        {/* Referral Section */}
        <div className="bg-gray-900 rounded-2xl p-6 mb-6 border border-gray-800">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-2xl">👥</span>
            <h2 className="text-lg font-semibold text-white">Пригласи друга</h2>
          </div>

          <p className="text-gray-400 text-sm mb-4">
            Получите 100 бонусов за каждого приглашенного друга
          </p>

          <div className="flex items-center gap-2">
            <div className="flex-1 bg-gray-800 rounded-lg px-4 py-3 text-white text-sm overflow-x-auto">
              <code className="whitespace-nowrap">{user.referralLink}</code>
            </div>
            <button
              onClick={() => handleCopy(user.referralLink, 'referral')}
              className="bg-lime-500 hover:bg-lime-600 text-black font-semibold px-6 py-3 rounded-lg transition-all whitespace-nowrap"
            >
              {copied === 'referral' ? '✓ Скопировано' : 'Копировать'}
            </button>
          </div>
        </div>

        {/* Recent Visits */}
        <div className="bg-gray-900 rounded-2xl p-6 border border-gray-800">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Последние визиты</h2>
            <Link href="/profile/visits" className="text-lime-400 hover:text-lime-300 text-sm">
              Все визиты →
            </Link>
          </div>

          {recentVisits.length > 0 ? (
            <div className="space-y-3">
              {recentVisits.map((visit, idx) => (
                <div key={idx} className="flex items-center justify-between bg-gray-800/50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                      <span className="text-xl">🍃</span>
                    </div>
                    <span className="text-white font-medium">{visit.date}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{visit.status}</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">У вас пока нет визитов</p>
          )}
        </div>
      </div>
    </div>
  )
}
