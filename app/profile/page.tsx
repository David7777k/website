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

  const quickActions = [
    { icon: '🎫', label: 'Мої візити', href: '/profile/visits', color: 'from-blue-500 to-blue-600' },
    { icon: '🎁', label: 'Бонуси', href: '/profile/bonuses', color: 'from-purple-500 to-purple-600' },
    { icon: '⚙️', label: 'Налаштування', href: '/profile/settings', color: 'from-gray-500 to-gray-600' },
    { icon: '👥', label: 'Реферали', href: '/referrals', color: 'from-green-500 to-green-600' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-700 mb-6">
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-6xl shadow-2xl border-4 border-gray-700">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="rounded-full" />
                ) : (
                  '🐼'
                )}
              </div>
              {user.vipStatus && (
                <div className="absolute -bottom-2 -right-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-black px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  ⭐ VIP
                </div>
              )}
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-2">
                {user.name}
              </h1>
              <div className="space-y-1 text-gray-400">
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <span>📧</span> {user.email}
                </p>
                <p className="flex items-center justify-center md:justify-start gap-2">
                  <span>📱</span> {user.phone}
                </p>
              </div>
            </div>

            {/* QR Code */}
            <div className="bg-white p-4 rounded-2xl shadow-xl">
              <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-4xl">📱</span>
              </div>
              <p className="text-center text-xs text-gray-600 mt-2 font-semibold">Мій QR-код</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-blue-500/20 to-blue-600/20 border border-blue-500/50 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🎫</div>
            <div className="text-3xl font-black text-blue-400 mb-1">{user.visitCount}</div>
            <div className="text-sm text-gray-400">Візитів</div>
          </div>

          <div className="bg-gradient-to-br from-green-500/20 to-green-600/20 border border-green-500/50 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">💰</div>
            <div className="text-3xl font-black text-green-400 mb-1">{user.totalSpent}₴</div>
            <div className="text-sm text-gray-400">Витрачено</div>
          </div>

          <div className="bg-gradient-to-br from-purple-500/20 to-purple-600/20 border border-purple-500/50 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">🎁</div>
            <div className="text-3xl font-black text-purple-400 mb-1">{user.activePromoCodes}</div>
            <div className="text-sm text-gray-400">Бонусів</div>
          </div>

          <div className="bg-gradient-to-br from-orange-500/20 to-orange-600/20 border border-orange-500/50 rounded-2xl p-6 text-center">
            <div className="text-4xl mb-2">⭐</div>
            <div className="text-3xl font-black text-orange-400 mb-1">{user.bonusPoints}</div>
            <div className="text-sm text-gray-400">Балів</div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {quickActions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`bg-gradient-to-br ${action.color} rounded-2xl p-6 text-center text-white hover:shadow-2xl hover:scale-105 transition-all duration-300`}
            >
              <div className="text-4xl mb-2">{action.icon}</div>
              <div className="font-bold">{action.label}</div>
            </Link>
          ))}
        </div>

        {/* Main Content Tabs */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-700">
          {/* Tabs */}
          <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {[
              { id: 'overview', icon: '📊', label: 'Огляд' },
              { id: 'qr', icon: '📱', label: 'QR-коди' },
              { id: 'stats', icon: '📈', label: 'Статистика' },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                    : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                }`}
              >
                {tab.icon} {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Wheel Status */}
              <div className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-5xl">🎡</div>
                    <div>
                      <h3 className="text-xl font-bold text-yellow-400">Колесо фортуни</h3>
                      <p className="text-gray-400 text-sm">
                        Наступне обертання через 2 дні
                      </p>
                    </div>
                  </div>
                  <button className="px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-600 text-white font-bold rounded-xl hover:shadow-xl transition-all">
                    Крутити зараз
                  </button>
                </div>
              </div>

              {/* Referral Program */}
              <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-2xl p-6">
                <h3 className="text-xl font-bold text-green-400 mb-4">👥 Реферальна програма</h3>
                <div className="flex items-center gap-4 mb-4">
                  <div className="flex-1 bg-gray-900/50 border border-gray-700 rounded-xl px-4 py-3 font-mono text-white">
                    {user.referralCode}
                  </div>
                  <button className="px-6 py-3 bg-green-500 text-white font-bold rounded-xl hover:bg-green-600 transition-all">
                    📋 Копіювати
                  </button>
                </div>
                <p className="text-gray-400 text-sm">
                  Запрошуйте друзів та отримуйте 50₴ за кожного нового гостя!
                </p>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-xl font-bold text-white mb-4">📅 Останні візити</h3>
                <div className="space-y-3">
                  {[
                    { date: '15 жовт. 2024', amount: '450₴', bonus: '+15 балів' },
                    { date: '08 жовт. 2024', amount: '380₴', bonus: '+12 балів' },
                    { date: '01 жовт. 2024', amount: '520₴', bonus: '+18 балів' },
                  ].map((visit, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-900/50 border border-gray-700 rounded-xl hover:bg-gray-900 transition-all"
                    >
                      <div>
                        <div className="text-white font-semibold">{visit.date}</div>
                        <div className="text-gray-400 text-sm">{visit.amount}</div>
                      </div>
                      <div className="text-green-400 font-semibold">{visit.bonus}</div>
                    </div>
                  ))}
                </div>
                <Link
                  href="/profile/visits"
                  className="block text-center mt-4 text-blue-400 hover:text-blue-300 transition-all"
                >
                  Переглянути всі візити →
                </Link>
              </div>
            </div>
          )}

          {activeTab === 'qr' && (
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-4">Мої QR-коди</h3>
                <p className="text-gray-400 mb-6">
                  Використовуйте QR-коди для швидкого доступу до функцій
                </p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: 'Візит', icon: '🎫', desc: 'Підтвердження відвідування', color: 'from-blue-500 to-blue-600' },
                  { title: 'Реферал', icon: '👥', desc: 'Запрошення друзів', color: 'from-green-500 to-green-600' },
                  { title: 'Профіль', icon: '👤', desc: 'Мій профіль', color: 'from-purple-500 to-purple-600' },
                  { title: 'Бонуси', icon: '🎁', desc: 'Мої бонуси', color: 'from-orange-500 to-orange-600' },
                ].map((qr) => (
                  <div
                    key={qr.title}
                    className={`bg-gradient-to-br ${qr.color}/20 border border-gray-700 rounded-2xl p-6 text-center`}
                  >
                    <div className="text-5xl mb-3">{qr.icon}</div>
                    <h4 className="text-xl font-bold text-white mb-2">{qr.title}</h4>
                    <p className="text-gray-400 text-sm mb-4">{qr.desc}</p>
                    <div className="bg-white p-4 rounded-xl inline-block mb-4">
                      <div className="w-32 h-32 bg-gray-200 rounded-lg flex items-center justify-center">
                        QR
                      </div>
                    </div>
                    <div className="flex gap-2 justify-center">
                      <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all text-sm">
                        💾 Зберегти
                      </button>
                      <button className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition-all text-sm">
                        📤 Поділитись
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-white mb-4">📈 Статистика</h3>

              {/* Charts Placeholder */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Візити по місяцях</h4>
                  <div className="h-48 flex items-end justify-around gap-2">
                    {[40, 65, 45, 80, 55, 70].map((height, idx) => (
                      <div key={idx} className="flex-1 bg-gradient-to-t from-green-500 to-emerald-600 rounded-t-lg" style={{ height: `${height}%` }}></div>
                    ))}
                  </div>
                  <div className="flex justify-around mt-2 text-xs text-gray-400">
                    <span>Тра</span>
                    <span>Чер</span>
                    <span>Лип</span>
                    <span>Сер</span>
                    <span>Вер</span>
                    <span>Жов</span>
                  </div>
                </div>

                <div className="bg-gray-900/50 border border-gray-700 rounded-2xl p-6">
                  <h4 className="text-lg font-bold text-white mb-4">Улюблені категорії</h4>
                  <div className="space-y-3">
                    {[
                      { name: 'Кальяни', percentage: 65, color: 'bg-blue-500' },
                      { name: 'Напої', percentage: 45, color: 'bg-purple-500' },
                      { name: 'Страви', percentage: 35, color: 'bg-green-500' },
                      { name: 'Коктейлі', percentage: 25, color: 'bg-orange-500' },
                    ].map((cat) => (
                      <div key={cat.name}>
                        <div className="flex justify-between text-sm text-gray-400 mb-1">
                          <span>{cat.name}</span>
                          <span>{cat.percentage}%</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div
                            className={`${cat.color} h-2 rounded-full transition-all duration-500`}
                            style={{ width: `${cat.percentage}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Achievements */}
              <div>
                <h4 className="text-lg font-bold text-white mb-4">🏆 Досягнення</h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { icon: '🎯', title: 'Перший візит', desc: 'Отримано' },
                    { icon: '🔥', title: '10 візитів', desc: 'Отримано' },
                    { icon: '⭐', title: 'VIP статус', desc: 'Отримано' },
                    { icon: '👑', title: 'Постійний гість', desc: '15/20' },
                  ].map((achievement) => (
                    <div
                      key={achievement.title}
                      className="bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-xl p-4 text-center"
                    >
                      <div className="text-4xl mb-2">{achievement.icon}</div>
                      <div className="text-white font-semibold text-sm">{achievement.title}</div>
                      <div className="text-gray-400 text-xs">{achievement.desc}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
