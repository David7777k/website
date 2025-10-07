'use client'

import { useState, useEffect } from 'react'
import { Download, RefreshCw, Clock, Shield } from 'lucide-react'

interface QRDisplayProps {
  type?: 'visit' | 'promo' | 'referral' | 'staff_check'
  userId?: string
}

export default function QRDisplay({ type = 'visit' }: QRDisplayProps) {
  const [qrData, setQrData] = useState<{
    token: string
    qrCodeDataUrl: string
    expiresAt: string
    type: string
  } | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [timeLeft, setTimeLeft] = useState<string>('')

  // Generate QR code
  const generateQR = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Failed to generate QR code')
      }

      const data = await response.json()
      setQrData(data)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  // Calculate time left
  useEffect(() => {
    if (!qrData) return

    const updateTimer = () => {
      const now = new Date().getTime()
      const expiresAt = new Date(qrData.expiresAt).getTime()
      const diff = expiresAt - now

      if (diff <= 0) {
        setTimeLeft('Прострочено')
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`)
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [qrData])

  // Auto-generate on mount
  useEffect(() => {
    generateQR()
  }, [type])

  // Download QR code
  const downloadQR = () => {
    if (!qrData) return

    const link = document.createElement('a')
    link.href = qrData.qrCodeDataUrl
    link.download = `panda-qr-${type}-${Date.now()}.png`
    link.click()
  }

  const getTypeLabel = (t: string) => {
    const labels: Record<string, string> = {
      visit: 'Візит',
      promo: 'Промокод',
      referral: 'Реферал',
      staff_check: 'Перевірка персоналу'
    }
    return labels[t] || t
  }

  const getTypeColor = (t: string) => {
    const colors: Record<string, string> = {
      visit: 'from-accent to-accent-hover',
      promo: 'from-accent-dark to-accent',
      referral: 'from-accent to-accent-light',
      staff_check: 'from-accent-hover to-accent-light'
    }
    return colors[t] || 'from-gray-500 to-gray-600'
  }

  if (loading && !qrData) {
    return (
      <div className="glass-card p-8 text-center">
        <RefreshCw className="w-12 h-12 mx-auto mb-4 animate-spin text-accent" />
        <p className="text-text-muted">Генерація QR-коду...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="glass-card p-8 text-center">
        <div className="text-red-500 mb-4">❌ Помилка</div>
        <p className="text-text-muted mb-4">{error}</p>
        <button
          onClick={generateQR}
          className="btn-primary"
        >
          <RefreshCw className="w-4 h-4" />
          Спробувати знову
        </button>
      </div>
    )
  }

  if (!qrData) return null

  const isExpired = timeLeft === 'Прострочено'

  return (
    <div className="glass-card p-6 space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${getTypeColor(qrData.type)} text-white font-semibold`}>
          <Shield className="w-4 h-4" />
          {getTypeLabel(qrData.type)}
        </div>
        <p className="text-sm text-text-muted">
          Показіть цей QR-код персоналу
        </p>
      </div>

      {/* QR Code */}
      <div className="relative">
        <div className={`relative rounded-2xl p-4 bg-surface ${isExpired ? 'opacity-50 grayscale' : ''}`}>
          <img
            src={qrData.qrCodeDataUrl}
            alt="QR Code"
            className="w-full max-w-xs mx-auto"
          />
          {isExpired && (
            <div className="absolute inset-0 flex items-center justify-center bg-base/80 rounded-2xl">
              <div className="text-center">
                <Clock className="w-12 h-12 mx-auto mb-2 text-red-500" />
                <p className="text-red-500 font-bold">Прострочено</p>
              </div>
            </div>
          )}
        </div>

        {/* Timer */}
        {!isExpired && (
          <div className="absolute top-2 right-2 bg-accent text-base px-3 py-1 rounded-full font-mono text-sm font-bold shadow-glow">
            <Clock className="w-3 h-3 inline mr-1" />
            {timeLeft}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="space-y-2 text-sm">
        <div className="flex items-center justify-between p-3 bg-surface/50 rounded-lg">
          <span className="text-text-muted">Дійсний до:</span>
          <span className="font-medium">
            {new Date(qrData.expiresAt).toLocaleString('uk-UA')}
          </span>
        </div>
        <div className="flex items-center gap-2 p-3 bg-surface/50 rounded-lg text-text-muted text-xs">
          <Shield className="w-4 h-4 text-accent" />
          <span>Захищено HMAC-SHA256 підписом</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        <button
          onClick={generateQR}
          disabled={loading}
          className="btn-secondary flex-1"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          Оновити
        </button>
        <button
          onClick={downloadQR}
          disabled={isExpired}
          className="btn-primary flex-1"
        >
          <Download className="w-4 h-4" />
          Завантажити
        </button>
      </div>

      {/* Warning */}
      <div className="p-4 bg-warn/10 border border-warn/30 rounded-lg text-sm text-warn">
        <strong>⚠️ Важливо:</strong> Не передавайте цей QR-код іншим людям. 
        Кожен QR-код можна використати лише один раз.
      </div>
    </div>
  )
}
