'use client'

import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'

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
  const [showDeleteModal, setShowDeleteModal] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState('')
  const [deleteReason, setDeleteReason] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)

  useEffect(() => {
    // Fetch user settings
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/user/profile')
      if (response.ok) {
        const data = await response.json()
        setSettings(prev => ({
          ...prev,
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          smokeTheme: data.smokeThemeEnabled || false
        }))
      }
    } catch (error) {
      console.error('Error fetching settings:', error)
    }
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: settings.name,
          phone: settings.phone,
          smokeThemeEnabled: settings.smokeTheme
        })
      })

      if (response.ok) {
        setSaved(true)
        setTimeout(() => setSaved(false), 3000)
      }
    } catch (error) {
      console.error('Error saving settings:', error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteAccount = async () => {
    if (deleteConfirm !== 'ВИДАЛИТИ') {
      alert('Будь ласка, введіть "ВИДАЛИТИ" для підтвердження')
      return
    }

    setIsDeleting(true)
    try {
      const response = await fetch('/api/user/delete', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          confirmPassword: 'confirmed',
          reason: deleteReason
        })
      })

      if (response.ok) {
        alert('Акаунт успішно видалено')
        await signOut({ callbackUrl: '/' })
      } else {
        alert('Помилка при видаленні акаунту')
      }
    } catch (error) {
      console.error('Error deleting account:', error)
      alert('Помилка при видаленні акаунту')
    } finally {
      setIsDeleting(false)
      setShowDeleteModal(false)
    }
  }

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
  }

  return (
    <div className="min-h-screen bg-base page-transition">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.div 
          className="flex items-center gap-4 mb-8"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <button
            onClick={() => router.back()}
            className="p-3 glass-card hover:bg-surface transition-all tap-target"
          >
            ← Назад
          </button>
          <div>
            <h1 className="text-3xl font-black text-gradient">
              Налаштування
            </h1>
            <p className="text-text-muted">Керуй своїм акаунтом</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div 
          className="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
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
                  ? 'bg-accent text-base shadow-glow'
                  : 'glass-card text-text-muted hover:bg-surface'
              }`}
            >
              {tab.icon} {tab.label}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div 
          className="glass-card p-6 md:p-8 space-y-6"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-text flex items-center gap-2">
                👤 Особиста інформація
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-2">
                    Ім'я
                  </label>
                  <input
                    type="text"
                    value={settings.name}
                    onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                    className="input-primary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={settings.email}
                    disabled
                    className="input-primary opacity-50 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-text-muted mb-2">
                    Телефон
                  </label>
                  <input
                    type="tel"
                    value={settings.phone}
                    onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                    placeholder="+380 XX XXX XX XX"
                    className="input-primary"
                  />
                </div>
              </div>

              <div className="bg-warn/10 border border-warn/30 rounded-xl p-4">
                <p className="text-warn text-sm">
                  💡 Деякі зміни можуть потребувати підтвердження через email
                </p>
              </div>
            </div>
          )}

          {/* Notifications Tab */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-text flex items-center gap-2">
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
                    className="flex items-center justify-between p-4 glass-card cursor-pointer hover:bg-surface transition-all"
                  >
                    <span className="flex items-center gap-3 text-text-muted">
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
                      className="w-6 h-6 rounded accent-accent"
                    />
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Privacy Tab */}
          {activeTab === 'privacy' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-text flex items-center gap-2">
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
                    className="flex items-center justify-between p-4 glass-card cursor-pointer hover:bg-surface transition-all"
                  >
                    <span className="flex items-center gap-3 text-text-muted">
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
                      className="w-6 h-6 rounded accent-accent"
                    />
                  </label>
                ))}
              </div>

              <div className="bg-accent/10 border border-accent/30 rounded-xl p-4">
                <p className="text-accent text-sm">
                  🔐 Ваші дані захищені та не передаються третім особам
                </p>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-text flex items-center gap-2">
                ⚙️ Вподобання
              </h2>

              <div className="space-y-4">
                <label className="flex items-center justify-between p-4 bg-accent/10 border border-accent/30 rounded-xl cursor-pointer hover:bg-accent/20 transition-all">
                  <span className="flex items-center gap-3">
                    <span className="text-3xl">💨</span>
                    <div>
                      <div className="text-text font-semibold">Димова тема</div>
                      <div className="text-text-muted text-sm">Анімований фон з димом</div>
                    </div>
                  </span>
                  <input
                    type="checkbox"
                    checked={settings.smokeTheme}
                    onChange={(e) => setSettings({ ...settings, smokeTheme: e.target.checked })}
                    className="w-6 h-6 rounded accent-accent"
                  />
                </label>

                <div className="glass-card p-4">
                  <label className="block text-sm font-semibold text-text-muted mb-2">
                    Мова інтерфейсу
                  </label>
                  <select className="input-primary">
                    <option>🇺🇦 Українська</option>
                    <option>🇷🇺 Русский</option>
                    <option>🇬🇧 English</option>
                  </select>
                </div>

                <div className="glass-card p-4">
                  <label className="block text-sm font-semibold text-text-muted mb-2">
                    Улюблені смаки
                  </label>
                  <div className="flex flex-wrap gap-2 mt-3">
                    {['🍓 Полуниця', '🍉 Кавун', '🍊 Апельсин', '🍋 Лимон', '🍇 Виноград'].map((flavor) => (
                      <button
                        key={flavor}
                        className="px-4 py-2 glass-card text-sm text-text-muted hover:bg-accent/20 hover:border-accent hover:text-accent transition-all"
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
          <div className="pt-4 border-t border-border flex gap-4">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className={`flex-1 btn-primary text-lg py-4 ${
                isSaving ? 'opacity-50 cursor-wait' : saved ? 'bg-success' : ''
              }`}
            >
              {isSaving ? '⏳ Збереження...' : saved ? '✅ Збережено!' : '💾 Зберегти зміни'}
            </button>
          </div>
        </motion.div>

        {/* Danger Zone */}
        <motion.div 
          className="mt-6 bg-danger/10 border border-danger/30 rounded-2xl p-6"
          initial="initial"
          animate="animate"
          variants={fadeInUp}
        >
          <h3 className="text-lg font-bold text-danger mb-4 flex items-center gap-2">
            ⚠️ Небезпечна зона
          </h3>
          <div className="space-y-3">
            <button 
              onClick={() => {
                if (confirm('Скинути всі налаштування до значень за замовчуванням?')) {
                  fetchSettings()
                }
              }}
              className="w-full md:w-auto px-6 py-3 bg-warn/20 border border-warn text-warn rounded-xl hover:bg-warn/30 transition-all"
            >
              🔄 Скинути налаштування
            </button>
            <button 
              onClick={() => setShowDeleteModal(true)}
              className="w-full md:w-auto px-6 py-3 bg-danger/20 border border-danger text-danger rounded-xl hover:bg-danger/30 transition-all ml-0 md:ml-3"
            >
              🗑️ Видалити акаунт
            </button>
          </div>
        </motion.div>
      </div>

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <motion.div 
            className="glass-card p-6 max-w-md w-full"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-bold text-danger mb-4">⚠️ Видалення акаунту</h3>
            <p className="text-text-muted mb-4">
              Ця дія призведе до деактивації вашого акаунту. Всі ваші дані будуть анонімізовані.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-text-muted mb-2">
                  Чому ви хочете видалити акаунт? (необов'язково)
                </label>
                <textarea
                  value={deleteReason}
                  onChange={(e) => setDeleteReason(e.target.value)}
                  className="input-primary min-h-[80px]"
                  placeholder="Ваш відгук допоможе нам стати кращими..."
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-text-muted mb-2">
                  Введіть "ВИДАЛИТИ" для підтвердження
                </label>
                <input
                  type="text"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                  className="input-primary"
                  placeholder="ВИДАЛИТИ"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowDeleteModal(false)
                  setDeleteConfirm('')
                  setDeleteReason('')
                }}
                className="flex-1 btn-secondary"
                disabled={isDeleting}
              >
                Скасувати
              </button>
              <button
                onClick={handleDeleteAccount}
                disabled={isDeleting || deleteConfirm !== 'ВИДАЛИТИ'}
                className="flex-1 bg-danger hover:bg-danger/80 text-white font-semibold px-6 py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Видалення...' : 'Видалити'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
