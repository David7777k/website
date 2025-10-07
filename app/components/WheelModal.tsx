'use client'

import React, { useState, useRef, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Trophy, Gift as GiftIcon, Loader2, AlertCircle } from 'lucide-react'
import Button from './ui/Button'
import Badge from './ui/Badge'
import { useSession } from 'next-auth/react'

interface WheelModalProps {
  open: boolean
  onClose: () => void
}

interface Prize {
  id: number
  name: string
  description?: string
  type: string
  value?: number
  color: string
  icon: string
  probability: number
}

interface Coupon {
  code: string
  expiresAt: string
}

// FSM States: LOCKED -> READY -> SPINNING -> RESULT -> COOLDOWN
type WheelState = 'LOCKED' | 'LOADING' | 'READY' | 'SPINNING' | 'RESULT' | 'COOLDOWN' | 'ERROR'

export default function WheelModal({ open, onClose }: WheelModalProps) {
  const { data: session } = useSession()
  const [state, setState] = useState<WheelState>('LOADING')
  const [prizes, setPrizes] = useState<Prize[]>([])
  const [wonPrize, setWonPrize] = useState<Prize | null>(null)
  const [wonCoupon, setWonCoupon] = useState<Coupon | null>(null)
  const [rotation, setRotation] = useState(0)
  const [statusData, setStatusData] = useState<any>(null)
  const [errorMessage, setErrorMessage] = useState<string>('')
  const [isSpinning, setIsSpinning] = useState(false)
  const wheelRef = useRef<HTMLDivElement>(null)
  const spinAttemptRef = useRef(0)

  // Default prizes for display
  const defaultPrizes: Prize[] = [
    { id: 1, name: "Знижка 10% на кальян", color: "#10B981", probability: 25, icon: "💨", type: "discount", value: 10 },
    { id: 2, name: "Знижка 15% на кухню", color: "#3B82F6", probability: 20, icon: "🍽️", type: "discount", value: 15 },
    { id: 3, name: "Безкоштовний чай", color: "#8B5CF6", probability: 20, icon: "🍵", type: "free_item" },
    { id: 4, name: "Трек безкоштовно", color: "#EC4899", probability: 15, icon: "🎵", type: "free_item" },
    { id: 5, name: "Коктейль -20%", color: "#F59E0B", probability: 10, icon: "🍹", type: "discount", value: 20 },
    { id: 6, name: "Комбо -25%", color: "#EF4444", probability: 8, icon: "🎁", type: "discount", value: 25 },
    { id: 7, name: "VIP стіл на годину", color: "#9333EA", probability: 2, icon: "👑", type: "special" }
  ]

  useEffect(() => {
    if (open) {
      // Reset state when modal opens
      setWonPrize(null)
      setWonCoupon(null)
      setIsSpinning(false)
      spinAttemptRef.current = 0
      fetchStatus()
    }
  }, [open])

  const fetchStatus = useCallback(async () => {
    try {
      setState('LOADING')
      setErrorMessage('')
      
      if (!session?.user) {
        setState('LOCKED')
        setErrorMessage('Увійдіть для доступу до колеса фортуни')
        return
      }

      const res = await fetch('/api/wheel/status')
      const data = await res.json()
      
      if (!res.ok) {
        throw new Error(data.message || 'Failed to fetch status')
      }
      
      setStatusData(data)
      setPrizes(defaultPrizes) // Use default prizes for display
      
      // FSM: determine state from server response
      if (data.state === 'LOCKED' || !data.canSpin && data.state === 'COOLDOWN') {
        setState('COOLDOWN')
      } else if (data.canSpin) {
        setState('READY')
      } else {
        setState('COOLDOWN')
      }
    } catch (error: any) {
      console.error('Status fetch error:', error)
      setState('ERROR')
      setErrorMessage(error.message || 'Не вдалося завантажити статус колеса')
    }
  }, [session])

  const handleSpin = useCallback(async () => {
    // FSM: Only allow spin from READY state
    if (state !== 'READY' || isSpinning) {
      console.warn('Cannot spin: invalid state', { state, isSpinning })
      return
    }

    // Prevent multiple simultaneous spins
    const currentAttempt = ++spinAttemptRef.current
    setIsSpinning(true)

    try {
      // FSM: READY -> SPINNING
      setState('SPINNING')
      setWonPrize(null)
      setWonCoupon(null)
      setErrorMessage('')
      
      const res = await fetch('/api/wheel/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      })
      
      const data = await res.json()
      
      // Check if this attempt is still valid (no concurrent spins)
      if (currentAttempt !== spinAttemptRef.current) {
        console.warn('Spin attempt cancelled (concurrent spin detected)')
        return
      }
      
      if (!res.ok || !data.success) {
        // FSM: SPINNING -> ERROR -> COOLDOWN
        setState('ERROR')
        setErrorMessage(data.message || 'Помилка спіну')
        
        // Show error for 3 seconds, then go to cooldown
        setTimeout(() => {
          if (spinAttemptRef.current === currentAttempt) {
            setState('COOLDOWN')
            setIsSpinning(false)
          }
        }, 3000)
        return
      }

      // Find prize in our display list for animation
      const prizeIndex = prizes.findIndex(p => 
        p.name === data.prize.name || 
        p.type === data.prize.type
      )
      
      const targetIndex = prizeIndex >= 0 ? prizeIndex : 0
      const segmentAngle = 360 / prizes.length
      const targetAngle = targetIndex * segmentAngle
      
      // Add multiple full rotations + target angle + random offset
      const spins = 5 + Math.floor(Math.random() * 3) // 5-7 full spins
      const randomOffset = Math.random() * 15 - 7.5 // ±7.5 degrees
      const finalRotation = rotation + (spins * 360) + targetAngle + randomOffset
      
      setRotation(finalRotation)
      
      // FSM: SPINNING -> RESULT (after animation completes)
      setTimeout(() => {
        if (spinAttemptRef.current === currentAttempt) {
          setWonPrize(data.prize)
          setWonCoupon(data.coupon || null)
          setStatusData({
            ...statusData,
            canSpin: false,
            nextSpinDate: data.nextSpinDate,
            state: 'COOLDOWN'
          })
          setState('RESULT')
          setIsSpinning(false)
          
          // Auto transition to COOLDOWN after showing result
          setTimeout(() => {
            if (spinAttemptRef.current === currentAttempt && state === 'RESULT') {
              setState('COOLDOWN')
            }
          }, 8000) // Show result for 8 seconds
        }
      }, 4000) // Animation duration

    } catch (error: any) {
      console.error('Spin error:', error)
      
      if (spinAttemptRef.current === currentAttempt) {
        // FSM: SPINNING -> ERROR -> READY (retry allowed)
        setState('ERROR')
        setErrorMessage(error.message || 'Помилка обертання колеса')
        setIsSpinning(false)
        
        setTimeout(() => {
          if (spinAttemptRef.current === currentAttempt) {
            setState('READY')
          }
        }, 3000)
      }
    }
  }, [state, isSpinning, prizes, rotation, statusData])

  const formatTimeUntilNextSpin = () => {
    if (!statusData?.timeLeft) return ''
    
    const { days, hours, minutes } = statusData.timeLeft
    return `${days}д ${hours}г ${minutes}хв`
  }

  if (!open) return null

  return (
    <AnimatePresence>
      <motion.div 
        className="fixed inset-0 bg-black/80 backdrop-blur-xl z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div 
          className="glass-card max-w-2xl w-full max-h-[95vh] overflow-y-auto relative"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', duration: 0.5 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 md:p-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <motion.div 
                    className="text-4xl"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    🎡
                  </motion.div>
                  <h2 className="text-3xl md:text-4xl font-black text-gradient">
                    Колесо Фортуни
                  </h2>
                </div>
                <p className="text-text-muted">
                  Крутіть колесо та вигравайте призи!
                </p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 rounded-xl bg-surface/80 flex items-center justify-center hover:bg-danger hover:text-white transition-all duration-200"
              >
                <X size={20} />
              </button>
            </div>

            {/* Loading State */}
            {state === 'LOADING' && (
              <div className="text-center py-12">
                <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
                <p className="text-text-muted">Завантаження...</p>
              </div>
            )}

            {/* Error State */}
            {state === 'ERROR' && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚠️</div>
                <p className="text-danger text-lg font-semibold">{errorMessage}</p>
              </div>
            )}

            {/* Wheel Container */}
            {(state === 'READY' || state === 'SPINNING' || state === 'RESULT' || state === 'COOLDOWN') && (
              <>
                <div className="relative flex flex-col items-center gap-8">
                  {/* Pointer */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 z-10 -mt-2">
                    <div className="w-0 h-0 border-l-[20px] border-l-transparent border-r-[20px] border-r-transparent border-t-[30px] border-t-accent shadow-glow" />
                  </div>

                  {/* Wheel */}
                  <div className="relative">
                    {/* Glow Effect */}
                    <motion.div 
                      className="absolute inset-0 w-80 h-80 md:w-96 md:h-96 rounded-full bg-accent/20 blur-3xl"
                      animate={{ 
                        scale: state === 'SPINNING' ? [1, 1.2, 1] : 1,
                        opacity: state === 'SPINNING' ? [0.3, 0.6, 0.3] : 0.3
                      }}
                      transition={{ duration: 1, repeat: state === 'SPINNING' ? Infinity : 0 }}
                    />
                    
                    {/* Main Wheel */}
                    <motion.div 
                      ref={wheelRef}
                      className={`relative w-80 h-80 md:w-96 md:h-96 rounded-full border-8 ${
                        state === 'COOLDOWN' ? 'border-gray-600' : 'border-accent'
                      } shadow-glow-strong overflow-hidden ${
                        state === 'COOLDOWN' ? 'opacity-50 grayscale' : ''
                      }`}
                      style={{ 
                        transition: state === 'SPINNING' ? 'transform 4s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
                        transform: `rotate(${rotation}deg)`
                      }}
                    >
                      {prizes.map((prize, index) => {
                        const segmentAngle = 360 / prizes.length
                        const startAngle = index * segmentAngle
                        
                        return (
                          <div
                            key={prize.id}
                            className="absolute top-1/2 left-1/2 origin-top-left"
                            style={{
                              width: '50%',
                              height: '50%',
                              transform: `rotate(${startAngle}deg)`,
                              transformOrigin: '0% 0%'
                            }}
                          >
                            <div 
                              className="w-full h-full flex items-start justify-center pt-8"
                              style={{
                                background: `linear-gradient(135deg, ${prize.color} 0%, ${prize.color}dd 100%)`,
                                clipPath: `polygon(0 0, 100% 0, 50% 100%)`
                              }}
                            >
                              <div 
                                className="text-center text-white transform"
                                style={{ transform: `rotate(${segmentAngle / 2}deg)` }}
                              >
                                <div className="text-3xl mb-1">{prize.icon}</div>
                                <div className="text-xs font-bold px-2 leading-tight">
                                  {prize.name}
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                      
                      {/* Center Logo */}
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-base rounded-full flex items-center justify-center shadow-lg border-4 border-accent z-10">
                        <motion.div 
                          className="text-4xl"
                          animate={state === 'SPINNING' ? { rotate: 360 } : {}}
                          transition={{ duration: 1, repeat: state === 'SPINNING' ? Infinity : 0, ease: 'linear' }}
                        >
                          🐼
                        </motion.div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Spin Button */}
                  <div className="space-y-4 text-center">
                    {state === 'READY' && (
                      <>
                        <Button 
                          variant="primary" 
                          onClick={handleSpin}
                          className="text-lg px-12 py-4 shadow-glow-strong"
                        >
                          <Sparkles size={20} />
                          Крутити колесо
                        </Button>
                        <Badge variant="accent">
                          <Trophy size={14} />
                          Безкоштовний спін доступний
                        </Badge>
                      </>
                    )}
                    
                    {state === 'SPINNING' && (
                      <>
                        <Button 
                          variant="primary" 
                          disabled
                          className="text-lg px-12 py-4"
                        >
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                            className="inline-block"
                          >
                            🎰
                          </motion.div>
                          <span className="ml-2">Крутимо...</span>
                        </Button>
                      </>
                    )}
                    
                    {state === 'COOLDOWN' && (
                      <>
                        <Button 
                          variant="secondary" 
                          disabled
                          className="text-lg px-12 py-4"
                        >
                          Колесо заблоковано
                        </Button>
                        <Badge variant="warn">
                          Наступний спін через: {formatTimeUntilNextSpin()}
                        </Badge>
                      </>
                    )}
                  </div>
                </div>

                {/* Prize Result */}
                <AnimatePresence>
                  {state === 'RESULT' && wonPrize && (
                    <motion.div
                      className="glass-card p-6 text-center relative overflow-hidden"
                      initial={{ scale: 0.8, opacity: 0, y: 20 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      exit={{ scale: 0.8, opacity: 0, y: 20 }}
                      transition={{ type: 'spring', duration: 0.6 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-transparent" />
                      <div className="relative space-y-4">
                        <motion.div 
                          className="text-6xl"
                          animate={{ 
                            scale: [1, 1.2, 1],
                            rotate: [0, 10, -10, 0]
                          }}
                          transition={{ duration: 0.6 }}
                        >
                          {wonPrize.icon}
                        </motion.div>
                        <div>
                          <h3 className="text-2xl font-bold text-accent mb-2">
                            🎉 Вітаємо!
                          </h3>
                          <p className="text-xl font-semibold">
                            Ви виграли: {wonPrize.name}
                          </p>
                          {wonPrize.description && (
                            <p className="text-sm text-text-muted mt-2">
                              {wonPrize.description}
                            </p>
                          )}
                        </div>
                        <Button 
                          variant="primary" 
                          className="mt-4"
                          onClick={onClose}
                        >
                          <GiftIcon size={18} />
                          Переглянути в профілі
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Rules */}
                <div className="glass-card p-6 space-y-3">
                  <h4 className="font-bold text-accent flex items-center gap-2">
                    <Sparkles size={18} />
                    Правила гри
                  </h4>
                  <ul className="text-sm text-text-muted space-y-2">
                    <li>✓ Безкоштовне обертання раз на 7 днів</li>
                    <li>✓ Призи діють протягом 7 днів</li>
                    <li>✓ Один приз можна використати один раз</li>
                    <li>✓ Накопичені призи в розділі "Бонуси"</li>
                  </ul>
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}