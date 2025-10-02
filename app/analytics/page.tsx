"use client"
import React, { useState, useEffect, useRef } from 'react'
import { useSession } from 'next-auth/react'

interface AnalyticsData {
  overview: {
    totalVisits: number
    uniqueVisitors: number
    avgVisitDuration: number
    conversionRate: number
    totalRevenue: number
    bounceRate: number
  }
  visits: {
    byDay: Array<{ date: string; count: number }>
    byHour: Array<{ hour: number; count: number }>
    sources: Array<{ source: string; count: number; percentage: number }>
  }
  menu: {
    byCategory: Array<{ category: string; orders: number; revenue: number }>
    topItems: Array<{ name: string; orders: number; revenue: number; likes: number }>
    trends: Array<{ date: string; orders: number }>
  }
  staff: {
    ratings: Array<{ name: string; avgRating: number; totalRatings: number; tips: number }>
    ratingTrends: Array<{ date: string; avgRating: number }>
    tipStats: { total: number; avgPerVisit: number; topStaff: Array<{ name: string; amount: number }> }
  }
  revenue: {
    avgCheck: number
    byCategory: Array<{ category: string; amount: number; percentage: number }>
    topSales: Array<{ item: string; revenue: number; orders: number }>
    trends: Array<{ date: string; revenue: number }>
  }
}

export default function AdvancedAnalytics() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'overview' | 'visits' | 'menu' | 'staff' | 'revenue'>('overview')
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '3m' | '1y'>('7d')
  const [data, setData] = useState<AnalyticsData | null>(null)
  const [loading, setLoading] = useState(true)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (session?.user) {
      fetchAnalytics()
    }
  }, [session, timeRange])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const response = await fetch(`/api/analytics?range=${timeRange}`)
      if (response.ok) {
        const analyticsData = await response.json()
        setData(analyticsData)
      }
    } catch (error) {
      console.error('Error fetching analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (data && canvasRef.current) {
      drawChart()
    }
  }, [data, activeTab])

  const drawChart = () => {
    const canvas = canvasRef.current
    if (!canvas || !data) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Simple line chart example for revenue trends
    if (activeTab === 'revenue' && data.revenue.trends.length > 0) {
      const trends = data.revenue.trends
      const maxRevenue = Math.max(...trends.map(t => t.revenue))
      const padding = 40
      const chartWidth = canvas.width - padding * 2
      const chartHeight = canvas.height - padding * 2

      // Draw axes
      ctx.strokeStyle = '#4B5563'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(padding, padding)
      ctx.lineTo(padding, canvas.height - padding)
      ctx.lineTo(canvas.width - padding, canvas.height - padding)
      ctx.stroke()

      // Draw line
      ctx.strokeStyle = '#10B981'
      ctx.lineWidth = 3
      ctx.beginPath()
      
      trends.forEach((point, index) => {
        const x = padding + (index / (trends.length - 1)) * chartWidth
        const y = canvas.height - padding - (point.revenue / maxRevenue) * chartHeight
        
        if (index === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })
      
      ctx.stroke()

      // Draw points
      ctx.fillStyle = '#10B981'
      trends.forEach((point, index) => {
        const x = padding + (index / (trends.length - 1)) * chartWidth
        const y = canvas.height - padding - (point.revenue / maxRevenue) * chartHeight
        
        ctx.beginPath()
        ctx.arc(x, y, 5, 0, Math.PI * 2)
        ctx.fill()
      })
    }
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-2xl font-bold text-white mb-2">Доступ обмежений</h3>
        <p className="text-[var(--text-secondary)]">
          Для перегляду аналітики потрібна авторизація
        </p>
      </div>
    )
  }

  if (loading || !data) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-black gradient-text-bamboo mb-2">
            📊 Розширена Аналітика
          </h1>
          <p className="text-[var(--text-secondary)]">
            Детальна статистика та insights вашого закладу
          </p>
        </div>

        {/* Time Range Selector */}
        <div className="flex gap-2 bg-[var(--bg-card)] p-1 rounded-xl border border-[var(--border-primary)]">
          {[
            { value: '7d', label: '7 днів' },
            { value: '30d', label: '30 днів' },
            { value: '3m', label: '3 місяці' },
            { value: '1y', label: 'Рік' }
          ].map((range) => (
            <button
              key={range.value}
              onClick={() => setTimeRange(range.value as any)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                timeRange === range.value
                  ? 'bg-green-600 text-white'
                  : 'text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {[
          { id: 'overview', label: '📈 Огляд', icon: '📈' },
          { id: 'visits', label: '👥 Візити', icon: '👥' },
          { id: 'menu', label: '🍽️ Меню', icon: '🍽️' },
          { id: 'staff', label: '⭐ Персонал', icon: '⭐' },
          { id: 'revenue', label: '💰 Доходи', icon: '💰' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap ${
              activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white border border-[var(--border-primary)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* KPI Cards */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">👥</span>
                <span className="text-sm text-green-400">+12%</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{data.overview.totalVisits}</h3>
              <p className="text-sm text-[var(--text-secondary)]">Всього візитів</p>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">⏱️</span>
                <span className="text-sm text-green-400">+8%</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{data.overview.avgVisitDuration}хв</h3>
              <p className="text-sm text-[var(--text-secondary)]">Середній час візиту</p>
            </div>

            <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
              <div className="flex items-center justify-between mb-3">
                <span className="text-3xl">💰</span>
                <span className="text-sm text-green-400">+15%</span>
              </div>
              <h3 className="text-3xl font-bold text-white mb-1">{data.overview.totalRevenue}₴</h3>
              <p className="text-sm text-[var(--text-secondary)]">Загальний дохід</p>
            </div>
          </div>

          {/* Chart Canvas */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">Динаміка візитів</h3>
            <canvas ref={canvasRef} width={800} height={300} className="w-full"></canvas>
          </div>
        </div>
      )}

      {/* Visits Tab */}
      {activeTab === 'visits' && (
        <div className="space-y-6">
          {/* Visits by Hour */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">📊 Розподіл візитів по годинах</h3>
            <div className="grid grid-cols-12 gap-2">
              {data.visits.byHour.map((hourData) => {
                const maxCount = Math.max(...data.visits.byHour.map(h => h.count))
                const height = (hourData.count / maxCount) * 100
                
                return (
                  <div key={hourData.hour} className="flex flex-col items-center">
                    <div className="w-full bg-[var(--bg-tertiary)] rounded-lg overflow-hidden h-24 flex items-end">
                      <div
                        className="w-full bg-green-600 rounded-t"
                        style={{ height: `${height}%` }}
                      ></div>
                    </div>
                    <span className="text-xs text-[var(--text-muted)] mt-2">{hourData.hour}:00</span>
                    <span className="text-xs text-white font-semibold">{hourData.count}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Traffic Sources */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">🌐 Джерела трафіку</h3>
            <div className="space-y-3">
              {data.visits.sources.map((source) => (
                <div key={source.source}>
                  <div className="flex justify-between mb-1">
                    <span className="text-white font-medium">{source.source}</span>
                    <span className="text-[var(--text-secondary)]">{source.count} ({source.percentage}%)</span>
                  </div>
                  <div className="bg-[var(--bg-tertiary)] rounded-full h-2">
                    <div
                      className="bg-green-600 h-full rounded-full transition-all"
                      style={{ width: `${source.percentage}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Menu Tab */}
      {activeTab === 'menu' && (
        <div className="space-y-6">
          {/* Top Items */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">🏆 Топ страв</h3>
            <div className="space-y-3">
              {data.menu.topItems.map((item, index) => (
                <div key={item.name} className="flex items-center gap-4 p-3 bg-[var(--bg-tertiary)] rounded-xl">
                  <div className="text-2xl font-bold text-green-500">#{index + 1}</div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-white">{item.name}</h4>
                    <p className="text-sm text-[var(--text-secondary)]">
                      {item.orders} замовлень • {item.likes} ❤️
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-400">{item.revenue}₴</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* By Category */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">📂 За категоріями</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {data.menu.byCategory.map((cat) => (
                <div key={cat.category} className="bg-[var(--bg-tertiary)] rounded-xl p-4">
                  <h4 className="font-semibold text-white mb-2">{cat.category}</h4>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Замовлень:</span>
                    <span className="text-white font-medium">{cat.orders}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Дохід:</span>
                    <span className="text-green-400 font-bold">{cat.revenue}₴</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Staff Tab */}
      {activeTab === 'staff' && (
        <div className="space-y-6">
          {/* Staff Ratings */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">⭐ Рейтинги персоналу</h3>
            <div className="space-y-3">
              {data.staff.ratings.map((staff) => (
                <div key={staff.name} className="bg-[var(--bg-tertiary)] rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-white">{staff.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="text-yellow-400 font-bold">{staff.avgRating.toFixed(1)} ⭐</span>
                      <span className="text-sm text-[var(--text-muted)]">({staff.totalRatings})</span>
                    </div>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--text-secondary)]">Чайових:</span>
                    <span className="text-green-400 font-bold">{staff.tips}₴</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Tips Stats */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">💰</div>
              <h3 className="text-2xl font-bold text-green-400 mb-1">{data.staff.tipStats.total}₴</h3>
              <p className="text-sm text-[var(--text-secondary)]">Всього чайових</p>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">📊</div>
              <h3 className="text-2xl font-bold text-white mb-1">{data.staff.tipStats.avgPerVisit}₴</h3>
              <p className="text-sm text-[var(--text-secondary)]">Середні чайові за візит</p>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">👑</div>
              <h3 className="text-2xl font-bold text-yellow-400 mb-1">
                {data.staff.tipStats.topStaff[0]?.name || 'N/A'}
              </h3>
              <p className="text-sm text-[var(--text-secondary)]">Топ за чайовими</p>
            </div>
          </div>
        </div>
      )}

      {/* Revenue Tab */}
      {activeTab === 'revenue' && (
        <div className="space-y-6">
          {/* Revenue Chart */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">💰 Динаміка доходів</h3>
            <canvas ref={canvasRef} width={800} height={300} className="w-full"></canvas>
          </div>

          {/* Top Sales */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
            <h3 className="text-xl font-bold text-white mb-4">🏆 Топ продажів</h3>
            <div className="space-y-3">
              {data.revenue.topSales.map((item, index) => (
                <div key={item.item} className="flex items-center justify-between p-3 bg-[var(--bg-tertiary)] rounded-xl">
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold text-green-500">#{index + 1}</span>
                    <div>
                      <h4 className="font-semibold text-white">{item.item}</h4>
                      <p className="text-sm text-[var(--text-secondary)]">{item.orders} замовлень</p>
                    </div>
                  </div>
                  <p className="font-bold text-green-400 text-xl">{item.revenue}₴</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}