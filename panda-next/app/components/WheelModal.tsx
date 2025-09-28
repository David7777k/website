"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface WheelModalProps {
  open: boolean
  onClose: () => void
}

export default function WheelModal({ open, onClose }: WheelModalProps) {
  const { data: session } = useSession()
  const [spinning, setSpinning] = useState(false)
  const [canSpin, setCanSpin] = useState(true)
  const [nextSpinDate, setNextSpinDate] = useState<Date | null>(null)
  const [prize, setPrize] = useState<string | null>(null)

  const prizes = [
    { text: "Знижка 5%\nна кальян", color: "#00A86B", probability: 30 },
    { text: "Знижка 5%\nна кухню", color: "#5DBB63", probability: 25 },
    { text: "Безкоштовний\nчай", color: "#007C51", probability: 20 },
    { text: "Платний трек\nбезкоштовно", color: "#E53935", probability: 15 },
    { text: "Знижка 10%\nна коктейль", color: "#D32F2F", probability: 10 }
  ]

  const handleSpin = async () => {
    if (!session) {
      alert('Потрібно увійти в аккаунт для участі в грі!')
      return
    }

    if (!canSpin) {
      return
    }

    setSpinning(true)
    
    // Simulate API call
    setTimeout(() => {
      const randomPrize = getRandomPrize()
      setPrize(randomPrize)
      setCanSpin(false)
      setNextSpinDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) // 7 days
      setSpinning(false)
    }, 3000)
  }

  const getRandomPrize = () => {
    const random = Math.random() * 100
    let accumulated = 0
    
    for (const prize of prizes) {
      accumulated += prize.probability
      if (random <= accumulated) {
        return prize.text
      }
    }
    
    return prizes[0].text // fallback
  }

  const formatTimeUntilNextSpin = () => {
    if (!nextSpinDate) return ''
    
    const now = new Date()
    const diff = nextSpinDate.getTime() - now.getTime()
    
    if (diff <= 0) {
      return 'Можна крутити!'
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
    return `${days}д ${hours}г ${minutes}хв`
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--bg)] border border-subtle rounded-3xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold gradient-text-bamboo">🎡 Колесо фортуни</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-panel border border-subtle hover:bg-glass transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Wheel */}
          <div className="relative">
            <div className={`w-64 h-64 mx-auto rounded-full border-8 border-bamboo relative overflow-hidden ${spinning ? 'animate-spin' : ''}`}
                 style={{ animationDuration: spinning ? '3s' : '0s' }}>
              {prizes.map((prize, index) => {
                const angle = (360 / prizes.length) * index
                return (
                  <div
                    key={index}
                    className="absolute w-1/2 h-1/2 origin-bottom-right transform"
                    style={{
                      backgroundColor: prize.color,
                      transform: `rotate(${angle}deg)`,
                      clipPath: `polygon(0 0, 100% 0, 100% 100%)`
                    }}
                  >
                    <div className="absolute top-4 left-4 text-xs font-bold text-center text-white transform -rotate-45 w-16">
                      {prize.text.split('\n').map((line, i) => (
                        <div key={i}>{line}</div>
                      ))}
                    </div>
                  </div>
                )
              })}
              
              {/* Center circle */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white rounded-full flex items-center justify-center text-2xl">
                🐼
              </div>
            </div>

            {/* Pointer */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-b-8 border-l-transparent border-r-transparent border-b-accent"></div>
          </div>

          {/* Status */}
          {!session ? (
            <div className="text-center p-4 bg-accent/20 rounded-2xl">
              <p className="text-accent font-semibold mb-3">Увійдіть для участі в грі</p>
              <button className="btn btn-primary">
                Увійти через Google
              </button>
            </div>
          ) : !canSpin ? (
            <div className="text-center p-4 bg-muted/20 rounded-2xl">
              <p className="text-muted font-semibold mb-2">Наступне обертання через:</p>
              <p className="text-xl font-bold text-bamboo">{formatTimeUntilNextSpin()}</p>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={handleSpin}
                disabled={spinning}
                className={`btn btn-primary text-lg py-4 px-8 ${spinning ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {spinning ? 'Крутимо...' : '🎡 Крутити колесо'}
              </button>
            </div>
          )}

          {/* Prize */}
          {prize && (
            <div className="card pattern-bamboo text-center">
              <div className="text-4xl mb-3">🎉</div>
              <h3 className="text-xl font-bold mb-2">Вітаємо!</h3>
              <p className="text-bamboo font-semibold mb-4">{prize}</p>
              <p className="text-text-secondary text-sm">
                Купон буде доступний в вашому профілі протягом 7 днів
              </p>
            </div>
          )}

          {/* Rules */}
          <div className="space-y-3">
            <h4 className="font-semibold text-bamboo">Правила:</h4>
            <ul className="text-sm text-text-secondary space-y-1">
              <li>• Одне обертання раз на 7 днів</li>
              <li>• Необхідна аутентифікація через Google</li>
              <li>• Виграні купони діють 7 днів</li>
              <li>• Системи захисту від зловживань</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}