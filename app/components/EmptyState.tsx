'use client'

import React from 'react'
import Link from 'next/link'
import { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon?: LucideIcon
  emoji?: string
  title: string
  description?: string
  action?: {
    label: string
    href?: string
    onClick?: () => void
  }
  className?: string
}

export default function EmptyState({
  icon: Icon,
  emoji,
  title,
  description,
  action,
  className = ''
}: EmptyStateProps) {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      {/* Icon or Emoji */}
      <div className="mb-6">
        {Icon ? (
          <Icon className="w-20 h-20 text-text-muted opacity-50" strokeWidth={1.5} />
        ) : emoji ? (
          <div className="text-7xl opacity-50">{emoji}</div>
        ) : (
          <div className="w-20 h-20 rounded-full bg-surface border-2 border-dashed border-gray-700 flex items-center justify-center">
            <span className="text-3xl opacity-50">∅</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-2xl font-bold text-text mb-3">
        {title}
      </h3>

      {/* Description */}
      {description && (
        <p className="text-text-muted max-w-md mb-6">
          {description}
        </p>
      )}

      {/* Action */}
      {action && (
        <>
          {action.href ? (
            <Link
              href={action.href}
              className="btn-primary"
            >
              {action.label}
            </Link>
          ) : action.onClick ? (
            <button
              onClick={action.onClick}
              className="btn-primary"
            >
              {action.label}
            </button>
          ) : null}
        </>
      )}
    </div>
  )
}

// Preset empty states for common scenarios
export const EmptyVisits = () => (
  <EmptyState
    emoji="📅"
    title="Ще немає візитів"
    description="Ваші візити з'являться тут після першого відвідування PANDA Lounge"
    action={{
      label: "Забронювати столик",
      href: "/bookings"
    }}
  />
)

export const EmptyBonuses = () => (
  <EmptyState
    emoji="🎁"
    title="Немає активних бонусів"
    description="Почніть відвідувати нас та крутити колесо фортуни, щоб отримати бонуси!"
    action={{
      label: "Крутити колесо",
      href: "/#wheel"
    }}
  />
)

export const EmptyEvents = () => (
  <EmptyState
    emoji="📅"
    title="Немає майбутніх подій"
    description="Стежте за нашими соціальними мережами, щоб дізнатися про нові події"
  />
)

export const EmptyMenu = () => (
  <EmptyState
    emoji="🍽️"
    title="Меню завантажується"
    description="Зачекайте, будь ласка, ми готуємо для вас меню..."
  />
)

export const EmptySearch = () => (
  <EmptyState
    emoji="🔍"
    title="Нічого не знайдено"
    description="Спробуйте змінити параметри пошуку або фільтри"
  />
)

export const EmptyNotifications = () => (
  <EmptyState
    emoji="🔔"
    title="Немає сповіщень"
    description="Ви впорались! Всі сповіщення прочитані."
  />
)

export const EmptyPlaylist = () => (
  <EmptyState
    emoji="🎵"
    title="Плейлист порожній"
    description="Замовте першу пісню та насолоджуйтесь музикою!"
    action={{
      label: "Замовити пісню",
      href: "/music"
    }}
  />
)
