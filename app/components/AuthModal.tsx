"use client"
import React, { useState } from 'react'

interface AuthModalProps {
  open: boolean
  onClose: () => void
  onSuccess: (user: any) => void
}

export default function AuthModal({ open, onClose, onSuccess }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthdate: ''
  })

  const handleGoogleAuth = async () => {
    setLoading(true)
    
    // Simulate Google OAuth
    setTimeout(() => {
      const mockUser = {
        id: '1',
        name: 'Олексій Петренко',
        email: 'alex@example.com',
        image: null,
        role: 'guest'
      }
      setLoading(false)
      onSuccess(mockUser)
    }, 2000)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate form submission
    setTimeout(() => {
      const mockUser = {
        id: '2',
        name: formData.name || 'Новий користувач',
        email: formData.email,
        phone: formData.phone,
        image: null,
        role: 'guest'
      }
      setLoading(false)
      onSuccess(mockUser)
    }, 1500)
  }

  if (!open) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-lg z-50 flex items-center justify-center p-4">
      <div className="bg-[var(--bg)] border border-subtle rounded-3xl max-w-md w-full shadow-2xl">
        <div className="p-8 space-y-6">
          {/* Header */}
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-bamboo to-bamboo-light mx-auto flex items-center justify-center text-4xl text-black">
              🐼
            </div>
            <div>
              <h2 className="text-2xl font-black gradient-text-bamboo">
                {isLogin ? 'Вітаємо в PANDA!' : 'Створити аккаунт'}
              </h2>
              <p className="text-text-secondary">
                {isLogin ? 'Увійдіть для доступу до всіх функцій' : 'Приєднуйтесь до родини PANDA'}
              </p>
            </div>
          </div>

          {/* Google Auth Button */}
          <button
            onClick={handleGoogleAuth}
            disabled={loading}
            className="w-full p-4 border-2 border-subtle rounded-2xl hover:border-bamboo hover:bg-glass transition-all duration-300 flex items-center justify-center gap-3 group"
          >
            {loading ? (
              <div className="animate-spin w-6 h-6 border-2 border-bamboo border-t-transparent rounded-full"></div>
            ) : (
              <>
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285f4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34a853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#fbbc04"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#ea4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                <span className="font-semibold group-hover:text-bamboo transition-colors">
                  Продовжити з Google
                </span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4">
            <div className="flex-1 h-px bg-subtle"></div>
            <span className="text-sm text-muted">або</span>
            <div className="flex-1 h-px bg-subtle"></div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Ім'я</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Ваше ім'я"
                  className="w-full px-4 py-3 bg-panel border border-subtle rounded-xl focus:border-bamboo focus:outline-none transition-colors"
                  required={!isLogin}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="your@email.com"
                className="w-full px-4 py-3 bg-panel border border-subtle rounded-xl focus:border-bamboo focus:outline-none transition-colors"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Телефон</label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+380123456789"
                className="w-full px-4 py-3 bg-panel border border-subtle rounded-xl focus:border-bamboo focus:outline-none transition-colors"
              />
            </div>

            {!isLogin && (
              <div>
                <label className="block text-sm font-medium mb-2">Дата народження (необов'язково)</label>
                <input
                  type="date"
                  value={formData.birthdate}
                  onChange={(e) => setFormData({...formData, birthdate: e.target.value})}
                  className="w-full px-4 py-3 bg-panel border border-subtle rounded-xl focus:border-bamboo focus:outline-none transition-colors"
                />
                <p className="text-xs text-muted mt-1">Для отримання бонусу в день народження</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary py-4 text-lg font-semibold"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                  {isLogin ? 'Входимо...' : 'Створюємо...'}
                </span>
              ) : (
                isLogin ? '🚪 Увійти' : '✨ Створити аккаунт'
              )}
            </button>
          </form>

          {/* Toggle */}
          <div className="text-center space-y-3">
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="text-sm text-bamboo hover:underline"
            >
              {isLogin ? 'Немає аккаунта? Створити' : 'Вже маєте аккаунт? Увійти'}
            </button>
            
            <button
              onClick={onClose}
              className="block mx-auto text-sm text-muted hover:text-white transition-colors"
            >
              Закрити
            </button>
          </div>

          {/* Benefits */}
          <div className="border-t border-subtle pt-6">
            <h4 className="text-sm font-semibold mb-3 text-center">Переваги аккаунта:</h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-2">
                <span className="text-bamboo">🎡</span>
                <span>Колесо фортуни</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-bamboo">🎁</span>
                <span>Бонуси та знижки</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-bamboo">👥</span>
                <span>Програма рефералів</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-bamboo">📊</span>
                <span>Історія візитів</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}