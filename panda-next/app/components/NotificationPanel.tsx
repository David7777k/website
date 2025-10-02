"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface Notification {
  id: string
  type: 'visit' | 'music' | 'promo' | 'review' | 'tips' | 'wheel' | 'referral' | 'system'
  title: string
  message: string
  timestamp: string
  read: boolean
  priority: 'low' | 'medium' | 'high'
  actionUrl?: string
}

interface NotificationPanelProps {
  isOpen: boolean
  onClose: () => void
}

export default function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  useEffect(() => {
    if (isOpen && session) {
      fetchNotifications()
    }
  }, [isOpen, session])

  const fetchNotifications = async () => {
    try {
      const response = await fetch('/api/notifications')
      if (response.ok) {
        const data = await response.json()
        setNotifications(data.notifications)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setLoading(false)
    }
  }

  const markAsRead = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: 'POST'
      })
      
      if (response.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
        )
      }
    } catch (error) {
      console.error('Error marking notification as read:', error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const response = await fetch('/api/notifications/read-all', {
        method: 'POST'
      })
      
      if (response.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      }
    } catch (error) {
      console.error('Error marking all as read:', error)
    }
  }

  const deleteNotification = async (notificationId: string) => {
    try {
      const response = await fetch(`/api/notifications/${notificationId}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
      }
    } catch (error) {
      console.error('Error deleting notification:', error)
    }
  }

  const getIcon = (type: string) => {
    const icons: Record<string, string> = {
      visit: '📱',
      music: '🎵',
      promo: '🎟️',
      review: '⭐',
      tips: '💰',
      wheel: '🎡',
      referral: '👥',
      system: '⚙️'
    }
    return icons[type] || '📬'
  }

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'border-gray-600',
      medium: 'border-yellow-600',
      high: 'border-red-600'
    }
    return colors[priority] || 'border-gray-600'
  }

  const filteredNotifications = notifications.filter(n =>
    filter === 'all' ? true : !n.read
  )

  const unreadCount = notifications.filter(n => !n.read).length

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
        onClick={onClose}
      ></div>

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-[var(--bg-secondary)] border-l border-[var(--border-primary)] z-50 flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-6 border-b border-[var(--border-primary)]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
              <span>🔔</span> Уведомления
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--bg-hover)] rounded-xl transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Filter Tabs */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-green-600 text-white'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              Всі ({notifications.length})
            </button>
            <button
              onClick={() => setFilter('unread')}
              className={`flex-1 px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'unread'
                  ? 'bg-green-600 text-white'
                  : 'bg-[var(--bg-card)] text-[var(--text-secondary)] hover:text-white'
              }`}
            >
              Непрочитані ({unreadCount})
            </button>
          </div>

          {/* Actions */}
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="mt-3 w-full px-4 py-2 text-sm bg-[var(--bg-card)] text-[var(--text-secondary)] rounded-lg hover:text-white hover:bg-[var(--bg-hover)] transition-colors"
            >
              ✓ Прочитати всі
            </button>
          )}
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin w-8 h-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-[var(--text-secondary)]">
                {filter === 'unread' ? 'Немає непрочитаних уведомлень' : 'Немає уведомлень'}
              </p>
            </div>
          ) : (
            filteredNotifications.map(notification => (
              <div
                key={notification.id}
                className={`bg-[var(--bg-card)] border-l-4 ${getPriorityColor(notification.priority)} rounded-xl p-4 ${
                  !notification.read ? 'bg-opacity-100' : 'bg-opacity-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{getIcon(notification.type)}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="font-semibold text-white truncate">
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0 ml-2"></div>
                      )}
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-2">
                      {notification.message}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-[var(--text-muted)]">
                        {new Date(notification.timestamp).toLocaleString('uk-UA')}
                      </span>
                      <div className="flex gap-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="text-xs text-green-400 hover:text-green-300"
                          >
                            ✓
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="text-xs text-red-400 hover:text-red-300"
                        >
                          🗑️
                        </button>
                      </div>
                    </div>
                    {notification.actionUrl && (
                      <a
                        href={notification.actionUrl}
                        className="mt-2 inline-block text-sm text-green-400 hover:text-green-300"
                      >
                        Переглянути →
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </>
  )
}