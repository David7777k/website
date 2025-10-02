import React from 'react'

export const metadata = {
  title: 'Історія візитів | PANDA Hookah',
  description: 'Всі підтверджені візити'
}

export default function VisitsHistoryPage() {
  // Mock visit data
  const visits = [
    {
      id: 1,
      date: '2024-09-20',
      time: '20:30',
      status: 'confirmed',
      billAmount: 850,
      billNumber: '#A-12345',
      staff: 'Олександр К.',
      bonusesReceived: ['Колесо фортуни розблоковано', 'Бали лояльності +85']
    },
    {
      id: 2,
      date: '2024-09-15',
      time: '18:45',
      status: 'confirmed',
      billAmount: 620,
      billNumber: '#A-12301',
      staff: 'Марія В.',
      bonusesReceived: ['Бали лояльності +62']
    },
    {
      id: 3,
      date: '2024-09-10',
      time: '21:15',
      status: 'confirmed',
      billAmount: 920,
      billNumber: '#A-11987',
      staff: 'Дмитро П.',
      bonusesReceived: ['День народження! Безкоштовний чай', 'Бали лояльності +92']
    },
    {
      id: 4,
      date: '2024-09-05',
      time: '19:20',
      status: 'confirmed',
      billAmount: 450,
      billNumber: '#A-11832',
      staff: 'Анна С.',
      bonusesReceived: ['Бали лояльності +45']
    },
    {
      id: 5,
      date: '2024-08-28',
      time: '22:00',
      status: 'confirmed',
      billAmount: 1200,
      billNumber: '#A-11654',
      staff: 'Олександр К.',
      bonusesReceived: ['Великий чек! Бонус 120₴', 'Бали лояльності +120']
    }
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'confirmed': return '✅'
      case 'pending': return '⏳'
      case 'cancelled': return '❌'
      default: return '❓'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed': return 'Підтверджено'
      case 'pending': return 'Очікується'
      case 'cancelled': return 'Скасовано'
      default: return 'Невідомо'
    }
  }

  const totalAmount = visits.reduce((sum, visit) => sum + visit.billAmount, 0)
  const totalVisits = visits.length
  const averageCheck = Math.round(totalAmount / totalVisits)

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
          <h1 className="text-3xl font-bold gradient-text-bamboo">Історія візитів</h1>
          <p className="text-text-secondary">Всі ваші підтверджені візити до PANDA</p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-bamboo">{totalVisits}</div>
          <div className="text-sm text-muted">Всього візитів</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-bamboo">{totalAmount}₴</div>
          <div className="text-sm text-muted">Загальна сума</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-bamboo">{averageCheck}₴</div>
          <div className="text-sm text-muted">Середній чек</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-accent">🎯</div>
          <div className="text-sm text-muted">VIP статус</div>
        </div>
      </div>

      {/* Visits List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold">Останні візити</h2>
          <button className="text-sm text-bamboo hover:underline">
            Експортувати список
          </button>
        </div>

        <div className="space-y-3">
          {visits.map((visit) => (
            <div key={visit.id} className="card">
              <div className="space-y-4">
                {/* Visit Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-bamboo/20 flex items-center justify-center text-xl">
                      {getStatusIcon(visit.status)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">
                        {new Date(visit.date).toLocaleDateString('uk-UA', { 
                          weekday: 'long', 
                          day: 'numeric', 
                          month: 'long' 
                        })}
                      </h3>
                      <p className="text-text-secondary">
                        {visit.time} • {getStatusText(visit.status)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xl font-bold text-bamboo">{visit.billAmount}₴</div>
                    <div className="text-sm text-muted">{visit.billNumber}</div>
                  </div>
                </div>

                {/* Visit Details */}
                <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-subtle">
                  <div>
                    <h4 className="font-medium text-sm text-muted mb-2">ОБСЛУГОВУВАВ:</h4>
                    <p className="text-text-secondary">{visit.staff}</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-sm text-muted mb-2">ОТРИМАНІ БОНУСИ:</h4>
                    <div className="space-y-1">
                      {visit.bonusesReceived.map((bonus, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-bamboo rounded-full"></div>
                          <span className="text-sm text-text-secondary">{bonus}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quick Actions */}
                <div className="flex flex-wrap gap-2 pt-4 border-t border-subtle">
                  <button className="btn btn-ghost text-xs">
                    📄 Переглянути чек
                  </button>
                  <button className="btn btn-ghost text-xs">
                    ⭐ Оцінити обслуговування
                  </button>
                  <button className="btn btn-ghost text-xs">
                    💰 Залишити чайові
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Monthly Summary */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold">Статистика за місяць</h2>
        
        <div className="card pattern-bamboo">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-2">📊</div>
              <div className="text-2xl font-bold text-bamboo">3</div>
              <div className="text-sm text-muted">Візити цього місяця</div>
            </div>
            <div>
              <div className="text-3xl mb-2">💰</div>
              <div className="text-2xl font-bold text-bamboo">2390₴</div>
              <div className="text-sm text-muted">Витрачено цього місяця</div>
            </div>
            <div>
              <div className="text-3xl mb-2">🎁</div>
              <div className="text-2xl font-bold text-bamboo">247₴</div>
              <div className="text-sm text-muted">Заощаджено на бонусах</div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="text-center space-y-4">
        <h3 className="text-xl font-bold">Готові до наступного візиту?</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="btn btn-primary">
            📅 Забронювати стіл
          </button>
          <a href="/menu" className="btn btn-secondary">
            🍽️ Переглянути меню
          </a>
          <button className="btn btn-ghost">
            🎡 Крутити колесо
          </button>
        </div>
      </section>
    </div>
  )
}