"use client"
import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import QRScanner from './QRScanner'
import StaffRating from './StaffRating'

interface VisitConfirmationProps {
  onComplete?: () => void
}

export default function VisitConfirmation({ onComplete }: VisitConfirmationProps) {
  const { data: session } = useSession()
  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [visitData, setVisitData] = useState<any>(null)
  const [showScanner, setShowScanner] = useState(false)
  const [loading, setLoading] = useState(false)

  // Step 1: Scan QR
  const handleQRScan = async (qrData: string) => {
    setShowScanner(false)
    setLoading(true)

    try {
      const response = await fetch('/api/visits/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ qrCode: qrData })
      })

      if (response.ok) {
        const data = await response.json()
        setVisitData(data)
        setStep(2)
      } else {
        alert('Невірний QR-код або візит вже підтверджено')
      }
    } catch (error) {
      console.error('Error validating QR:', error)
      alert('Помилка перевірки QR-коду')
    } finally {
      setLoading(false)
    }
  }

  // Step 2: Confirm Visit
  const confirmVisit = async () => {
    setLoading(true)

    try {
      const response = await fetch('/api/visits/confirm', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          visitId: visitData.id,
          tableNumber: visitData.tableNumber
        })
      })

      if (response.ok) {
        setStep(3)
      } else {
        alert('Помилка підтвердження візиту')
      }
    } catch (error) {
      console.error('Error confirming visit:', error)
      alert('Помилка підтвердження візиту')
    } finally {
      setLoading(false)
    }
  }

  // Step 3: Rate Staff
  const handleRatingSubmit = async (ratings: { service: number; friendliness: number; tip?: number }) => {
    setLoading(true)

    try {
      const response = await fetch('/api/staff/rate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          visitId: visitData.id,
          staffId: visitData.staffId,
          serviceRating: ratings.service,
          friendlinessRating: ratings.friendliness,
          tipAmount: ratings.tip || 0
        })
      })

      if (response.ok) {
        const avgRating = (ratings.service + ratings.friendliness) / 2
        if (avgRating >= 4) {
          setStep(4) // Wheel spin
        } else {
          completeProcess()
        }
      }
    } catch (error) {
      console.error('Error submitting rating:', error)
      alert('Помилка відправки оцінки')
    } finally {
      setLoading(false)
    }
  }

  // Step 4: Wheel Spin (handled by parent or modal)
  const completeProcess = () => {
    if (onComplete) {
      onComplete()
    }
  }

  if (!session) {
    return (
      <div className="max-w-md mx-auto text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-2xl font-bold text-white mb-2">Увійдіть в систему</h3>
        <p className="text-[var(--text-secondary)] mb-6">
          Для підтвердження візиту потрібна авторизація
        </p>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Progress Steps */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          {[
            { num: 1, label: 'QR-сканування', icon: '📱' },
            { num: 2, label: 'Підтвердження', icon: '✅' },
            { num: 3, label: 'Оцінка', icon: '⭐' },
            { num: 4, label: 'Бонус', icon: '🎁' }
          ].map((s, index) => (
            <React.Fragment key={s.num}>
              <div className="flex flex-col items-center">
                <div
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold transition-all ${
                    step >= s.num
                      ? 'bg-green-600 text-white'
                      : 'bg-[var(--bg-tertiary)] text-[var(--text-muted)]'
                  }`}
                >
                  {step > s.num ? '✓' : s.icon}
                </div>
                <p className={`text-xs mt-2 ${step >= s.num ? 'text-white' : 'text-[var(--text-muted)]'}`}>
                  {s.label}
                </p>
              </div>
              {index < 3 && (
                <div className="flex-1 h-1 mx-2">
                  <div
                    className={`h-full rounded transition-all ${
                      step > s.num ? 'bg-green-600' : 'bg-[var(--bg-tertiary)]'
                    }`}
                  ></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Step Content */}
      {step === 1 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-8 text-center space-y-6">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-3xl font-bold text-white mb-2">Відскануйте QR-код</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Покажіть QR-код зі столика персоналу для підтвердження візиту
          </p>
          <button
            onClick={() => setShowScanner(true)}
            disabled={loading}
            className="px-8 py-4 bg-green-600 text-white rounded-2xl hover:bg-green-700 disabled:opacity-50 transition-colors font-semibold text-lg"
          >
            {loading ? 'Завантаження...' : '📷 Сканувати QR-код'}
          </button>

          <div className="pt-6 border-t border-[var(--border-primary)]">
            <p className="text-sm text-[var(--text-muted)] mb-3">
              QR-код знаходиться на вашому столику
            </p>
          </div>
        </div>
      )}

      {step === 2 && visitData && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-8 space-y-6">
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-3xl font-bold text-white mb-2">Підтвердіть візит</h2>
          </div>

          {/* Visit Details */}
          <div className="bg-[var(--bg-tertiary)] rounded-2xl p-6 space-y-3">
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Столик:</span>
              <span className="text-white font-semibold">№{visitData.tableNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Час візиту:</span>
              <span className="text-white font-semibold">
                {new Date(visitData.timestamp).toLocaleString('uk-UA')}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-secondary)]">Персонал:</span>
              <span className="text-white font-semibold">{visitData.staffName}</span>
            </div>
          </div>

          {/* Bonus Info */}
          <div className="bg-green-600/20 border border-green-600/50 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🎁</span>
              <div>
                <p className="text-green-400 font-semibold">Бонус за візит</p>
                <p className="text-sm text-[var(--text-secondary)]">
                  Підтвердіть візит та оцініть персонал, щоб отримати бонуси
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={() => setStep(1)}
              className="flex-1 px-6 py-4 bg-[var(--bg-tertiary)] text-white rounded-xl hover:bg-[var(--bg-hover)] transition-colors"
            >
              ← Назад
            </button>
            <button
              onClick={confirmVisit}
              disabled={loading}
              className="flex-1 px-6 py-4 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 transition-colors font-semibold"
            >
              {loading ? 'Завантаження...' : 'Підтвердити візит →'}
            </button>
          </div>
        </div>
      )}

      {step === 3 && visitData && (
        <StaffRating
          staffId={visitData.staffId}
          staffName={visitData.staffName}
          onSubmit={handleRatingSubmit}
          onSkip={() => setStep(4)}
        />
      )}

      {step === 4 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-8 text-center space-y-6">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold text-white mb-2">Дякуємо!</h2>
          <p className="text-[var(--text-secondary)] mb-6">
            Візит підтверджено! Крутіть колесо фортуни, щоб отримати приз!
          </p>

          <div className="space-y-3">
            <button
              onClick={completeProcess}
              className="w-full px-8 py-4 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-2xl hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 font-semibold text-lg"
            >
              🎡 Крутити колесо фортуни
            </button>
            <button
              onClick={completeProcess}
              className="w-full px-6 py-3 bg-[var(--bg-tertiary)] text-white rounded-xl hover:bg-[var(--bg-hover)] transition-colors"
            >
              Пропустити
            </button>
          </div>
        </div>
      )}

      {/* QR Scanner Modal */}
      {showScanner && (
        <QRScanner
          onScan={handleQRScan}
          onClose={() => setShowScanner(false)}
          title="Сканувати QR столика"
        />
      )}
    </div>
  )
}