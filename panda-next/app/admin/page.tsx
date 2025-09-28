'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface AdminStats {
  todayVisits: number
  weekVisits: number
  monthRevenue: number
  activeUsers: number
  pendingMusicOrders: number
  todayWheelSpins: number
  activeCoupons: number
  totalUsers: number
  highRiskUsers: number
}

interface Activity {
  id: string
  type: string
  message: string
  user: string
  time: string
}

interface ChartData {
  date: string
  visits: number
  spins: number
  revenue: number
}

export default function AdminPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<AdminStats>({
    todayVisits: 0,
    weekVisits: 0,
    monthRevenue: 0,
    activeUsers: 0,
    pendingMusicOrders: 0,
    todayWheelSpins: 0,
    activeCoupons: 0,
    totalUsers: 0,
    highRiskUsers: 0
  })
  const [recentActivity, setRecentActivity] = useState<Activity[]>([])
  const [chartData, setChartData] = useState<ChartData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data.stats)
        setRecentActivity(data.recentActivity)
        setChartData(data.chartData)
      }
    } catch (error) {
      console.error('Error fetching stats:', error)
    } finally {
      setLoading(false)
    }
  }

  const recentActivity = [
    { id: 1, type: 'visit', message: 'Новий візит підтверджено', user: 'Олексій П.', time: '2 хв тому' },
    { id: 2, type: 'wheel', message: 'Колесо фортуни прокручено', user: 'Марія К.', time: '5 хв тому' },
    { id: 3, type: 'music', message: 'Замовлено трек', user: 'Андрій С.', time: '8 хв тому' },
    { id: 4, type: 'bonus', message: 'Використано промокод', user: 'Вікторія Л.', time: '12 хв тому' }
  ]

  const quickActions = [
    { title: 'Користувачі', icon: '👥', href: '/admin/users', count: stats.totalUsers, urgent: stats.highRiskUsers > 0 },
    { title: 'Risk-доска', icon: '🚨', href: '/admin/users/risk-board', count: stats.highRiskUsers, urgent: stats.highRiskUsers > 5 },
    { title: 'Афіша подій', icon: '📅', href: '/admin/events', count: 3 },
    { title: 'Меню', icon: '🍽️', href: '/admin/menu', count: 42 },
    { title: 'Музика', icon: '🎵', href: '/admin/music', count: stats.pendingMusicOrders, urgent: stats.pendingMusicOrders > 0 },
    { title: 'Промокоди', icon: '🎟️', href: '/admin/promos', count: stats.activeCoupons },
    { title: 'Персонал', icon: '👷', href: '/admin/staff', count: 8 },
    { title: 'Аналітика', icon: '📊', href: '/admin/analytics', count: null },
    { title: 'Налаштування', icon: '⚙️', href: '/admin/settings', count: null },
    { title: 'Логи', icon: '📝', href: '/admin/logs', count: null }
  ]

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'visit': return '✅'
      case 'wheel': return '🎡'
      case 'music': return '🎵'
      case 'bonus': return '🎁'
      default: return '📝'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-green-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Завантаження панелі адміністратора...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text-bamboo">Адмін панель</h1>
          <p className="text-text-secondary">Керування кальянною PANDA</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn btn-ghost">
            📊 Звіт
          </button>
          <button className="btn btn-primary">
            ➕ Створити подію
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.todayVisits}</p>
              <p className="text-sm text-gray-400">Візити сьогодні</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">📈</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.weekVisits}</p>
              <p className="text-sm text-gray-400">За тиждень</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">💰</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.monthRevenue.toLocaleString()}₴</p>
              <p className="text-sm text-gray-400">Дохід місяць</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.activeUsers}</p>
              <p className="text-sm text-gray-400">Активні юзери</p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🚨</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{stats.highRiskUsers}</p>
              <p className="text-sm text-gray-400">Високий ризик</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-white">⚡ Швидкі дії</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {quickActions.map((action, index) => (
            <a 
              key={index} 
              href={action.href} 
              className={`bg-gray-800 rounded-2xl p-6 border transition-all hover:scale-105 hover:shadow-xl group ${
                action.urgent ? 'border-red-500 bg-red-500/10' : 'border-gray-700 hover:border-green-500'
              }`}
            >
              <div className="text-center space-y-3">
                <div className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center text-3xl transition-transform group-hover:scale-110 ${
                  action.urgent ? 'bg-red-600' : 'bg-green-600'
                }`}>
                  {action.icon}
                </div>
                <div>
                  <h3 className="font-semibold text-white group-hover:text-green-400 transition-colors">
                    {action.title}
                  </h3>
                  {action.count !== null && (
                    <p className={`text-sm font-medium ${action.urgent ? 'text-red-400' : 'text-green-400'}`}>
                      {action.count}
                      {action.urgent && action.count > 0 && <span className="ml-1">⚠️</span>}
                    </p>
                  )}
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Остання активність</h2>
          <button className="text-sm text-bamboo hover:underline">
            Переглянути всі логи
          </button>
        </div>

        <div className="space-y-3">
          {recentActivity.map((activity) => (
            <div key={activity.id} className="card">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-panel flex items-center justify-center text-lg">
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <p className="font-medium">{activity.message}</p>
                  <p className="text-sm text-text-secondary">
                    Користувач: {activity.user}
                  </p>
                </div>
                <div className="text-sm text-muted">
                  {activity.time}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Alerts & Notifications */}
      <section className="space-y-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <span className="text-accent">🚨</span> Сповіщення
        </h2>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="card border-l-4 border-l-accent">
            <div className="flex items-start gap-3">
              <div className="text-2xl">⚠️</div>
              <div>
                <h3 className="font-semibold text-accent">Підозріла активність</h3>
                <p className="text-text-secondary text-sm">
                  Користувач намагався прокрутити колесо 5 разів підряд
                </p>
                <button className="text-xs text-accent hover:underline mt-2">
                  Переглянути деталі
                </button>
              </div>
            </div>
          </div>

          <div className="card border-l-4 border-l-bamboo">
            <div className="flex items-start gap-3">
              <div className="text-2xl">💰</div>
              <div>
                <h3 className="font-semibold text-bamboo">Високий дохід</h3>
                <p className="text-text-secondary text-sm">
                  Сьогоднішній дохід на 25% вище середнього
                </p>
                <button className="text-xs text-bamboo hover:underline mt-2">
                  Переглянути звіт
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* System Status */}
      <section className="card pattern-bamboo">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Статус системи</h3>
          <div className="grid md:grid-cols-4 gap-4">
            <div className="glass-effect p-4 rounded-2xl">
              <div className="text-2xl mb-2 text-bamboo">✅</div>
              <h4 className="font-semibold">API</h4>
              <p className="text-sm text-text-secondary">Працює нормально</p>
            </div>
            <div className="glass-effect p-4 rounded-2xl">
              <div className="text-2xl mb-2 text-bamboo">✅</div>
              <h4 className="font-semibold">База даних</h4>
              <p className="text-sm text-text-secondary">Підключено</p>
            </div>
            <div className="glass-effect p-4 rounded-2xl">
              <div className="text-2xl mb-2 text-bamboo">✅</div>
              <h4 className="font-semibold">Платежі</h4>
              <p className="text-sm text-text-secondary">LiqPay активний</p>
            </div>
            <div className="glass-effect p-4 rounded-2xl">
              <div className="text-2xl mb-2 text-accent">⚠️</div>
              <h4 className="font-semibold">Зберігання</h4>
              <p className="text-sm text-text-secondary">85% використано</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}