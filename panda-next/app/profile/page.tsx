import React from 'react'

export const metadata = {
  title: 'Профіль | PANDA Hookah',
  description: 'Профіль користувача PANDA'
}

export default function ProfilePage() {
  // Mock user data - will be replaced with real auth
  const user = {
    name: "Олексій Петренко",
    phone: "+380123456789",
    email: "alex@example.com",
    visitCount: 12,
    activePromoCodes: 3,
    nextWheelSpin: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    smokingTheme: false
  }

  const promoCodes = [
    {
      id: 1,
      title: "−15% Halloween 🎃",
      source: "Колесо фортуни",
      discount: "15%",
      expiresAt: "2024-10-31",
      status: "active",
      code: "HALLOWEEN15"
    },
    {
      id: 2,
      title: "Безкоштовний чай 🍵",
      source: "День народження",
      discount: "Чай в подарунок",
      expiresAt: "2024-10-20",
      status: "active",
      code: "BIRTHDAY_TEA"
    },
    {
      id: 3,
      title: "−10% Реферал 👥",
      source: "Запрошення друга",
      discount: "10%",
      expiresAt: "2024-09-25",
      status: "expired",
      code: "REF_BONUS10"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-bamboo bg-bamboo/20'
      case 'expired': return 'text-muted bg-muted/20'
      case 'used': return 'text-accent bg-accent/20'
      default: return 'text-muted bg-muted/20'
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

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <div className="w-24 h-24 rounded-full bg-gradient-to-br from-bamboo to-bamboo-light mx-auto flex items-center justify-center text-4xl text-black">
          🐼
        </div>
        <div>
          <h1 className="text-3xl font-bold gradient-text-bamboo">Профіль</h1>
          <p className="text-text-secondary">{user.name}</p>
        </div>
      </div>

      {/* User Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-bamboo">{user.visitCount}</div>
          <div className="text-sm text-muted">Візитів</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-bamboo">{user.activePromoCodes}</div>
          <div className="text-sm text-muted">Активні бонуси</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-accent">🎡</div>
          <div className="text-sm text-muted">Колесо готове</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-bamboo">⭐</div>
          <div className="text-sm text-muted">VIP статус</div>
        </div>
      </div>

      {/* QR Visit Code */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>📱</span> QR Візит
        </h2>
        <div className="card text-center space-y-4">
          <div className="w-32 h-32 bg-white rounded-2xl mx-auto flex items-center justify-center">
            <div className="text-center text-black">
              <div className="text-4xl mb-2">📱</div>
              <div className="text-sm font-bold">QR CODE</div>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Код для підтвердження візиту</h3>
            <p className="text-text-secondary text-sm mb-4">
              Покажіть цей QR-код барменові для підтвердження візиту та отримання бонусів
            </p>
            <button className="btn btn-primary">
              Згенерувати новий код
            </button>
          </div>
        </div>
      </section>

      {/* Active Promo Codes */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>🎟️</span> Мої промокоди
          </h2>
          <a href="/profile/bonuses" className="text-sm text-bamboo hover:underline">
            Всі бонуси
          </a>
        </div>

        <div className="space-y-3">
          {promoCodes.map((promo) => (
            <div key={promo.id} className="card-interactive group cursor-pointer">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="text-lg font-bold">{promo.title}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(promo.status)}`}>
                      {getStatusText(promo.status)}
                    </span>
                  </div>
                  <p className="text-sm text-text-secondary mb-1">
                    Джерело: {promo.source}
                  </p>
                  <p className="text-xs text-muted">
                    Діє до: {new Date(promo.expiresAt).toLocaleDateString('uk-UA')}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-bamboo mb-2">
                    {promo.discount}
                  </div>
                  <button className="text-xs text-muted hover:text-bamboo transition-colors">
                    Показати QR
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Settings */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <span>⚙️</span> Налаштування
        </h2>
        
        <div className="space-y-3">
          {/* Smoking Theme Toggle */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <span>💨</span> Тема дыму (BETA)
                </h3>
                <p className="text-sm text-text-secondary">Візуальні ефекти дыму на сайті</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input 
                  type="checkbox" 
                  className="sr-only peer"
                  defaultChecked={user.smokingTheme}
                />
                <div className="w-11 h-6 bg-panel peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-bamboo"></div>
              </label>
            </div>
          </div>

          {/* Profile Info */}
          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold flex items-center gap-2">
                  <span>👤</span> Інформація профілю
                </h3>
                <p className="text-sm text-text-secondary">Редагувати особисті дані</p>
              </div>
              <button className="btn btn-secondary">
                Редагувати
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="grid md:grid-cols-2 gap-4">
        <a href="/profile/visits" className="card-interactive text-center">
          <div className="w-16 h-16 rounded-3xl bg-bamboo/20 mx-auto mb-4 flex items-center justify-center text-2xl text-bamboo">
            📊
          </div>
          <h3 className="font-semibold mb-2">Історія візитів</h3>
          <p className="text-text-secondary text-sm">Всі підтверджені візити з датами</p>
        </a>

        <a href="/profile/bonuses" className="card-interactive text-center">
          <div className="w-16 h-16 rounded-3xl bg-accent/20 mx-auto mb-4 flex items-center justify-center text-2xl text-accent">
            🎁
          </div>
          <h3 className="font-semibold mb-2">Історія бонусів</h3>
          <p className="text-text-secondary text-sm">Купони, промокоди, призи</p>
        </a>
      </section>
    </div>
  )
}