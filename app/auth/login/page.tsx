'use client'

import React, { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/'
  const authError = searchParams.get('error')

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        setError('Неправильний email або пароль')
      } else {
        router.push(callbackUrl)
      }
    } catch (err) {
      setError('Щось пішло не так. Спробуйте ще раз.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    await signIn('google', { callbackUrl })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center p-4">
      <div className="bg-gray-900/50 backdrop-blur-xl rounded-3xl p-8 w-full max-w-md border border-lime-500/20 shadow-2xl shadow-lime-500/10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-lime-400 to-green-600 rounded-3xl mx-auto mb-4 flex items-center justify-center text-3xl shadow-lg shadow-lime-500/30 border-2 border-lime-400/40">
            🐼
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Вхід в PANDA</h1>
          <p className="text-gray-400 text-sm">Вітаємо назад! Увійдіть в свій аккаунт</p>
        </div>

        {/* Error Display */}
        {(error || authError) && (
          <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-4 mb-6 backdrop-blur-sm">
            <p className="text-red-400 text-sm font-medium">
              ⚠️ {error || (authError === 'OAuthCallback' ? 'Помилка OAuth. Перевірте налаштування Google Console.' : authError === 'unauthorized' ? 'Недостатньо прав доступу' : 'Помилка входу')}
            </p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleCredentialsLogin} className="space-y-6">
          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Email адреса
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              placeholder="your@email.com"
            />
          </div>

          <div>
            <label className="block text-gray-300 text-sm font-medium mb-2">
              Пароль
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-lime-500 focus:border-transparent"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-lime-500 to-green-500 text-black py-3.5 rounded-xl font-bold text-lg hover:from-lime-600 hover:to-green-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-lime-500/30 hover:shadow-lime-500/50 hover:scale-[1.02]"
          >
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-black"></div>
                Входимо...
              </>
            ) : (
              '🚀 Увійти'
            )}
          </button>
        </form>

        {/* Divider */}
        <div className="flex items-center gap-4 my-6">
          <div className="flex-1 h-px bg-gray-800"></div>
          <span className="text-gray-500 text-sm">або</span>
          <div className="flex-1 h-px bg-gray-800"></div>
        </div>

        {/* Google Login */}
        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-gray-900 py-3.5 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50 transition-all duration-300 flex items-center justify-center gap-3 shadow-lg hover:shadow-xl hover:scale-[1.02]"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Увійти через Google
        </button>

        {/* Register Link */}
        <div className="text-center mt-6">
          <p className="text-gray-400 text-sm">
            Немає аккаунту?{' '}
            <Link href="/auth/register" className="text-lime-400 hover:text-lime-300 font-medium">
              Зареєструватися
            </Link>
          </p>
        </div>

        {/* Back to Home */}
        <div className="text-center mt-4">
          <Link href="/" className="text-gray-500 hover:text-gray-400 text-sm">
            ← Повернутися на головну
          </Link>
        </div>

        {/* Test Credentials Info */}
        <div className="mt-6 p-4 bg-lime-500/5 border border-lime-500/20 rounded-xl backdrop-blur-sm">
          <p className="text-lime-400 text-xs text-center font-medium mb-2">
            🧪 Тестові облікові записи:
          </p>
          <div className="text-gray-400 text-xs space-y-1">
            <div className="flex justify-between items-center">
              <span>Адмін:</span>
              <code className="text-lime-400 bg-black/30 px-2 py-0.5 rounded">admin@panda.com / admin123</code>
            </div>
            <div className="flex justify-between items-center">
              <span>Демо:</span>
              <code className="text-lime-400 bg-black/30 px-2 py-0.5 rounded">demo@panda.com / demo123</code>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    }>
      <LoginForm />
    </Suspense>
  )
}