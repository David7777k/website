'use client'

import { useState } from 'react'
import { ScanLine, CheckCircle, XCircle, User, Calendar, Award } from 'lucide-react'

interface ValidationResult {
  valid: boolean
  error?: string
  message?: string
  payload?: any
  user?: {
    id: string
    name: string
    email: string
    phone?: string
    role: string
    totalVisits: number
    lastVisit?: string
  }
  event_id?: string
}

export default function QRScanner() {
  const [token, setToken] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ValidationResult | null>(null)

  const validateQR = async () => {
    if (!token.trim()) {
      setResult({
        valid: false,
        error: 'Введіть QR код'
      })
      return
    }

    setLoading(true)
    setResult(null)

    try {
      const response = await fetch('/api/qr/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token: token.trim() })
      })

      const data = await response.json()
      setResult(data)

      // Clear input on success
      if (data.valid) {
        setTimeout(() => setToken(''), 2000)
      }
    } catch (err: any) {
      setResult({
        valid: false,
        error: err.message || 'Помилка валідації'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      validateQR()
    }
  }

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="glass-card p-6 space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <ScanLine className="w-6 h-6 text-accent" />
          <h3 className="text-xl font-bold">Сканування QR-коду</h3>
        </div>

        <div className="space-y-3">
          <label className="block text-sm text-text-muted">
            QR-код або токен:
          </label>
          <input
            type="text"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Введіть або скануйте QR код..."
            className="w-full px-4 py-3 bg-surface border border-gray-700 rounded-xl focus:border-accent focus:ring-2 focus:ring-accent/20 transition-all font-mono text-sm"
            autoFocus
          />
          <button
            onClick={validateQR}
            disabled={loading || !token.trim()}
            className="btn-primary w-full"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Перевірка...
              </>
            ) : (
              <>
                <ScanLine className="w-5 h-5" />
                Валідувати
              </>
            )}
          </button>
        </div>
      </div>

      {/* Result */}
      {result && (
        <div
          className={`glass-card p-6 border-2 ${
            result.valid
              ? 'border-green-500 bg-green-500/10'
              : 'border-red-500 bg-red-500/10'
          }`}
        >
          {result.valid ? (
            // Success
            <div className="space-y-6">
              <div className="text-center">
                <CheckCircle className="w-16 h-16 mx-auto mb-3 text-green-500" />
                <h3 className="text-2xl font-bold text-green-500 mb-2">
                  {result.message}
                </h3>
                <p className="text-sm text-text-muted">
                  QR-код успішно валідовано
                </p>
              </div>

              {/* User Info */}
              {result.user && (
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-4 bg-surface/50 rounded-xl">
                    <User className="w-10 h-10 text-accent" />
                    <div className="flex-1">
                      <p className="font-bold text-lg">{result.user.name}</p>
                      <p className="text-sm text-text-muted">{result.user.email}</p>
                      {result.user.phone && (
                        <p className="text-sm text-text-muted">{result.user.phone}</p>
                      )}
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                      result.user.role === 'admin'
                        ? 'bg-red-500/20 text-red-500'
                        : result.user.role === 'staff'
                        ? 'bg-blue-500/20 text-blue-500'
                        : 'bg-accent/20 text-accent'
                    }`}>
                      {result.user.role.toUpperCase()}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div className="p-4 bg-surface/50 rounded-xl text-center">
                      <Award className="w-6 h-6 mx-auto mb-2 text-accent" />
                      <p className="text-2xl font-bold">{result.user.totalVisits}</p>
                      <p className="text-xs text-text-muted">Візитів</p>
                    </div>
                    <div className="p-4 bg-surface/50 rounded-xl text-center">
                      <Calendar className="w-6 h-6 mx-auto mb-2 text-accent" />
                      <p className="text-sm font-bold">
                        {result.user.lastVisit
                          ? new Date(result.user.lastVisit).toLocaleDateString('uk-UA')
                          : 'Перший візит'}
                      </p>
                      <p className="text-xs text-text-muted">Останній візит</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Payload Details */}
              {result.payload && (
                <div className="p-4 bg-surface/30 rounded-xl space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-text-muted">Тип:</span>
                    <span className="font-medium">{result.payload.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Призначення:</span>
                    <span className="font-medium">{result.payload.sub}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-muted">Event ID:</span>
                    <span className="font-mono text-xs">{result.event_id}</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            // Error
            <div className="text-center space-y-4">
              <XCircle className="w-16 h-16 mx-auto text-red-500" />
              <div>
                <h3 className="text-xl font-bold text-red-500 mb-2">
                  Валідація не пройдена
                </h3>
                <p className="text-text-muted">
                  {result.message || result.error || 'Невідома помилка'}
                </p>
              </div>

              {/* Error codes explanation */}
              {result.error && (
                <div className="p-4 bg-surface/30 rounded-xl text-sm text-left space-y-2">
                  <p className="font-bold text-red-500">Код помилки: {result.error}</p>
                  {result.error === 'EXPIRED' && (
                    <p className="text-text-muted">
                      QR-код більше не дійсний. Попросіть користувача згенерувати новий.
                    </p>
                  )}
                  {result.error === 'ALREADY_USED' && (
                    <p className="text-text-muted">
                      Цей QR-код вже було використано раніше.
                    </p>
                  )}
                  {result.error === 'INVALID_SIGNATURE' && (
                    <p className="text-text-muted">
                      QR-код підроблено або пошкоджено. Це може бути спроба шахрайства.
                    </p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="glass-card p-4 text-sm text-text-muted space-y-2">
        <p className="font-semibold text-accent">📱 Як використовувати:</p>
        <ol className="list-decimal list-inside space-y-1 ml-2">
          <li>Попросіть гостя показати QR-код з профілю</li>
          <li>Скануйте камерою або введіть код вручну</li>
          <li>Натисніть "Валідувати"</li>
          <li>Система автоматично запише візит</li>
        </ol>
      </div>
    </div>
  )
}
