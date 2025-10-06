"use client"
import React, { useState } from 'react'

interface StaffRatingProps {
  staffId: string
  staffName: string
  onSubmit: (ratings: { service: number; friendliness: number; tip?: number }) => void
  onSkip?: () => void
}

export default function StaffRating({ staffId, staffName, onSubmit, onSkip }: StaffRatingProps) {
  const [serviceRating, setServiceRating] = useState(0)
  const [friendlinessRating, setFriendlinessRating] = useState(0)
  const [hoveredService, setHoveredService] = useState(0)
  const [hoveredFriendliness, setHoveredFriendliness] = useState(0)
  const [showTipModal, setShowTipModal] = useState(false)
  const [tipAmount, setTipAmount] = useState(0)

  const handleSubmit = () => {
    if (serviceRating === 0 || friendlinessRating === 0) {
      alert('Будь ласка, оцініть обслуговування та комунікабельність')
      return
    }

    const avgRating = (serviceRating + friendlinessRating) / 2

    // Offer tip if rating is high
    if (avgRating >= 4) {
      setShowTipModal(true)
    } else {
      onSubmit({ service: serviceRating, friendliness: friendlinessRating })
    }
  }

  const handleTipSubmit = () => {
    onSubmit({
      service: serviceRating,
      friendliness: friendlinessRating,
      tip: tipAmount
    })
  }

  const renderStars = (
    rating: number,
    hovered: number,
    onHover: (val: number) => void,
    onClick: (val: number) => void
  ) => {
    return (
      <div className="flex gap-2 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onMouseEnter={() => onHover(star)}
            onMouseLeave={() => onHover(0)}
            onClick={() => onClick(star)}
            className="text-4xl transition-transform hover:scale-125 focus:outline-none"
          >
            {star <= (hovered || rating) ? '⭐' : '☆'}
          </button>
        ))}
      </div>
    )
  }

  const getEmoji = (rating: number) => {
    if (rating === 0) return '😐'
    if (rating <= 2) return '😞'
    if (rating === 3) return '😊'
    if (rating === 4) return '😄'
    return '🤩'
  }

  if (showTipModal) {
    return (
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-8 max-w-md mx-auto space-y-6">
        {/* Header */}
        <div className="text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h3 className="text-2xl font-bold text-white mb-2">Дякуємо за високу оцінку!</h3>
          <p className="text-[var(--text-secondary)]">
            Бажаєте залишити чайові для <span className="text-green-500 font-semibold">{staffName}</span>?
          </p>
        </div>

        {/* Tip Amount Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-medium text-[var(--text-secondary)]">
            Оберіть суму або введіть свою:
          </label>
          <div className="grid grid-cols-4 gap-2">
            {[50, 100, 200, 500].map((amount) => (
              <button
                key={amount}
                onClick={() => setTipAmount(amount)}
                className={`p-3 rounded-xl font-semibold transition-all ${
                  tipAmount === amount
                    ? 'bg-green-600 text-white'
                    : 'bg-[var(--bg-tertiary)] text-white hover:bg-[var(--bg-hover)]'
                }`}
              >
                {amount}₴
              </button>
            ))}
          </div>
          <input
            type="number"
            value={tipAmount || ''}
            onChange={(e) => setTipAmount(parseInt(e.target.value) || 0)}
            placeholder="Інша сума..."
            className="w-full px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-green-500"
          />
        </div>

        {/* Bonus Info */}
        <div className="bg-green-600/20 border border-green-600/50 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🎁</span>
            <div>
              <p className="text-green-400 font-semibold">Бонус від закладу</p>
              <p className="text-sm text-[var(--text-secondary)]">
                За високу оцінку ми додамо +{Math.floor(tipAmount * 0.1)}₴ від закладу!
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-2">
          <button
            onClick={handleTipSubmit}
            disabled={tipAmount < 10}
            className="w-full px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            {tipAmount > 0 ? `Залишити ${tipAmount}₴ чайових` : 'Оберіть суму'}
          </button>
          <button
            onClick={() => onSubmit({ service: serviceRating, friendliness: friendlinessRating })}
            className="w-full px-6 py-4 bg-[var(--bg-card)] border border-[var(--border-primary)] text-white rounded-xl hover:border-green-500 transition-colors"
          >
            Пропустити чайові
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-8 max-w-md mx-auto space-y-8">
      {/* Header */}
      <div className="text-center">
        <div className="text-5xl mb-3">👤</div>
        <h3 className="text-2xl font-bold text-white mb-2">Оцініть персонал</h3>
        <p className="text-[var(--text-secondary)]">
          Як вам обслуговування від <span className="text-green-500 font-semibold">{staffName}</span>?
        </p>
      </div>

      {/* Service Rating */}
      <div className="space-y-4">
        <div className="text-center">
          <div className="text-4xl mb-2">{getEmoji(hoveredService || serviceRating)}</div>
          <h4 className="text-lg font-semibold text-white mb-3">⭐ Якість обслуговування</h4>
          {renderStars(
            serviceRating,
            hoveredService,
            setHoveredService,
            setServiceRating
          )}
          {serviceRating > 0 && (
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {serviceRating}/5 зірок
            </p>
          )}
        </div>
      </div>

      {/* Friendliness Rating */}
      <div className="space-y-4 border-t border-[var(--border-primary)] pt-6">
        <div className="text-center">
          <div className="text-4xl mb-2">{getEmoji(hoveredFriendliness || friendlinessRating)}</div>
          <h4 className="text-lg font-semibold text-white mb-3">😊 Комунікабельність</h4>
          {renderStars(
            friendlinessRating,
            hoveredFriendliness,
            setHoveredFriendliness,
            setFriendlinessRating
          )}
          {friendlinessRating > 0 && (
            <p className="mt-2 text-sm text-[var(--text-secondary)]">
              {friendlinessRating}/5 зірок
            </p>
          )}
        </div>
      </div>

      {/* Overall Preview */}
      {serviceRating > 0 && friendlinessRating > 0 && (
        <div className="bg-green-600/20 border border-green-600/50 rounded-xl p-4 text-center">
          <p className="text-sm text-[var(--text-secondary)] mb-1">Середня оцінка</p>
          <p className="text-3xl font-bold text-green-400">
            {((serviceRating + friendlinessRating) / 2).toFixed(1)} / 5.0
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-3">
        {onSkip && (
          <button
            onClick={onSkip}
            className="flex-1 px-6 py-4 bg-[var(--bg-tertiary)] text-[var(--text-secondary)] rounded-xl hover:bg-[var(--bg-hover)] transition-colors"
          >
            Пропустити
          </button>
        )}
        <button
          onClick={handleSubmit}
          disabled={serviceRating === 0 || friendlinessRating === 0}
          className="flex-1 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
        >
          Підтвердити оцінку
        </button>
      </div>
    </div>
  )
}