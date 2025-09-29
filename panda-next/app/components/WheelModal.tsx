"use client"
import React, { useState, useEffect } from 'react'

interface WheelModalProps {
  open: boolean
  onClose: () => void
}

export default function WheelModal({ open, onClose }: WheelModalProps) {
  const [spinning, setSpinning] = useState(false)
  const [canSpin, setCanSpin] = useState(true)
  const [nextSpinDate, setNextSpinDate] = useState<Date | null>(null)
  const [prize, setPrize] = useState<string | null>(null)
  const [rotation, setRotation] = useState(0)

  // Mock user session - replace with real auth later
  const mockUser = { name: 'Demo User', authenticated: true }

  const prizes = [
    { text: "Знижка 10%\nна кальян", color: "#00A86B", probability: 25, icon: "🫧" },
    { text: "Знижка 15%\nна кухню", color: "#5DBB63", probability: 20, icon: "🍽️" },
    { text: "Безкоштовний\nчай преміум", color: "#007C51", probability: 20, icon: "🍵" },
    { text: "Трек\nбезкоштовно", color: "#E53935", probability: 15, icon: "🎵" },
    { text: "Коктейль\n-20%", color: "#D32F2F", probability: 10, icon: "🍹" },
    { text: "Комбо\n-25%", color: "#FF6B35", probability: 8, icon: "🎁" },
    { text: "VIP стіл\nна годину", color: "#9C27B0", probability: 2, icon: "👑" }
  ]

  const handleSpin = async () => {
    if (!mockUser.authenticated) {
      alert('Потрібно увійти в аккаунт для участі в грі!')
      return
    }

    if (!canSpin) {
      return
    }

    setSpinning(true)
    
    // Random rotation (3-5 full spins + random position)
    const spins = 3 + Math.random() * 2
    const finalRotation = rotation + (spins * 360) + Math.random() * 360
    setRotation(finalRotation)
    
    // Determine prize after spin
    setTimeout(() => {
      const randomPrize = getRandomPrize()
      setPrize(randomPrize)
      setCanSpin(false)
      setNextSpinDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)) // 7 days
      setSpinning(false)
    }, 4000) // Longer spin time for better effect
  }

  const getRandomPrize = () => {
    const random = Math.random() * 100
    let accumulated = 0
    
    for (const prize of prizes) {
      accumulated += prize.probability
      if (random <= accumulated) {
        return prize
      }
    }
    
    return prizes[0] // fallback
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--bg)] border border-subtle rounded-3xl max-w-2xl w-full max-h-[95vh] overflow-y-auto shadow-2xl">
        <div className="p-8 space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <h2 className="text-3xl font-black gradient-text-bamboo">🎰 Колесо Фортуни</h2>
              <p className="text-text-secondary">Крутіть та вигравайте неймовірні призи!</p>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-2xl bg-panel border border-subtle hover:bg-glass transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Enhanced Wheel */}
          <div className="relative flex justify-center">
            <div className="relative">
              {/* Outer glow */}
              <div className="absolute inset-0 w-80 h-80 rounded-full bg-gradient-to-br from-bamboo/30 to-bamboo-light/30 blur-2xl animate-pulse"></div>
              
              {/* Main wheel */}
              <div 
                className="relative w-80 h-80 rounded-full border-8 border-gradient-to-br from-bamboo to-bamboo-light shadow-2xl overflow-hidden transition-transform duration-4000 ease-out"
                style={{ 
                  transform: `rotate(${rotation}deg)`,
                  background: 'conic-gradient(from 0deg, #00A86B, #5DBB63, #007C51, #E53935, #D32F2F, #FF6B35, #9C27B0)'
                }}
              >
                {prizes.map((prize, index) => {
                  const angle = (360 / prizes.length) * index
                  const nextAngle = (360 / prizes.length) * (index + 1)
                  
                  return (
                    <div
                      key={index}
                      className="absolute w-1/2 h-1/2 origin-bottom-right transform flex items-center justify-center"
                      style={{
                        backgroundColor: prize.color,
                        transform: `rotate(${angle}deg)`,
                        clipPath: `polygon(0 0, 100% 0, ${100 * Math.cos((nextAngle - angle) * Math.PI / 180)}% ${100 * Math.sin((nextAngle - angle) * Math.PI / 180)}%)`
                      }}
                    >
                      <div className="absolute top-8 left-8 text-center transform -rotate-45 w-20 text-white">
                        <div className="text-2xl mb-1">{prize.icon}</div>
                        <div className="text-xs font-bold leading-tight">
                          {prize.text.split('\n').map((line, i) => (
                            <div key={i}>{line}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )
                })}
                
                {/* Center circle with logo */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border-4 border-bamboo">
                  <div className="text-3xl">🐼</div>
                </div>
              </div>

              {/* Pointer */}
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <div className="w-8 h-8 bg-accent rotate-45 shadow-lg"></div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-white rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Status */}
          {!mockUser.authenticated ? (
            <div className="text-center p-6 bg-accent/20 rounded-2xl">
              <div className="text-4xl mb-3">🔒</div>
              <p className="text-accent font-semibold mb-4">Увійдіть для участі в грі</p>
              <button className="btn btn-primary">
                🚪 Увійти через Google
              </button>
            </div>
          ) : !canSpin ? (
            <div className="text-center p-6 bg-muted/20 rounded-2xl">
              <div className="text-4xl mb-3">⏰</div>
              <p className="text-muted font-semibold mb-2">Наступне обертання через:</p>
              <p className="text-2xl font-bold text-bamboo">{formatTimeUntilNextSpin()}</p>
              <p className="text-sm text-text-secondary mt-2">Колесо можна крутити раз на тиждень</p>
            </div>
          ) : (
            <div className="text-center space-y-4">
              <div className="text-4xl mb-2">✨</div>
              <button
                onClick={handleSpin}
                disabled={spinning}
                className={`btn btn-primary text-xl py-6 px-12 rounded-2xl transform transition-all duration-300 ${
                  spinning 
                    ? 'opacity-50 cursor-not-allowed scale-95' 
                    : 'hover:scale-105 shadow-2xl hover:shadow-bamboo/20'
                }`}
              >
                {spinning ? (
                  <span className="flex items-center gap-3">
                    <div className="animate-spin w-6 h-6 border-2 border-white border-t-transparent rounded-full"></div>
                    Крутимо колесо...
                  </span>
                ) : (
                  '🎰 КРУТИТИ КОЛЕСО'
                )}
              </button>
              <p className="text-sm text-text-secondary">Удача в ваших руках!</p>
            </div>
          )}

          {/* Prize display */}
          {prize && (
            <div className="card pattern-bamboo text-center relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-bamboo/10 to-transparent"></div>
              <div className="relative z-10 space-y-4">
                <div className="text-6xl animate-bounce">{typeof prize === 'object' ? prize.icon : '🎉'}</div>
                <h3 className="text-2xl font-bold">🎉 ВІТАЄМО! 🎉</h3>
                <div className="bg-white/10 p-4 rounded-2xl">
                  <p className="text-bamboo font-bold text-xl">
                    {typeof prize === 'object' ? prize.text : prize}
                  </p>
                </div>
                <p className="text-text-secondary text-sm">
                  Купон буде доступний в вашому профілі протягом 7 днів
                </p>
                <button className="btn btn-secondary">
                  📱 Перейти в профіль
                </button>
              </div>
            </div>
          )}

          {/* Prize list */}
          <div className="space-y-4">
            <h4 className="font-bold text-xl text-center gradient-text-bamboo">🏆 Можливі призи:</h4>
            <div className="grid grid-cols-2 gap-3">
              {prizes.map((prize, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-3 p-3 rounded-xl border border-subtle hover:border-bamboo/50 transition-colors"
                  style={{ backgroundColor: `${prize.color}15` }}
                >
                  <div className="text-2xl">{prize.icon}</div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{prize.text.replace('\n', ' ')}</p>
                    <p className="text-xs text-muted">{prize.probability}% шанс</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Rules */}
          <div className="space-y-3 border-t border-subtle pt-6">
            <h4 className="font-semibold text-bamboo flex items-center gap-2">
              📋 Правила гри:
            </h4>
            <ul className="text-sm text-text-secondary space-y-2">
              <li className="flex items-start gap-2">
                <span className="text-bamboo">•</span>
                <span>Одне обертання раз на 7 днів після реєстрації</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bamboo">•</span>
                <span>Виграні купони діють 7 днів з моменту отримання</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bamboo">•</span>
                <span>Системи захисту від зловживань активні 24/7</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-bamboo">•</span>
                <span>Мінімальний вік гравця: 18 років</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  )
}