import React from 'react'

export const metadata = {
  title: 'Історія бонусів | PANDA Hookah',
  description: 'Купони, промокоди, призи з колеса'
}

export default function BonusesHistoryPage() {
  // Mock bonus data
  const bonuses = [
    {
      id: 1,
      title: "−15% Halloween 🎃",
      source: "Колесо фортуни",
      type: "discount",
      value: "15%",
      code: "HALLOWEEN15",
      status: "active",
      createdAt: "2024-09-20T20:30:00",
      expiresAt: "2024-10-31T23:59:59",
      usedAt: null
    },
    {
      id: 2,
      title: "Безкоштовний чай 🍵",
      source: "День народження",
      type: "freebie",
      value: "Чай в подарунок",
      code: "BIRTHDAY_TEA",
      status: "active",
      createdAt: "2024-09-10T21:15:00",
      expiresAt: "2024-10-20T23:59:59",
      usedAt: null
    },
    {
      id: 3,
      title: "−10% Реферал 👥",
      source: "Запрошення друга",
      type: "discount",
      value: "10%",
      code: "REF_BONUS10",
      status: "expired",
      createdAt: "2024-09-05T19:20:00",
      expiresAt: "2024-09-25T23:59:59",
      usedAt: null
    },
    {
      id: 4,
      title: "Платний трек безкоштовно 🎵",
      source: "Колесо фортуни", 
      type: "freebie",
      value: "Безкоштовне замовлення музики",
      code: "FREE_TRACK",
      status: "used",
      createdAt: "2024-08-28T22:00:00",
      expiresAt: "2024-09-15T23:59:59",
      usedAt: "2024-09-02T19:45:00"
    },
    {
      id: 5,
      title: "−20% Великий чек 💰",
      source: "Адмін",
      type: "discount",
      value: "20%",
      code: "BIGCHECK20",
      status: "used",
      createdAt: "2024-08-28T22:05:00",
      expiresAt: "2024-09-15T23:59:59",
      usedAt: "2024-08-30T20:15:00"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-bamboo bg-bamboo/20 border-bamboo/30'
      case 'expired': return 'text-muted bg-muted/20 border-muted/30'
      case 'used': return 'text-accent bg-accent/20 border-accent/30'
      default: return 'text-muted bg-muted/20 border-muted/30'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'active': return 'Активний'
      case 'expired': return 'Истік'
      case 'used': return 'Використаний'
      default: return 'Невідомо'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'discount': return '💰'
      case 'freebie': return '🎁'
      case 'cashback': return '💸'
      default: return '🎟️'
    }
  }

  const getSourceIcon = (source: string) => {
    switch (source) {
      case 'Колесо фортуни': return '🎡'
      case 'День народження': return '🎂'
      case 'Запрошення друга': return '👥'
      case 'Instagram': return '📱'
      case 'Адмін': return '⚙️'
      default: return '🎟️'
    }
  }

  const activeBonuses = bonuses.filter(b => b.status === 'active')
  const usedBonuses = bonuses.filter(b => b.status === 'used')
  const expiredBonuses = bonuses.filter(b => b.status === 'expired')
  
  const totalSaved = usedBonuses.reduce((sum, bonus) => {
    if (bonus.type === 'discount') {
      const percent = parseInt(bonus.value.replace('%', ''))
      return sum + (percent * 10) // Approximate savings
    }
    return sum + 50 // Fixed value for freebies
  }, 0)

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-3 mb-6">
        <a href="/profile" className="p-2 rounded-xl bg-panel border border-subtle hover:bg-glass transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </a>
        <div>
          <h1 className="text-3xl font-bold gradient-text-bamboo">Історія бонусів</h1>
          <p className="text-text-secondary">Купони, промокоди, призи з колеса</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-bamboo">{activeBonuses.length}</div>
          <div className="text-sm text-muted">Активні</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-accent">{usedBonuses.length}</div>
          <div className="text-sm text-muted">Використані</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-muted">{expiredBonuses.length}</div>
          <div className="text-sm text-muted">Прострочені</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-bamboo">{totalSaved}₴</div>
          <div className="text-sm text-muted">Заощаджено</div>
        </div>
      </div>

      {/* Active Bonuses */}
      {activeBonuses.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span className="text-bamboo">🎁</span> Активні бонуси
          </h2>
          
          <div className="space-y-3">
            {activeBonuses.map((bonus) => (
              <div key={bonus.id} className="card-interactive cursor-pointer group">
                <div className="space-y-4">
                  {/* Bonus Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-16 h-16 rounded-3xl bg-bamboo/20 flex items-center justify-center text-2xl">
                        {getTypeIcon(bonus.type)}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold group-hover:text-bamboo transition-colors">
                          {bonus.title}
                        </h3>
                        <p className="text-text-secondary flex items-center gap-2">
                          {getSourceIcon(bonus.source)} {bonus.source}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={`px-3 py-1 rounded-full border text-sm font-medium ${getStatusColor(bonus.status)}`}>
                        {getStatusText(bonus.status)}
                      </div>
                      <div className="text-xs text-muted mt-1">
                        До {new Date(bonus.expiresAt).toLocaleDateString('uk-UA')}
                      </div>
                    </div>
                  </div>

                  {/* Bonus Value */}
                  <div className="flex items-center justify-between p-4 bg-bamboo/5 rounded-2xl border border-bamboo/20">
                    <div>
                      <div className="text-2xl font-bold text-bamboo">{bonus.value}</div>
                      <div className="text-sm text-muted">Код: {bonus.code}</div>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn btn-primary">
                        📱 QR код
                      </button>
                      <button className="btn btn-ghost">
                        📋 Копіювати
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Bonuses History */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Вся історія</h2>
          <select className="px-3 py-2 bg-panel border border-subtle rounded-lg text-sm">
            <option value="all">Всі статуси</option>
            <option value="active">Активні</option>
            <option value="used">Використані</option>
            <option value="expired">Прострочені</option>
          </select>
        </div>

        <div className="space-y-3">
          {bonuses.map((bonus) => (
            <div key={bonus.id} className="card">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-panel flex items-center justify-center text-lg">
                    {getSourceIcon(bonus.source)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{bonus.title}</h3>
                    <p className="text-sm text-text-secondary">{bonus.source}</p>
                    <p className="text-xs text-muted">
                      {new Date(bonus.createdAt).toLocaleDateString('uk-UA')}
                      {bonus.usedAt && (
                        <span> • Використано {new Date(bonus.usedAt).toLocaleDateString('uk-UA')}</span>
                      )}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className={`inline-flex px-2 py-1 rounded-full border text-xs font-medium ${getStatusColor(bonus.status)}`}>
                    {getStatusText(bonus.status)}
                  </div>
                  <div className="text-sm font-bold text-bamboo mt-1">{bonus.value}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bonus Sources Info */}
      <section className="card pattern-bamboo">
        <div className="text-center space-y-4">
          <h3 className="text-xl font-bold">Як отримати більше бонусів?</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="glass-effect p-4 rounded-2xl text-center">
              <div className="text-2xl mb-2">🎡</div>
              <h4 className="font-semibold mb-1">Колесо фортуни</h4>
              <p className="text-sm text-text-secondary">Раз на 7 днів</p>
            </div>
            <div className="glass-effect p-4 rounded-2xl text-center">
              <div className="text-2xl mb-2">👥</div>
              <h4 className="font-semibold mb-1">Запроси друзів</h4>
              <p className="text-sm text-text-secondary">За кожного друга</p>
            </div>
            <div className="glass-effect p-4 rounded-2xl text-center">
              <div className="text-2xl mb-2">📱</div>
              <h4 className="font-semibold mb-1">Instagram stories</h4>
              <p className="text-sm text-text-secondary">Щодня доступно</p>
            </div>
            <div className="glass-effect p-4 rounded-2xl text-center">
              <div className="text-2xl mb-2">🎂</div>
              <h4 className="font-semibold mb-1">День народження</h4>
              <p className="text-sm text-text-secondary">Щорічний бонус</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}