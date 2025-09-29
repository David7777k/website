import React from 'react'

export const metadata = {
  title: 'Staff панель | PANDA Hookah',
  description: 'Панель персоналу'
}

export default function StaffPage() {
  // Mock data
  const pendingVisits = [
    { id: 1, user: 'Олексій Петренко', code: 'AB1234', time: '2 хв тому', amount: null },
    { id: 2, user: 'Марія Коваленко', code: 'CD5678', time: '5 хв тому', amount: null }
  ]

  const pendingMusic = [
    { id: 1, track: 'Shape of You - Ed Sheeran', user: 'Андрій С.', orderCode: 'M-1234', time: '1 хв тому' },
    { id: 2, track: 'Blinding Lights - The Weeknd', user: 'Вікторія Л.', orderCode: 'M-1235', time: '3 хв тому' }
  ]

  const todayStats = {
    confirmedVisits: 18,
    musicOrders: 12,
    promoCodesUsed: 6,
    tips: 340
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-text-bamboo">Staff панель</h1>
          <p className="text-text-secondary">Робоче місце персоналу PANDA</p>
        </div>
        <div className="text-sm text-muted">
          Зміна: {new Date().toLocaleDateString('uk-UA')}
        </div>
      </div>

      {/* Today Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-bamboo">{todayStats.confirmedVisits}</div>
          <div className="text-sm text-muted">Візити підтверджено</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-bamboo">{todayStats.musicOrders}</div>
          <div className="text-sm text-muted">Треки оброблено</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-bamboo">{todayStats.promoCodesUsed}</div>
          <div className="text-sm text-muted">Промокоди</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-accent">{todayStats.tips}₴</div>
          <div className="text-sm text-muted">Чайові сьогодні</div>
        </div>
      </div>

      {/* Quick Actions */}
      <section className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <button className="card-interactive text-center">
          <div className="w-16 h-16 rounded-3xl bg-bamboo/20 mx-auto mb-3 flex items-center justify-center text-2xl">
            📱
          </div>
          <h3 className="font-semibold">Сканувати QR</h3>
          <p className="text-text-secondary text-sm">Підтвердити візит</p>
        </button>

        <button className="card-interactive text-center">
          <div className="w-16 h-16 rounded-3xl bg-accent/20 mx-auto mb-3 flex items-center justify-center text-2xl">
            🎵
          </div>
          <h3 className="font-semibold">Музика</h3>
          <p className="text-text-secondary text-sm">Модерація треків</p>
        </button>

        <button className="card-interactive text-center">
          <div className="w-16 h-16 rounded-3xl bg-panel mx-auto mb-3 flex items-center justify-center text-2xl text-bamboo">
            🎟️
          </div>
          <h3 className="font-semibold">Промокоди</h3>
          <p className="text-text-secondary text-sm">Перевірити коди</p>
        </button>

        <button className="card-interactive text-center">
          <div className="w-16 h-16 rounded-3xl bg-bamboo/20 mx-auto mb-3 flex items-center justify-center text-2xl">
            📝
          </div>
          <h3 className="font-semibold">Створити код</h3>
          <p className="text-text-secondary text-sm">Новий промокод</p>
        </button>
      </section>

      {/* Pending Visits */}
      {pendingVisits.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-bamboo">📱</span> Очікують підтвердження
            </h2>
            <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
              {pendingVisits.length} нових
            </span>
          </div>

          <div className="space-y-3">
            {pendingVisits.map((visit) => (
              <div key={visit.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-bamboo/20 flex items-center justify-center text-xl">
                      👤
                    </div>
                    <div>
                      <h3 className="font-semibold">{visit.user}</h3>
                      <p className="text-text-secondary text-sm">
                        Код: <span className="font-mono font-bold">{visit.code}</span>
                      </p>
                      <p className="text-muted text-xs">{visit.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost text-accent">
                      ❌ Відхилити
                    </button>
                    <button className="btn btn-primary">
                      ✅ Підтвердити
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Pending Music */}
      {pendingMusic.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span className="text-accent">🎵</span> Модерація музики
            </h2>
            <span className="px-3 py-1 bg-accent/20 text-accent rounded-full text-sm font-medium">
              {pendingMusic.length} треків
            </span>
          </div>

          <div className="space-y-3">
            {pendingMusic.map((music) => (
              <div key={music.id} className="card">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-accent/20 flex items-center justify-center text-xl">
                      🎵
                    </div>
                    <div>
                      <h3 className="font-semibold">{music.track}</h3>
                      <p className="text-text-secondary text-sm">
                        Замовив: {music.user} • Код: {music.orderCode}
                      </p>
                      <p className="text-muted text-xs">{music.time}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost text-accent">
                      ❌ Відхилити
                    </button>
                    <button className="btn btn-primary">
                      ✅ Додати в чергу
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* My Profile */}
      <section className="card pattern-bamboo">
        <div className="text-center space-y-4">
          <div className="w-20 h-20 rounded-full bg-white mx-auto flex items-center justify-center text-3xl">
            👨‍💼
          </div>
          <div>
            <h3 className="text-xl font-bold">Олександр Коваленко</h3>
            <p className="text-text-secondary">Старший кальянщик</p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="glass-effect p-3 rounded-xl">
              <div className="text-lg font-bold text-bamboo">4.9⭐</div>
              <div className="text-sm text-muted">Рейтинг</div>
            </div>
            <div className="glass-effect p-3 rounded-xl">
              <div className="text-lg font-bold text-bamboo">127</div>
              <div className="text-sm text-muted">Візити цей місяць</div>
            </div>
            <div className="glass-effect p-3 rounded-xl">
              <div className="text-lg font-bold text-accent">2340₴</div>
              <div className="text-sm text-muted">Чайові цей місяць</div>
            </div>
          </div>
        </div>
      </section>

      {/* Reminders */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">📝 Нагадування</h2>
        
        <div className="space-y-3">
          <div className="card border-l-4 border-l-bamboo">
            <div className="flex items-center gap-3">
              <div className="text-xl">⏰</div>
              <div>
                <h3 className="font-semibold">Перевірити запаси тютюну</h3>
                <p className="text-text-secondary text-sm">Кілька смаків на низькому рівні</p>
              </div>
            </div>
          </div>
          
          <div className="card border-l-4 border-l-accent">
            <div className="flex items-center gap-3">
              <div className="text-xl">🧹</div>
              <div>
                <h3 className="font-semibold">Прибирання столу №7</h3>
                <p className="text-text-secondary text-sm">Гості пішли 15 хвилин тому</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}