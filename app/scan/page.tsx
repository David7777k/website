'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import QRScanner from '../components/QRScanner'

export default function ScanPage() {
  const router = useRouter()
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleScan = async (data: string) => {
    setScanResult(data)
    setIsScanning(false)

    // Обработка отсканированного QR кода
    try {
      // Если это URL, переходим на него
      if (data.startsWith('http')) {
        window.location.href = data
      } else if (data.startsWith('visit:')) {
        // Если это код визита
        const visitCode = data.replace('visit:', '')
        router.push(`/visit-confirmation?code=${visitCode}`)
      } else if (data.startsWith('promo:')) {
        // Если это промокод
        const promoCode = data.replace('promo:', '')
        router.push(`/promos?code=${promoCode}`)
      } else if (data.startsWith('tip:')) {
        // Если это код для чаевых
        const staffId = data.replace('tip:', '')
        router.push(`/tips?staff=${staffId}`)
      } else {
        // Просто показываем результат
        setError('QR код отсканирован: ' + data)
      }
    } catch (err) {
      setError('Ошибка обработки QR кода')
    }
  }

  const handleError = (err: string) => {
    setError(err)
    setIsScanning(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-green-500 to-green-600 rounded-3xl mb-4 shadow-2xl">
            <span className="text-6xl">📱</span>
          </div>
          <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600 mb-2">
            Сканер QR-кодів
          </h1>
          <p className="text-gray-400 text-lg">
            Скануйте QR-коди для підтвердження візитів, активації промокодів та більше
          </p>
        </div>

        {/* Scanner Card */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-8 shadow-2xl border border-gray-700 mb-6">
          {!isScanning && !scanResult && (
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-48 h-48 mx-auto bg-gradient-to-br from-green-500/20 to-emerald-600/20 rounded-3xl flex items-center justify-center border-4 border-dashed border-green-500/50">
                  <span className="text-8xl">🔍</span>
                </div>
              </div>
              
              <button
                onClick={() => setIsScanning(true)}
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-2xl hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg"
              >
                📸 Почати сканування
              </button>
            </div>
          )}

          {isScanning && (
            <div className="space-y-4">
              <QRScanner
                onScan={handleScan}
                onError={handleError}
              />
              <button
                onClick={() => setIsScanning(false)}
                className="w-full px-6 py-3 bg-red-500/20 text-red-400 border border-red-500/50 rounded-xl hover:bg-red-500/30 transition-all"
              >
                ❌ Скасувати
              </button>
            </div>
          )}

          {scanResult && (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-green-400 mb-2">
                QR-код відсканований!
              </h3>
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <p className="text-gray-300 font-mono break-all">
                  {scanResult}
                </p>
              </div>
              <button
                onClick={() => {
                  setScanResult(null)
                  setError(null)
                }}
                className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold rounded-xl hover:shadow-xl transition-all"
              >
                🔄 Сканувати ще раз
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400 text-center">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-blue-500/10 to-blue-600/10 border border-blue-500/30 rounded-2xl p-6">
            <div className="text-4xl mb-3">🎫</div>
            <h3 className="text-xl font-bold text-blue-400 mb-2">Візити</h3>
            <p className="text-gray-400 text-sm">
              Скануйте QR-код на столику для підтвердження візиту та отримання бонусів
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-purple-600/10 border border-purple-500/30 rounded-2xl p-6">
            <div className="text-4xl mb-3">🎁</div>
            <h3 className="text-xl font-bold text-purple-400 mb-2">Промокоди</h3>
            <p className="text-gray-400 text-sm">
              Активуйте промокоди зі знижками та спеціальними пропозиціями
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-500/10 to-green-600/10 border border-green-500/30 rounded-2xl p-6">
            <div className="text-4xl mb-3">💰</div>
            <h3 className="text-xl font-bold text-green-400 mb-2">Чайові</h3>
            <p className="text-gray-400 text-sm">
              Скануйте QR-код співробітника для швидких чайових
            </p>
          </div>

          <div className="bg-gradient-to-br from-orange-500/10 to-orange-600/10 border border-orange-500/30 rounded-2xl p-6">
            <div className="text-4xl mb-3">🎡</div>
            <h3 className="text-xl font-bold text-orange-400 mb-2">Колесо фортуни</h3>
            <p className="text-gray-400 text-sm">
              Отримайте доступ до ексклюзивних розіграшів
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-8 bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border border-yellow-500/30 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-yellow-400 mb-3 flex items-center gap-2">
            💡 Поради для сканування
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-yellow-500">•</span>
              Тримайте камеру стабільно на відстані 10-15 см від QR-коду
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500">•</span>
              Переконайтеся, що є достатнє освітлення
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500">•</span>
              QR-код має повністю поміститись в кадрі
            </li>
            <li className="flex items-start gap-2">
              <span className="text-yellow-500">•</span>
              Якщо сканування не працює, спробуйте очистити камеру
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}