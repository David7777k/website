'use client'

import { useState } from 'react'
import QRGenerator from '../components/QRGenerator'

type QRType = 'visit' | 'promo' | 'tip' | 'referral' | 'custom'

export default function QRGeneratorPage() {
  const [qrType, setQrType] = useState<QRType>('custom')
  const [qrData, setQrData] = useState('')
  const [generated, setGenerated] = useState(false)
  const [qrUrl, setQrUrl] = useState('')

  const handleGenerate = async () => {
    if (!qrData) return

    try {
      let finalData = qrData
      
      // Добавляем префикс в зависимости от типа
      if (qrType === 'visit') {
        finalData = `visit:${qrData}`
      } else if (qrType === 'promo') {
        finalData = `promo:${qrData}`
      } else if (qrType === 'tip') {
        finalData = `tip:${qrData}`
      } else if (qrType === 'referral') {
        finalData = `referral:${qrData}`
      }

      const response = await fetch('/api/qr/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type: qrType,
          data: finalData 
        }),
      })

      if (response.ok) {
        const result = await response.json()
        setQrUrl(result.qrCode)
        setGenerated(true)
      }
    } catch (error) {
      console.error('Error generating QR:', error)
    }
  }

  const downloadQR = () => {
    const link = document.createElement('a')
    link.href = qrUrl
    link.download = `qr-${qrType}-${Date.now()}.png`
    link.click()
  }

  const resetForm = () => {
    setGenerated(false)
    setQrData('')
    setQrUrl('')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-accent to-accent-hover rounded-3xl mb-4 shadow-2xl">
            <span className="text-6xl">🎨</span>
          </div>
          <h1 className="text-4xl font-black text-gradient mb-2">
            Генератор QR-кодів
          </h1>
          <p className="text-gray-400 text-lg">
            Створіть власний QR-код для візитів, промокодів та інших цілей
          </p>
        </div>

        {!generated ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700 space-y-6">
            {/* Type Selection */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-3">
                Тип QR-коду
              </label>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                {[
                  { type: 'custom', icon: '✨', label: 'Власний' },
                  { type: 'visit', icon: '🎫', label: 'Візит' },
                  { type: 'promo', icon: '🎁', label: 'Промокод' },
                  { type: 'tip', icon: '💰', label: 'Чайові' },
                  { type: 'referral', icon: '👥', label: 'Реферал' },
                ].map((item) => (
                  <button
                    key={item.type}
                    onClick={() => setQrType(item.type as QRType)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      qrType === item.type
                        ? 'bg-purple-500/20 border-purple-500 text-purple-400'
                        : 'bg-gray-800/50 border-gray-700 text-gray-400 hover:border-purple-500/50'
                    }`}
                  >
                    <div className="text-2xl mb-1">{item.icon}</div>
                    <div className="text-xs font-semibold">{item.label}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Data Input */}
            <div>
              <label className="block text-sm font-bold text-gray-300 mb-2">
                Дані для QR-коду
              </label>
              <textarea
                value={qrData}
                onChange={(e) => setQrData(e.target.value)}
                placeholder={
                  qrType === 'visit' ? 'Введіть код візиту (напр. TABLE-5)' :
                  qrType === 'promo' ? 'Введіть промокод (напр. SUMMER2024)' :
                  qrType === 'tip' ? 'Введіть ID співробітника' :
                  qrType === 'referral' ? 'Введіть реферальний код' :
                  'Введіть будь-які дані або URL'
                }
                className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={4}
              />
            </div>

            {/* Info Box */}
            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <span className="text-2xl">💡</span>
                <div className="text-sm text-gray-300">
                  {qrType === 'visit' && 'QR-код для візиту дозволить гостям підтвердити своє відвідування'}
                  {qrType === 'promo' && 'QR-код промокоду активує знижку при скануванні'}
                  {qrType === 'tip' && 'QR-код для чайових дозволить швидко перевести чайові співробітнику'}
                  {qrType === 'referral' && 'Реферальний QR-код дозволить запрошувати друзів'}
                  {qrType === 'custom' && 'Ви можете створити QR-код з будь-якими даними або URL'}
                </div>
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerate}
              disabled={!qrData}
              className={`w-full py-4 rounded-2xl font-bold text-lg transition-all ${
                qrData
                  ? 'btn-primary hover:shadow-2xl hover:scale-105'
                  : 'bg-gray-700 text-gray-500 cursor-not-allowed'
              }`}
            >
              ✨ Згенерувати QR-код
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700 space-y-6 text-center">
            <div className="text-6xl mb-4">🎉</div>
            <h2 className="text-2xl font-bold text-green-400 mb-4">
              QR-код успішно створений!
            </h2>

            {/* QR Code Display */}
            {qrUrl && (
              <div className="bg-white p-8 rounded-2xl inline-block">
                <img src={qrUrl} alt="Generated QR Code" className="w-64 h-64" />
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-4 justify-center flex-wrap">
              <button
                onClick={downloadQR}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl transition-all"
              >
                💾 Завантажити
              </button>
              <button
                onClick={resetForm}
                className="px-6 py-3 bg-gray-700 text-white font-bold rounded-xl hover:bg-gray-600 transition-all"
              >
                🔄 Створити новий
              </button>
            </div>

            {/* QR Data Info */}
            <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
              <p className="text-gray-400 text-sm mb-1">Дані QR-коду:</p>
              <p className="text-white font-mono break-all">{qrData}</p>
            </div>
          </div>
        )}

        {/* Examples */}
        <div className="mt-8 grid md:grid-cols-3 gap-4">
          <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
            <div className="text-3xl mb-2">🎫</div>
            <h3 className="font-bold text-accent text-sm mb-1">Візит</h3>
            <p className="text-gray-400 text-xs">Для підтвердження відвідування</p>
          </div>
          <div className="bg-accent-dark/10 border border-accent-dark/30 rounded-xl p-4">
            <div className="text-3xl mb-2">🎁</div>
            <h3 className="font-bold text-accent-dark text-sm mb-1">Промокод</h3>
            <p className="text-gray-400 text-xs">Для знижок та акцій</p>
          </div>
          <div className="bg-accent-hover/10 border border-accent-hover/30 rounded-xl p-4">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="font-bold text-accent-hover text-sm mb-1">Чайові</h3>
            <p className="text-gray-400 text-xs">Для швидких чайових</p>
          </div>
        </div>
      </div>
    </div>
  )
}