'use client'

import React, { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Sparkles, Trophy, Gift as GiftIcon } from 'lucide-react'
import Button from './ui/Button'
import Badge from './ui/Badge'

interface WheelModalProps {
  open: boolean
  onClose: () => void
}

interface Prize {
  text: string
  color: string
  probability: number
  icon: string
  id: number
}

export default function WheelModal({ open, onClose }: WheelModalProps) {
  const [spinning, setSpinning] = useState(false)
  const [canSpin, setCanSpin] = useState(true)
  const [nextSpinDate, setNextSpinDate] = useState<Date | null>(null)
  const [wonPrize, setWonPrize] = useState<Prize | null>(null)
  const [rotation, setRotation] = useState(0)
  const wheelRef = useRef<HTMLDivElement>(null)

  const prizes: Prize[] = [
    { id: 0, text: "Знижка 10% на кальян", color: "#10B981", probability: 25, icon: "💨" },
    { id: 1, text: "Знижка 15% на кухню", color: "#3B82F6", probability: 20, icon: "🍽️" },
    { id: 2, text: "Безкоштовний чай", color: "#8B5CF6", probability: 20, icon: "🍵" },
    { id: 3, text: "Трек безкоштовно", color: "#EC4899", probability: 15, icon: "🎵" },
    { id: 4, text: "Коктейль -20%", color: "#F59E0B", probability: 10, icon: "🍹" },
    { id: 5, text: "Комбо -25%", color: "#EF4444", probability: 8, icon: "🎁" },
    { id: 6, text: "VIP стіл на годину", color: "#9333EA", probability: 2, icon: "👑" }
  ]

  const handleSpin = async () => {
    if (!canSpin || spinning) return

    setSpinning(true)
    setWonPrize(null)
    
    // Get random prize based on probability
    const wonPrizeResult = getRandomPrize()
    
    // Calculate rotation to land on won prize
    const segmentAngle = 360 / prizes.length
    const prizeIndex = prizes.findIndex(p => p.id === wonPrizeResult.id)
    const targetAngle = prizeIndex * segmentAngle
    
    // Add multiple full rotations + target angle
    const spins = 5 + Math.floor(Math.random() * 3) // 5-7 full spins
    const finalRotation = rotation + (spins * 360) + targetAngle
    
    setRotation(finalRotation)
    
    // Show prize after spin completes
    setTimeout(() => {
      setWonPrize(wonPrizeResult)
      setCanSpin(false)
      setNextSpinDate(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000))
      setSpinning(false)
    }, 4000)
  }

  const getRandomPrize = (): Prize => {
    const random = Math.random() * 100
    let accumulated = 0
    
    for (const prize of prizes) {
      accumulated += prize.probability
      if (random <= accumulated) {
        return prize
      }
    }
    
    return prizes[0]
  }

  const formatTimeUntilNextSpin = () => {
    if (!nextSpinDate) return ''
    
    const now = new Date()
    const diff = nextSpinDate.getTime() - now.getTime()
    
    if (diff <= 0) {
      setCanSpin(true)
      return 'Можна крутити!'
    }
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
    
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

            {/* Wheel Container */}
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
                    scale: spinning ? [1, 1.2, 1] : 1,
                    opacity: spinning ? [0.3, 0.6, 0.3] : 0.3
                  }}
                  transition={{ duration: 1, repeat: spinning ? Infinity : 0 }}
                />
                
                {/* Main Wheel */}
                <motion.div 
                  ref={wheelRef}
                  className="relative w-80 h-80 md:w-96 md:h-96 rounded-full border-8 border-accent shadow-glow-strong overflow-hidden"
                  style={{ 
                    transition: spinning ? 'transform 4s cubic-bezier(0.16, 1, 0.3, 1)' : 'none',
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
                              {prize.text}
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
                      animate={spinning ? { rotate: 360 } : {}}
                      transition={{ duration: 1, repeat: spinning ? Infinity : 0, ease: 'linear' }}
                    >
                      🐼
                    </motion.div>
                  </div>
                </motion.div>
              </div>

              {/* Spin Button */}
              <div className="space-y-4 text-center">
                {canSpin ? (
                  <>
                    <Button 
                      variant="primary" 
                      onClick={handleSpin}
                      disabled={spinning}
                      loading={spinning}
                      className="text-lg px-12 py-4 shadow-glow-strong"
                    >
                      {spinning ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                          >
                            🎰
                          </motion.div>
                          Крутимо...
                        </>
                      ) : (
                        <>
                          <Sparkles size={20} />
                          Крутити колесо
                        </>
                      )}
                    </Button>
                    <Badge variant="accent">
                      <Trophy size={14} />
                      Безкоштовний спін доступний
                    </Badge>
                  </>
                ) : (
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
              {wonPrize && (
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
                        Ви виграли: {wonPrize.text}
                      </p>
                    </div>
                    <Button variant="primary" className="mt-4">
                      <GiftIcon size={18} />
                      Активувати приз
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
                <li>✓ Безкоштовне обертання раз на тиждень</li>
                <li>✓ Призи діють протягом 30 днів</li>
                <li>✓ Один приз можна використати один раз</li>
                <li>✓ Накопичені призи в профілі</li>
              </ul>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
