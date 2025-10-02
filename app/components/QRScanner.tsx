"use client"
import React, { useState, useRef } from 'react'

interface QRScannerProps {
  onScan: (data: string) => void
  onClose: () => void
  title?: string
}

export default function QRScanner({ onScan, onClose, title = "Сканувати QR-код" }: QRScannerProps) {
  const [manualCode, setManualCode] = useState('')
  const [scanning, setScanning] = useState(false)
  const [error, setError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleManualSubmit = () => {
    if (manualCode.trim()) {
      onScan(manualCode.trim())
      setManualCode('')
    } else {
      setError('Будь ласка, введіть код')
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setScanning(true)
    setError('')

    // In production, use a QR code scanner library like jsQR
    // For now, we'll simulate scanning
    setTimeout(() => {
      const mockCode = `QR_${Date.now()}`
      onScan(mockCode)
      setScanning(false)
    }, 1500)
  }

  const startCameraScanning = () => {
    setError('Камера сканування буде додана найближчим часом')
    // TODO: Implement camera scanning with getUserMedia and jsQR
  }

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--bg-secondary)] border border-[var(--border-primary)] rounded-3xl max-w-md w-full shadow-2xl">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-white">{title}</h2>
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-hover)] transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Scanner Options */}
          <div className="space-y-4">
            {/* Camera Scan Button */}
            <button
              onClick={startCameraScanning}
              disabled={scanning}
              className="w-full p-6 rounded-2xl bg-gradient-to-br from-green-600 to-green-700 text-white hover:from-green-700 hover:to-green-800 transition-all transform hover:scale-105 disabled:opacity-50"
            >
              <div className="text-4xl mb-2">📷</div>
              <div className="font-semibold">Сканувати камерою</div>
              <div className="text-sm opacity-80">Наведіть камеру на QR-код</div>
            </button>

            {/* Upload QR Image */}
            <div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={scanning}
                className="w-full p-4 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-primary)] hover:border-[var(--border-accent)] transition-all disabled:opacity-50"
              >
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl">📁</span>
                  <div className="text-left">
                    <div className="font-semibold text-white">Завантажити зображення</div>
                    <div className="text-sm text-[var(--text-secondary)]">
                      {scanning ? 'Сканування...' : 'Виберіть QR-код з галереї'}
                    </div>
                  </div>
                </div>
              </button>
            </div>

            {/* Manual Code Entry */}
            <div className="border-t border-[var(--border-primary)] pt-4">
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Або введіть код вручну:
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualCode}
                  onChange={(e) => {
                    setManualCode(e.target.value)
                    setError('')
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && handleManualSubmit()}
                  placeholder="Введіть код..."
                  className="flex-1 px-4 py-3 bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-xl text-white placeholder-[var(--text-muted)] focus:outline-none focus:border-green-500"
                />
                <button
                  onClick={handleManualSubmit}
                  className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors"
                >
                  ✓
                </button>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 rounded-xl bg-red-500/20 border border-red-500/50">
              <p className="text-red-400 text-sm">{error}</p>
            </div>
          )}

          {/* Info */}
          <div className="text-center text-xs text-[var(--text-muted)]">
            QR-код має містити дійсний ідентифікатор візиту або промокоду
          </div>
        </div>
      </div>
    </div>
  )
}