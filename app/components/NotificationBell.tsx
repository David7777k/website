"use client"
import React, { useState, useEffect } from 'react'

interface NotificationBellProps {
  onClick: () => void
  unreadCount?: number
}

export default function NotificationBell({ onClick, unreadCount = 0 }: NotificationBellProps) {
  const [showAnimation, setShowAnimation] = useState(false)

  useEffect(() => {
    if (unreadCount > 0) {
      setShowAnimation(true)
      const timer = setTimeout(() => setShowAnimation(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [unreadCount])

  return (
    <button
      onClick={onClick}
      className="relative p-2 hover:bg-[var(--bg-hover)] rounded-xl transition-colors"
    >
      <div className={`text-2xl ${showAnimation ? 'animate-bounce' : ''}`}>
        🔔
      </div>
      {unreadCount > 0 && (
        <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
          <span className="text-xs font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        </div>
      )}
    </button>
  )
}