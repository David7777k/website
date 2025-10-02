'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface SystemSetting {
  id: number
  key: string
  value: string
  description?: string
  category: 'general' | 'wheel' | 'music' | 'referrals' | 'bonuses' | 'limits'
  is_public: boolean
}

export default function AdminSettingsPage() {
  const { data: session } = useSession()
  const [settings, setSettings] = useState<Record<string, SystemSetting[]>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeCategory, setActiveCategory] = useState<string>('general')
  const [changes, setChanges] = useState<Record<string, string>>({})

  const categories = [
    { key: 'general', label: 'Основные', icon: '⚙️' },
    { key: 'wheel', label: 'Колесо фортуны', icon: '🎡' },
    { key: 'music', label: 'Музыка', icon: '🎵' },
    { key: 'referrals', label: 'Рефералы', icon: '👥' },
    { key: 'bonuses', label: 'Бонусы', icon: '🎁' },
    { key: 'limits', label: 'Лимиты', icon: '🚫' }
  ]

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/settings')
      if (response.ok) {
        const data = await response.json()
        setSettings(data.settings)
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSettingChange = (key: string, value: string) => {
    setChanges(prev => ({
      ...prev,
      [key]: value
    }))
  }

  const saveSettings = async () => {
    if (Object.keys(changes).length === 0) return

    setSaving(true)
    try {
      const settingsToUpdate = Object.entries(changes).map(([key, value]) => ({
        key,
        value
      }))

      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ settings: settingsToUpdate })
      })

      if (response.ok) {
        await fetchSettings()
        setChanges({})
        
        // Show success message
        const toast = document.createElement('div')
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50'
        toast.textContent = 'Настройки сохранены!'
        document.body.appendChild(toast)
        setTimeout(() => document.body.removeChild(toast), 3000)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setSaving(false)
    }
  }

  const resetChanges = () => {
    setChanges({})
  }

  const getCurrentValue = (setting: SystemSetting) => {
    return changes[setting.key] !== undefined ? changes[setting.key] : setting.value
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">⚙️ Налаштування системи</h1>
          <p className="text-gray-400 mt-2">Глобальні параметри і конфігурація</p>
        </div>
        {Object.keys(changes).length > 0 && (
          <div className="flex gap-3">
            <button
              onClick={resetChanges}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition-colors"
            >
              Скасувати
            </button>
            <button
              onClick={saveSettings}
              disabled={saving}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {saving ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Збереження...
                </>
              ) : (
                <>💾 Зберегти зміни</>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto">
        {categories.map(category => (
          <button
            key={category.key}
            onClick={() => setActiveCategory(category.key)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg whitespace-nowrap transition-colors ${
              activeCategory === category.key
                ? 'bg-green-600 text-white'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span>{category.icon}</span>
            {category.label}
            {settings[category.key] && (
              <span className="bg-gray-600 text-xs px-2 py-1 rounded-full">
                {settings[category.key].length}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Settings Grid */}
      <div className="grid gap-6">
        {settings[activeCategory]?.map(setting => (
          <div
            key={setting.key}
            className={`bg-gray-800 rounded-2xl p-6 border transition-colors ${
              changes[setting.key] !== undefined
                ? 'border-yellow-500 bg-yellow-500/5'
                : 'border-gray-700'
            }`}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h3 className="font-semibold text-white">{setting.key}</h3>
                  {setting.is_public && (
                    <span className="text-xs bg-blue-600 px-2 py-1 rounded-full text-white">
                      Публичное
                    </span>
                  )}
                  {changes[setting.key] !== undefined && (
                    <span className="text-xs bg-yellow-600 px-2 py-1 rounded-full text-white">
                      Изменено
                    </span>
                  )}
                </div>
                {setting.description && (
                  <p className="text-sm text-gray-400 mb-3">{setting.description}</p>
                )}
              </div>
              
              <div className="flex-shrink-0 w-64">
                {setting.key.includes('enabled') || setting.value === 'true' || setting.value === 'false' ? (
                  // Boolean setting
                  <select
                    value={getCurrentValue(setting)}
                    onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  >
                    <option value="true">Включено</option>
                    <option value="false">Выключено</option>
                  </select>
                ) : (
                  // Text/Number setting
                  <input
                    type={setting.key.includes('amount') || setting.key.includes('hours') || setting.key.includes('days') || setting.key.includes('score') || setting.key.includes('max') || setting.key.includes('min') ? 'number' : 'text'}
                    value={getCurrentValue(setting)}
                    onChange={(e) => handleSettingChange(setting.key, e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    placeholder="Введите значение..."
                  />
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {!settings[activeCategory] || settings[activeCategory].length === 0 && (
        <div className="text-center py-12 text-gray-400">
          <div className="text-6xl mb-4">⚙️</div>
          <h3 className="text-xl font-semibold mb-2">Настройки не найдены</h3>
          <p>В этой категории пока нет настроек</p>
        </div>
      )}
    </div>
  )
}