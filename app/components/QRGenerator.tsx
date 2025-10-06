"use client"
import React, { useState, useEffect } from 'react'

interface QRGeneratorProps {
  data: string
  type: 'visit' | 'promo' | 'table' | 'menu' | 'referral' | 'tip' | 'custom'
  title?: string
  description?: string
}

export default function QRGenerator({ data, type, title, description }: QRGeneratorProps) {
  const [qrImage, setQrImage] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    generateQR()
  }, [data, type])

  const generateQR = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ data, type })
      })

      if (response.ok) {
        const result = await response.json()
        setQrImage(result.qrCode)
      }
    } catch (error) {
      console.error('Error generating QR:', error)
    } finally {
      setLoading(false)
    }
  }

  const downloadQR = () => {
    if (!qrImage) return

    const link = document.createElement('a')
    link.href = qrImage
    link.download = `qr-${type}-${Date.now()}.png`
    link.click()
  }

  const printQR = () => {
    if (!qrImage) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <html>
        <head>
          <title>Друк QR-коду</title>
          <style>
            body {
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              min-height: 100vh;
              margin: 0;
              font-family: Arial, sans-serif;
            }
            img {
              max-width: 400px;
              margin: 20px 0;
            }
            h2 {
              margin: 10px 0;
            }
            p {
              color: #666;
            }
          </style>
        </head>
        <body>
          <h2>${title || 'QR-код'}</h2>
          ${description ? `<p>${description}</p>` : ''}
          <img src="${qrImage}" alt="QR Code" />
          <p>Код: ${data}</p>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const copyData = () => {
    navigator.clipboard.writeText(data)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getTypeIcon = () => {
    switch (type) {
      case 'visit': return '📱'
      case 'promo': return '🎟️'
      case 'table': return '🪑'
      case 'menu': return '📋'
      case 'referral': return '👥'
      case 'tip': return '💰'
      default: return '📄'
    }
  }

  return (
    <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 space-y-4">
      {/* Header */}
      <div className="text-center">
        <div className="text-4xl mb-2">{getTypeIcon()}</div>
        {title && <h3 className="text-xl font-bold text-white mb-1">{title}</h3>}
        {description && <p className="text-sm text-[var(--text-secondary)]">{description}</p>}
      </div>

      {/* QR Code Image */}
      <div className="flex justify-center">
        {loading ? (
          <div className="w-64 h-64 rounded-2xl bg-[var(--bg-tertiary)] flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full mx-auto mb-3"></div>
              <p className="text-sm text-[var(--text-muted)]">Генерація QR-коду...</p>
            </div>
          </div>
        ) : qrImage ? (
          <div className="bg-white p-4 rounded-2xl">
            <img src={qrImage} alt="QR Code" className="w-64 h-64" />
          </div>
        ) : (
          <div className="w-64 h-64 rounded-2xl bg-red-500/20 border border-red-500/50 flex items-center justify-center">
            <p className="text-red-400">Помилка генерації</p>
          </div>
        )}
      </div>

      {/* Data Display */}
      <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 overflow-hidden">
            <p className="text-xs text-[var(--text-muted)] mb-1">Дані коду:</p>
            <p className="text-sm text-white font-mono truncate">{data}</p>
          </div>
          <button
            onClick={copyData}
            className="px-3 py-2 bg-[var(--bg-hover)] rounded-lg hover:bg-green-600 transition-colors text-sm"
          >
            {copied ? '✓' : '📋'}
          </button>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={downloadQR}
          disabled={!qrImage}
          className="px-4 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          💾 Завантажити
        </button>
        <button
          onClick={printQR}
          disabled={!qrImage}
          className="px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-primary)] text-white rounded-xl hover:border-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
        >
          🖨️ Друкувати
        </button>
      </div>
    </div>
  )
}