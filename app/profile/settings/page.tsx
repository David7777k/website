'use client'

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function SettingsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  
  const [settings, setSettings] = useState({
    name: session?.user?.name || '',
    email: session?.user?.email || '',
    phone: '',
    notifications: {
      email: true,
      push: true,
      sms: false,
      promos: true,
      events: true,
    },
    privacy: {
      showProfile: true,
      showStats: false,
      allowTags: true,
    },
    smokeTheme: false,
  })

  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'privacy' | 'preferences'>('profile')
  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async () => {
    setIsSaving(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    setIsSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => router.back()}
            className="p-3 bg-gray-800 border border-gray-700 rounded-xl hover:bg-gray-700 transition-all"
          >
            ← Назад
          </button>
          <div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
              Налаштування
            </h1>
            <p className="text-gray-400">Керуйте своїм акаунтом</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {[
            { id: 'profile', icon: '👤', label: 'Профіль' },
            { id: 'notifications', icon: '🔔', label: 'Сповіщення' },
            { id: 'privacy', icon: '🔒', label: 'Приватність' },
            { id: 'preferences', icon: '⚙️', label: 'Вподобання' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={`px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-3xl p-6 md:p-8 shadow-2xl border border-gray-700 space-y-6">
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                👤 Особиста інформація
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Ім'я
                  </label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    placeholder="+380 XX XXX XX XX"
                    className="w-full px-4 py-3 bg-gray-900/50 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-4">
                <p className="text-yellow-400 text-sm">
                  💡 Деякі зміни можуть потребувати підтвердження через email
                </p>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                🔔 Сповіщення
              </h2>

              <div className="space-y-4">
                {[
                  { key: 'email', label: 'Email сповіщення', icon: '📧' },
                  { key: 'push', label: 'Push сповіщення', icon: '📱' },
                  { key: 'sms', label: 'SMS сповіщення', icon: '💬' },
                  { key: 'promos', label: 'Акції та знижки', icon: '🎁' },
                  { key: 'events', label: 'Події та заходи', icon: '📅' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700 cursor-pointer hover:bg-gray-900 transition-all"
                  >
                    <span className="flex items-center gap-3 text-gray-300">
                      <span className="text-2xl">{item.icon}</span>
                      {item.label}
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.notifications[item.key as keyof typeof settings.notifications]}
                      onChange={(e) => setSettings({
                        ...settings,
                        notifications: {
                          ...settings.notifications,
                          [item.key]: e.target.checked
                        }
                      })}
                      className="w-6 h-6 rounded accent-blue-500"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                🔒 Приватність
              </h2>

              <div className="space-y-4">
                {[
                  { key: 'showProfile', label: 'Показувати профіль іншим', icon: '👁️' },
                  { key: 'showStats', label: 'Показувати статистику', icon: '📊' },
                  { key: 'allowTags', label: 'Дозволити позначати в постах', icon: '🏷️' },
                ].map((item) => (
                  <label
                    key={item.key}
                    className="flex items-center justify-between p-4 bg-gray-900/50 rounded-xl border border-gray-700 cursor-pointer hover:bg-gray-900 transition-all"
                  >
                    <span className="flex items-center gap-3 text-gray-300">
                      <span className="text-2xl">{item.icon}</span>
                      {item.label}
                    </span>
                    <input
                      type="checkbox"
                      checked={settings.privacy[item.key as keyof typeof settings.privacy]}
                      onChange={(e) => setSettings({
                        ...settings,
                        privacy: {
                          ...settings.privacy,
                          [item.key]: e.target.checked
                        }
                      })}
                      className="w-6 h-6 rounded accent-blue-500"
                    />
                  </label>
                ))}
              </div>

              <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
                <p className="text-blue-400 text-sm">
                  🔐 Ваші дані захищені та не передаються третім особам
                </p>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                ⚙️ Вподобання
              </h2>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl cursor-pointer hover:from-purple-500/20 hover:to-pink-500/20 transition-all">
                  <span className="flex items-center gap-3">
                    <span className="text-3xl">💨</span>
                    <div>
                      <div className="text-white font-semibold">Димова тема</div>
                      <div className="text-gray-400 text-sm">Анімований фон з димом</div>
                    </div>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.smokeTheme}
                    onChange={(e) => setSettings({ ...settings, smokeTheme: e.target.checked })}
                    className="w-6 h-6 rounded accent-purple-500"
                  />
                </label>

                <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Мова інтерфейсу
                  </label>
                  <select className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option>🇺🇦 Українська</option>
                    <option>🇷🇺 Русский</option>
                    <option>🇬🇧 English</option>
                  </select>
                </div>

                <div className="p-4 bg-gray-900/50 rounded-xl border border-gray-700">
                  <label className="block text-sm font-semibold text-gray-300 mb-2">
                    Улюблені смаки
                  </label>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['🍓 Полуниця', '🍉 Кавун', '🍊 Апельсин', '🍋 Лимон', '🍇 Виноград'].map((flavor) => (
                      <button
                        key={flavor}
                        className="px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-gray-300 hover:bg-blue-500/20 hover:border-blue-500 transition-all"
                      >
                        {flavor}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="pt-4 border-t border-gray-700 flex gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex-1 py-4 rounded-2xl font-bold text-lg transition-all ${
                isSaving
                  ? 'bg-gray-700 text-gray-400 cursor-wait'
                  : saved
                  ? 'bg-green-500 text-white'
                  : 'bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:shadow-2xl hover:scale-105'
              }`}
            >
              {isSaving ? '⏳ Збереження...' : saved ? '✅ Збережено!' : '💾 Зберегти зміни'}
            </button>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="mt-6 bg-gradient-to-br from-red-500/10 to-red-600/10 border border-red-500/30 rounded-2xl p-6">
          <h3 className="text-lg font-bold text-red-400 mb-4 flex items-center gap-2">
            ⚠️ Небезпечна зона
          </h3>
          <div className="space-y-3">
            <button className="w-full md:w-auto px-6 py-3 bg-red-500/20 border border-red-500 text-red-400 rounded-xl hover:bg-red-500/30 transition-all">
              🔄 Скинути налаштування
            </button>
            <button className="w-full md:w-auto px-6 py-3 bg-red-600/20 border border-red-600 text-red-400 rounded-xl hover:bg-red-600/30 transition-all ml-0 md:ml-3">
              🗑️ Видалити акаунт
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}