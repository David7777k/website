'use client'

import React, { Suspense } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

function ErrorContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const error = searchParams.get('error')

  const errorMessages: Record<string, { title: string; description: string; solution: string }> = {
    Configuration: {
      title: 'Помилка конфігурації OAuth',
      description: 'Схоже, що Google OAuth не налаштований правильно.',
      solution: 'Переконайтеся, що Authorized redirect URI містить: http://localhost:3000/api/auth/callback/google'
    },
    AccessDenied: {
      title: 'Доступ заборонено',
      description: 'Ви відхилили запит на авторизацію.',
      solution: 'Спробуйте увійти знову та надайте необхідні дозволи.'
    },
    Verification: {
      title: 'Помилка верифікації',
      description: 'Не вдалося верифікувати ваш обліковий запис.',
      solution: 'Спробуйте увійти знову або використайте інший метод входу.'
    },
    Default: {
      title: 'Помилка входу',
      description: 'Виникла невідома помилка під час входу.',
      solution: 'Спробуйте увійти знову або зв\'яжіться з підтримкою.'
    }
  }

  const currentError = errorMessages[error || 'Default'] || errorMessages.Default

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="bg-gray-900 rounded-2xl p-8 w-full max-w-md border border-gray-800">
        {/* Error Icon */}
        <div className="text-center mb-6">
          <div className="w-20 h-20 bg-red-500/10 border border-red-500/30 rounded-full mx-auto mb-4 flex items-center justify-center text-4xl">
            ⚠️
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{currentError.title}</h1>
          <p className="text-gray-400">{currentError.description}</p>
        </div>

        {/* Error Details */}
        {error && (
          <div className="bg-red-500/5 border border-red-500/20 rounded-lg p-4 mb-6">
            <p className="text-red-400 text-sm">
              <strong>Код помилки:</strong> {error}
            </p>
          </div>
        )}

        {/* Solution */}
        <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 mb-6">
          <h3 className="text-blue-400 font-semibold mb-2">💡 Рішення:</h3>
          <p className="text-gray-400 text-sm">
            {currentError.solution}
          </p>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <button
            onClick={() => router.push('/auth/login')}
            className="w-full bg-lime-500 hover:bg-lime-600 text-black py-3 rounded-lg font-medium transition-colors"
          >
            Спробувати знову
          </button>
          
          <Link
            href="/"
            className="block text-center text-gray-400 hover:text-white transition-colors"
          >
            ← Повернутися на головну
          </Link>
        </div>

        {/* Help */}
        <div className="mt-6 pt-6 border-t border-gray-800 text-center">
          <p className="text-gray-500 text-sm">
            Потрібна допомога?{' '}
            <Link href="/faq" className="text-lime-400 hover:text-lime-300">
              Перегляньте FAQ
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}

export default function ErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-lime-500"></div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  )
}
