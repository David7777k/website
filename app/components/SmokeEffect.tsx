'use client'

import React, { useEffect, useRef } from 'react'

interface SmokeEffectProps {
  enabled?: boolean
  intensity?: 'low' | 'medium' | 'high'
  className?: string
}

export default function SmokeEffect({ 
  enabled = true, 
  intensity = 'low',
  className = '' 
}: SmokeEffectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!enabled || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

    // Smoke particles
    const particles: Array<{
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      opacity: number
      life: number
      maxLife: number
    }> = []

    const particleCount = intensity === 'high' ? 20 : intensity === 'medium' ? 12 : 8

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: canvas.height + Math.random() * 100,
        size: Math.random() * 100 + 50,
        speedX: (Math.random() - 0.5) * 0.5,
        speedY: -(Math.random() * 0.3 + 0.2),
        opacity: Math.random() * 0.03 + 0.01,
        life: 0,
        maxLife: Math.random() * 300 + 200
      })
    }

    // Animation loop
    let animationId: number
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((particle, index) => {
        // Update particle
        particle.x += particle.speedX
        particle.y += particle.speedY
        particle.life++

        // Reset particle if it goes off screen or dies
        if (particle.y < -particle.size || particle.life > particle.maxLife) {
          particle.x = Math.random() * canvas.width
          particle.y = canvas.height + Math.random() * 100
          particle.life = 0
        }

        // Fade in/out effect
        let currentOpacity = particle.opacity
        if (particle.life < 50) {
          currentOpacity = particle.opacity * (particle.life / 50)
        } else if (particle.life > particle.maxLife - 50) {
          currentOpacity = particle.opacity * ((particle.maxLife - particle.life) / 50)
        }

        // Draw particle with emerald tint
        const gradient = ctx.createRadialGradient(
          particle.x, particle.y, 0,
          particle.x, particle.y, particle.size
        )
        gradient.addColorStop(0, `rgba(16, 185, 129, ${currentOpacity})`)
        gradient.addColorStop(0.5, `rgba(16, 185, 129, ${currentOpacity * 0.5})`)
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0)')

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fill()
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationId)
      window.removeEventListener('resize', resizeCanvas)
    }
  }, [enabled, intensity])

  if (!enabled) return null

  return (
    <canvas
      ref={canvasRef}
      className={`pointer-events-none ${className}`}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 1
      }}
    />
  )
}
