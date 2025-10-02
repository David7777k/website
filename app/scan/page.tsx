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
    <div className="min-h-screen bg-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-block p-4 bg-gradient-to-br from-lime-500 to-green-600 rounded-2xl mb-4 border-2 border-lime-500/30">
            <span className="text-5xl">📱</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            Сканер QR-кодів
          </h1>
          <p className="text-gray-400">
            Скануйте QR-коди для підтвердження візитів, активації промокодів та більше
          </p>
        </div>

        {/* Scanner Card */}
        <div className="bg-gray-900 rounded-2xl p-8 border border-gray-800 mb-6">
          {!isScanning && !scanResult && (
            <div className="text-center space-y-6">
              <div className="relative">
                <div className="w-48 h-48 mx-auto bg-gray-800 rounded-2xl flex items-center justify-center border-2 border-dashed border-lime-500/50">
                  <span className="text-7xl">🔍</span>
                </div>
              </div>
              
              <button
                onClick={() => setIsScanning(true)}
                className="px-8 py-4 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-xl transition-all"
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
                className="w-full px-6 py-3 bg-gray-800 text-gray-300 border border-gray-700 rounded-xl hover:bg-gray-700 transition-all"
              >
                ❌ Скасувати
              </button>
            </div>
          )}

          {scanResult && (
            <div className="text-center space-y-4">
              <div className="text-6xl mb-4">✅</div>
              <h3 className="text-2xl font-bold text-lime-400 mb-2">
                QR-код відсканований!
              </h3>
              <div className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                <p className="text-gray-300 font-mono break-all text-sm">
                  {scanResult}
                </p>
              </div>
              <button
                onClick={() => {
                  setScanResult(null)
                  setError(null)
                }}
                className="px-6 py-3 bg-lime-500 hover:bg-lime-600 text-black font-semibold rounded-xl transition-all"
              >
                🔄 Сканувати ще раз
              </button>
            </div>
          )}

          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 text-red-400 text-center">
              ⚠️ {error}
            </div>
          )}
        </div>

        {/* Info Cards */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-3xl mb-2">🎫</div>
            <h3 className="text-lg font-semibold text-white mb-1">Візити</h3>
            <p className="text-gray-400 text-sm">
              Скануйте QR-код на столику для підтвердження візиту та отримання бонусів
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-3xl mb-2">🎁</div>
            <h3 className="text-lg font-semibold text-white mb-1">Промокоди</h3>
            <p className="text-gray-400 text-sm">
              Активуйте промокоди зі знижками та спеціальними пропозиціями
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-3xl mb-2">💰</div>
            <h3 className="text-lg font-semibold text-white mb-1">Чайові</h3>
            <p className="text-gray-400 text-sm">
              Скануйте QR-код співробітника для швидких чайових
            </p>
          </div>

          <div className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="text-3xl mb-2">🎡</div>
            <h3 className="text-lg font-semibold text-white mb-1">Колесо фортуни</h3>
            <p className="text-gray-400 text-sm">
              Отримайте доступ до ексклюзивних розіграшів
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="mt-6 bg-gray-900 border border-gray-800 rounded-xl p-5">
          <h3 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            💡 Поради для сканування
          </h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li className="flex items-start gap-2">
              <span className="text-lime-500">•</span>
              Тримайте камеру стабільно на відстані 10-15 см від QR-коду
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lime-500">•</span>
              Переконайтеся, що є достатнє освітлення
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lime-500">•</span>
              QR-код має повністю поміститись в кадрі
            </li>
            <li className="flex items-start gap-2">
              <span className="text-lime-500">•</span>
              Якщо сканування не працює, спробуйте очистити камеру
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}