"use client"
import React, { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import QRGenerator from './QRGenerator'

interface ReferralData {
  referralCode: string
  referralLink: string
  totalReferrals: number
  tokensBalance: number
  tokensEarned: number
  level: 'bronze' | 'silver' | 'gold' | 'platinum'
  referrals: Array<{
    id: string
    name: string
    joinedAt: string
    visits: number
    tokensEarned: number
  }>
  challenges: Array<{
    id: string
    title: string
    description: string
    reward: number
    progress: number
    target: number
    completed: boolean
  }>
}

export default function ReferralSystem() {
  const { data: session } = useSession()
  const [activeTab, setActiveTab] = useState<'overview' | 'tokens' | 'referrals'>('overview')
  const [referralData, setReferralData] = useState<ReferralData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (session) {
      fetchReferralData()
    }
  }, [session])

  const fetchReferralData = async () => {
    try {
      const response = await fetch('/api/user/referrals')
      if (response.ok) {
        const data = await response.json()
        setReferralData(data)
      }
    } catch (error) {
      console.error('Error fetching referral data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyReferralLink = () => {
    if (referralData) {
      navigator.clipboard.writeText(referralData.referralLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const shareToSocial = (platform: string) => {
    if (!referralData) return

    const text = `Приєднуйся до PANDA Hookah! Отримай бонус за реєстрацію за моїм посиланням: ${referralData.referralLink}`
    
    const urls: Record<string, string> = {
      telegram: `https://t.me/share/url?url=${encodeURIComponent(referralData.referralLink)}&text=${encodeURIComponent(text)}`,
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text)}`,
      instagram: referralData.referralLink, // Copy to clipboard for Instagram
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(referralData.referralLink)}`
    }

    if (platform === 'instagram') {
      copyReferralLink()
      alert('Посилання скопійовано! Вставте його в Instagram Stories або Bio')
    } else {
      window.open(urls[platform], '_blank')
    }
  }

  const getLevelInfo = (level: string) => {
    const levels = {
      bronze: { name: 'Бронза', color: 'from-accent-dark/50 to-accent-dark/70', icon: '🥉', min: 0 },
      silver: { name: 'Срібло', color: 'from-gray-400 to-gray-600', icon: '🥈', min: 5 },
      gold: { name: 'Золото', color: 'from-accent to-accent-hover', icon: '🥇', min: 15 },
      platinum: { name: 'Платина', color: 'from-accent-hover to-accent-light', icon: '💎', min: 30 }
    }
    return levels[level as keyof typeof levels] || levels.bronze
  }

  const redeemReward = async (rewardId: string, cost: number) => {
    if (!referralData || referralData.tokensBalance < cost) {
      alert('Недостатньо токенів!')
      return
    }

    try {
      const response = await fetch('/api/user/referrals/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ rewardId })
      })

      if (response.ok) {
        alert('Нагороду активовано!')
        fetchReferralData()
      }
    } catch (error) {
      console.error('Error redeeming reward:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  if (!session) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🔒</div>
        <h3 className="text-2xl font-bold text-white mb-2">Увійдіть в систему</h3>
        <p className="text-[var(--text-secondary)] mb-6">
          Для доступу до реферальної програми потрібна авторизація
        </p>
      </div>
    )
  }

  if (!referralData) {
    return (
      <div className="text-center py-12">
        <p className="text-[var(--text-secondary)]">Помилка завантаження даних</p>
      </div>
    )
  }

  const levelInfo = getLevelInfo(referralData.level)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black gradient-text-bamboo">
          👥 Реферальна програма
        </h1>
        <p className="text-xl text-[var(--text-secondary)] max-w-2xl mx-auto">
          Запрошуй друзів та отримуй токени за кожен візит
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-[var(--bg-card)] rounded-2xl border border-[var(--border-primary)]">
        {[
          { id: 'overview', label: '📊 Огляд', icon: '📊' },
          { id: 'tokens', label: '🪙 Токени', icon: '🪙' },
          { id: 'referrals', label: '👥 Реферали', icon: '👥' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 px-6 py-3 rounded-xl font-semibold transition-all ${
              activeTab === tab.id
                ? 'bg-green-600 text-white'
                : 'text-[var(--text-secondary)] hover:text-white hover:bg-[var(--bg-hover)]'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Level Card */}
          <div className={`bg-gradient-to-br ${levelInfo.color} rounded-3xl p-8 text-white text-center`}>
            <div className="text-6xl mb-3">{levelInfo.icon}</div>
            <h2 className="text-3xl font-bold mb-2">{levelInfo.name}</h2>
            <p className="text-white/80 mb-4">
              {referralData.totalReferrals} рефералів
            </p>
            <div className="bg-white/20 rounded-full h-3 overflow-hidden">
              <div
                className="bg-white h-full transition-all duration-500"
                style={{
                  width: `${Math.min((referralData.totalReferrals / (levelInfo.min + 10)) * 100, 100)}%`
                }}
              ></div>
            </div>
            <p className="text-sm text-white/60 mt-2">
              Ще {Math.max(0, levelInfo.min + 10 - referralData.totalReferrals)} рефералів до наступного рівня
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">👥</div>
              <div className="text-3xl font-bold text-white mb-1">{referralData.totalReferrals}</div>
              <div className="text-sm text-[var(--text-secondary)]">Всього рефералів</div>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">🪙</div>
              <div className="text-3xl font-bold text-green-400 mb-1">{referralData.tokensBalance}</div>
              <div className="text-sm text-[var(--text-secondary)]">Токенів доступно</div>
            </div>
            <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 text-center">
              <div className="text-3xl mb-2">💰</div>
              <div className="text-3xl font-bold text-yellow-400 mb-1">{referralData.tokensEarned}</div>
              <div className="text-sm text-[var(--text-secondary)]">Всього заробили</div>
            </div>
          </div>

          {/* Referral Link */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🔗</span> Ваше реферальне посилання
            </h3>
            
            <div className="flex gap-2">
              <input
                type="text"
                value={referralData.referralLink}
                readOnly
                className="flex-1 px-4 py-3 bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl text-white font-mono text-sm"
              />
              <button
                onClick={copyReferralLink}
                className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
              >
                {copied ? '✓ Скопійовано' : '📋 Копіювати'}
              </button>
            </div>

            {/* QR Code */}
            <div className="pt-4 border-t border-[var(--border-primary)]">
              <QRGenerator
                data={referralData.referralLink}
                type="referral"
                title="QR-код запрошення"
                description="Поділіться цим QR-кодом з друзями"
              />
            </div>
          </div>

          {/* Social Sharing */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>📱</span> Поділитися в соцмережах
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <button
                onClick={() => shareToSocial('telegram')}
                className="p-4 bg-[#0088cc] text-white rounded-xl hover:bg-[#0077bb] transition-colors"
              >
                <div className="text-3xl mb-2">📱</div>
                <div className="font-semibold">Telegram</div>
              </button>
              <button
                onClick={() => shareToSocial('whatsapp')}
                className="p-4 bg-[#25D366] text-white rounded-xl hover:bg-[#20bd5a] transition-colors"
              >
                <div className="text-3xl mb-2">💬</div>
                <div className="font-semibold">WhatsApp</div>
              </button>
              <button
                onClick={() => shareToSocial('instagram')}
                className="p-4 bg-gradient-to-br from-accent to-accent-hover text-white rounded-xl hover:from-accent-dark hover:to-accent transition-colors"
              >
                <div className="text-3xl mb-2">📷</div>
                <div className="font-semibold">Instagram</div>
              </button>
              <button
                onClick={() => shareToSocial('facebook')}
                className="p-4 bg-[#1877F2] text-white rounded-xl hover:bg-[#166fe5] transition-colors"
              >
                <div className="text-3xl mb-2">👍</div>
                <div className="font-semibold">Facebook</div>
              </button>
            </div>
          </div>

          {/* Challenges */}
          {referralData.challenges.length > 0 && (
            <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 space-y-4">
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <span>🎯</span> Челенджі
              </h3>
              <div className="space-y-3">
                {referralData.challenges.map((challenge) => (
                  <div
                    key={challenge.id}
                    className={`p-4 rounded-xl border ${
                      challenge.completed
                        ? 'bg-green-600/20 border-green-600/50'
                        : 'bg-[var(--bg-tertiary)] border-[var(--border-primary)]'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-white">{challenge.title}</h4>
                      <span className="text-yellow-400 font-bold">+{challenge.reward} 🪙</span>
                    </div>
                    <p className="text-sm text-[var(--text-secondary)] mb-3">
                      {challenge.description}
                    </p>
                    <div className="relative">
                      <div className="bg-[var(--bg-secondary)] rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-full transition-all duration-500 ${
                            challenge.completed ? 'bg-green-500' : 'bg-green-600'
                          }`}
                          style={{ width: `${(challenge.progress / challenge.target) * 100}%` }}
                        ></div>
                      </div>
                      <p className="text-xs text-[var(--text-muted)] mt-1">
                        {challenge.progress} / {challenge.target}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tokens Tab */}
      {activeTab === 'tokens' && (
        <div className="space-y-6">
          {/* Token Balance */}
          <div className="bg-gradient-to-br from-accent to-accent-hover rounded-3xl p-8 text-white text-center">
            <div className="text-6xl mb-3">🪙</div>
            <p className="text-xl mb-2">Ваш баланс токенів</p>
            <h2 className="text-5xl font-black mb-4">{referralData.tokensBalance}</h2>
            <p className="text-white/80">Використовуйте токени для обміну на нагороди</p>
          </div>

          {/* Rewards Shop */}
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>🎁</span> Магазин нагород
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                { id: '1', title: '−10% на кальян', cost: 50, icon: '🫧' },
                { id: '2', title: '−15% на кухню', cost: 75, icon: '🍽️' },
                { id: '3', title: 'Безкоштовний трек', cost: 100, icon: '🎵' },
                { id: '4', title: '−20% на коктейлі', cost: 120, icon: '🍹' },
                { id: '5', title: 'VIP статус на місяць', cost: 500, icon: '👑' },
                { id: '6', title: 'Безкоштовний кальян', cost: 800, icon: '🎁' }
              ].map((reward) => (
                <div
                  key={reward.id}
                  className="bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl p-4"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="text-3xl">{reward.icon}</div>
                      <div>
                        <h4 className="font-semibold text-white">{reward.title}</h4>
                        <p className="text-yellow-400 font-bold">{reward.cost} 🪙</p>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => redeemReward(reward.id, reward.cost)}
                    disabled={referralData.tokensBalance < reward.cost}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
                  >
                    {referralData.tokensBalance >= reward.cost ? 'Обміняти' : 'Недостатньо токенів'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Referrals Tab */}
      {activeTab === 'referrals' && (
        <div className="space-y-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6 space-y-4">
            <h3 className="text-xl font-bold text-white flex items-center gap-2">
              <span>👥</span> Ваші реферали ({referralData.referrals.length})
            </h3>
            
            {referralData.referrals.length > 0 ? (
              <div className="space-y-3">
                {referralData.referrals.map((referral) => (
                  <div
                    key={referral.id}
                    className="bg-[var(--bg-tertiary)] border border-[var(--border-primary)] rounded-xl p-4"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-semibold text-white mb-1">{referral.name}</h4>
                        <p className="text-sm text-[var(--text-secondary)]">
                          Приєднався: {new Date(referral.joinedAt).toLocaleDateString('uk-UA')}
                        </p>
                        <p className="text-sm text-[var(--text-muted)]">
                          Візитів: {referral.visits}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-yellow-400 font-bold text-lg">+{referral.tokensEarned} 🪙</p>
                        <p className="text-xs text-[var(--text-muted)]">заробили</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-5xl mb-3">👥</div>
                <p className="text-[var(--text-secondary)]">
                  Ще немає рефералів. Поділіться посиланням з друзями!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}