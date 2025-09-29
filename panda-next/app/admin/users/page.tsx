'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'

interface User {
  id: string
  name?: string
  email?: string
  role: string
  risk_score: number
  is_blocked: boolean
  created_at: string
  last_login?: string
  metrics: {
    totalSpent: number
    confirmedVisits: number
    activeCoupons: number
    lastVisit?: string
    avgOrderValue: number
  }
  _count: {
    visits: number
    wheel_spins: number
    coupons: number
    tips: number
    music_orders: number
  }
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    search: '',
    role: 'all',
    riskLevel: '',
    page: 1
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  })

  useEffect(() => {
    fetchUsers()
  }, [filters])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: filters.page.toString(),
        limit: '20',
        ...(filters.search && { search: filters.search }),
        ...(filters.role !== 'all' && { role: filters.role }),
        ...(filters.riskLevel && { riskLevel: filters.riskLevel })
      })

      const response = await fetch(`/api/admin/users?${params}`)
      if (response.ok) {
        const data = await response.json()
        setUsers(data.users)
        setPagination(data.pagination)
      }
    } catch (error) {
      console.error('Error fetching users:', error)
    } finally {
      setLoading(false)
    }
  }

  const getRiskLevelColor = (score: number) => {
    if (score < 5) return 'text-green-400'
    if (score < 10) return 'text-yellow-400'
    return 'text-red-400'
  }

  const getRiskLevelLabel = (score: number) => {
    if (score < 5) return 'Низький'
    if (score < 10) return 'Середній'
    return 'Високий'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('uk-UA', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatCurrency = (amount: number) => {
    return `${amount.toLocaleString()} ₴`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">👥 Управління користувачами</h1>
          <p className="text-gray-400 mt-2">Переглядайте та керуйте користувачами системи</p>
        </div>
        <div className="flex gap-3">
          <Link
            href="/admin/users/risk-board"
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
          >
            🚨 Risk-доска
          </Link>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            + Додати користувача
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Пошук</label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value, page: 1 }))}
              placeholder="Ім'я, email, телефон..."
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Роль</label>
            <select
              value={filters.role}
              onChange={(e) => setFilters(prev => ({ ...prev, role: e.target.value, page: 1 }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="all">Все ролі</option>
              <option value="guest">Гости</option>
              <option value="staff">Персонал</option>
              <option value="admin">Адміни</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Риск-рівень</label>
            <select
              value={filters.riskLevel}
              onChange={(e) => setFilters(prev => ({ ...prev, riskLevel: e.target.value, page: 1 }))}
              className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
            >
              <option value="">Всі рівні</option>
              <option value="low">Низький (< 5)</option>
              <option value="medium">Середній (5-9)</option>
              <option value="high">Високий (≥ 10)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Сортування</label>
            <select className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white">
              <option value="created_at">За датою реєстрації</option>
              <option value="last_login">За останнім входом</option>
              <option value="risk_score">За риск-скором</option>
              <option value="total_spent">За витратами</option>
            </select>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">👥</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{pagination.total}</p>
              <p className="text-sm text-gray-400">Всього користувачів</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-green-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{users.filter(u => u.risk_score < 5).length}</p>
              <p className="text-sm text-gray-400">Низький ризик</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">⚠️</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{users.filter(u => u.risk_score >= 5 && u.risk_score < 10).length}</p>
              <p className="text-sm text-gray-400">Середній ризик</p>
            </div>
          </div>
        </div>
        <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center">
              <span className="text-2xl">🚨</span>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">{users.filter(u => u.risk_score >= 10).length}</p>
              <p className="text-sm text-gray-400">Високий ризик</p>
            </div>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-gray-800 rounded-2xl border border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-900 border-b border-gray-700">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Користувач</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Роль</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Ризик</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Активність</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Витрати</th>
                <th className="px-6 py-4 text-left text-sm font-medium text-gray-300">Дії</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-gray-400">
                    Користувачі не знайдені
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="hover:bg-gray-700/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-600 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-white">
                            {user.name ? user.name.charAt(0).toUpperCase() : '?'}
                          </span>
                        </div>
                        <div>
                          <p className="text-white font-medium">{user.name || 'Без імені'}</p>
                          <p className="text-sm text-gray-400">{user.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        user.role === 'admin' ? 'bg-purple-600 text-white' :
                        user.role === 'staff' ? 'bg-blue-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {user.role === 'admin' ? 'Адмін' : 
                         user.role === 'staff' ? 'Персонал' : 'Гість'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${getRiskLevelColor(user.risk_score)}`}>
                          {user.risk_score}
                        </span>
                        <span className="text-sm text-gray-400">
                          ({getRiskLevelLabel(user.risk_score)})
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-white">{user.metrics.confirmedVisits} візитів</p>
                        <p className="text-gray-400">{user._count.wheel_spins} прокруток</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm">
                        <p className="text-white font-medium">{formatCurrency(user.metrics.totalSpent)}</p>
                        <p className="text-gray-400">
                          Сер. чек: {formatCurrency(user.metrics.avgOrderValue)}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/admin/users/${user.id}`}
                          className="text-blue-400 hover:text-blue-300 text-sm"
                        >
                          Детали
                        </Link>
                        {user.is_blocked ? (
                          <button className="text-green-400 hover:text-green-300 text-sm">
                            Розблокувати
                          </button>
                        ) : (
                          <button className="text-red-400 hover:text-red-300 text-sm">
                            Блокувати
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="px-6 py-4 border-t border-gray-700 flex items-center justify-between">
            <div className="text-sm text-gray-400">
              Показано {(pagination.page - 1) * pagination.limit + 1}-{Math.min(pagination.page * pagination.limit, pagination.total)} з {pagination.total}
            </div>
            <div className="flex gap-2">
              <button
                disabled={pagination.page === 1}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page - 1 }))}
                className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50"
              >
                Попередня
              </button>
              <button
                disabled={pagination.page === pagination.pages}
                onClick={() => setFilters(prev => ({ ...prev, page: prev.page + 1 }))}
                className="px-3 py-1 text-sm bg-gray-700 text-gray-300 rounded hover:bg-gray-600 disabled:opacity-50"
              >
                Наступна
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}