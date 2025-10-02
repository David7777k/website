import React from 'react'

export const metadata = {
  title: 'Акції | PANDA Hookah',
  description: 'Актуальні акції та знижки в кальянній PANDA'
}

export default function PromosPage() {
  const promos = [
    {
      id: 'wheel',
      title: 'Колесо фортуни',
      description: 'Крути колесо та вигравай знижки!',
      icon: '🎡',
      color: 'bamboo',
      details: [
        'Можна крутити раз на 7 днів',
        'Призи: знижки 5-15%, безкоштовний чай, платний трек',
        'Вимагає реєстрації через Google',
        'Виграні купони діють 7 днів'
      ],
      cta: 'Крутити колесо',
      active: true
    },
    {
      id: 'instagram',
      title: 'Сторіс в Instagram',
      description: 'Знижка 10% за публікацію сторіс',
      icon: '📱',
      color: 'accent',
      details: [
        'Опублікуй сторіс з відміткою @panda_hookah_kyiv',
        'Покажи сторіс барменові',
        'Отримай знижку 10% на весь чек',
        'Можна використовувати щодня'
      ],
      rules: [
        'Заборонено: реклама конкурентів, неетичний контент',
        'Сторіс має бути публічним',
        'Геолокація обов\'язкова'
      ],
      cta: 'Детальні правила',
      active: true
    },
    {
      id: 'referral',
      title: 'Програма рефералів',
      description: 'Запрошуй друзів і отримуй бонуси',
      icon: '👥',
      color: 'bamboo',
      details: [
        'Доступно після першого підтвердженого візиту',
        'Друг отримує купон на першу покупку',
        'Ти отримуєш бонус після візиту друга',
        'Максимум 3 реферала на місяць'
      ],
      process: [
        '1. Створи реферальне посилання',
        '2. Друг реєструється за посиланням',
        '3. Друг показує код візиту барменові',
        '4. Обидва отримують бонуси'
      ],
      cta: 'Запросити друга',
      active: true
    },
    {
      id: 'birthday',
      title: 'День народження',
      description: 'Святкуй з особливими пропозиціями',
      icon: '🎂',
      color: 'accent',
      details: [
        'Вкажи дату народження в профілі',
        'Спеціальна пропозиція в день ДН ±3 дні',
        'Покажи документ барменові',
        'Сюрприз від закладу'
      ],
      cta: 'Вказати дату ДН',
      active: true
    },
    {
      id: 'happy-hour',
      title: 'Happy Hour',
      description: 'Знижка 15% в денний час',
      icon: '🕒',
      color: 'bamboo',
      details: [
        'Понеділок - П\'ятниця: 15:00 - 18:00',
        'Знижка 15% на всі кальяни',
        'Не поєднується з іншими акціями',
        'Діє на класичні та преміум кальяни'
      ],
      cta: 'Забронювати стіл',
      active: true
    },
    {
      id: 'company',
      title: 'Компанія друзів',
      description: '4й кальян безкоштовно',
      icon: '👬',
      color: 'accent',
      details: [
        'При замовленні 3х кальянів - 4й безкоштовно',
        'Діє щодня після 20:00',
        'Безкоштовний кальян - найдешевший з замовлених',
        'Не поєднується з happy hour'
      ],
      cta: 'Забронювати на компанію',
      active: true
    }
  ]

  const PromoCard = ({ promo }: { promo: any }) => {
    const colorClasses = {
      bamboo: {
        icon: 'bg-bamboo text-black',
        badge: 'bg-bamboo/20 text-bamboo',
        button: 'btn-primary'
      },
      accent: {
        icon: 'bg-accent/20 text-accent',
        badge: 'bg-accent/20 text-accent',
        button: 'btn-secondary'
      }
    }

    const colors = colorClasses[promo.color as keyof typeof colorClasses]

    return (
      <div className="card-interactive">
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start gap-4">
            <div className={`w-16 h-16 rounded-3xl flex items-center justify-center text-2xl ${colors.icon}`}>
              {promo.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold mb-2">{promo.title}</h3>
                  <p className="text-text-secondary">{promo.description}</p>
                </div>
                {promo.active && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${colors.badge}`}>
                    Активна
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-3 text-bamboo">Умови:</h4>
              <ul className="space-y-2">
                {promo.details.map((detail: string, index: number) => (
                  <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                    <span className="text-bamboo mt-1">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>

            {promo.process && (
              <div>
                <h4 className="font-semibold mb-3 text-bamboo">Як працює:</h4>
                <ul className="space-y-2">
                  {promo.process.map((step: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-bamboo">{index + 1}.</span>
                      {step.substring(2)}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {promo.rules && (
              <div>
                <h4 className="font-semibold mb-3 text-accent">Правила:</h4>
                <ul className="space-y-2">
                  {promo.rules.map((rule: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-text-secondary">
                      <span className="text-accent mt-1">⚠️</span>
                      {rule}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* CTA */}
          <button className={`btn ${colors.button} w-full`}>
            {promo.cta}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black gradient-text-bamboo">
          Акції та бонуси
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Економ з розумом! Скористайся нашими постійними акціями
        </p>
      </div>

      {/* Active promos count */}
      <div className="text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-bamboo/20 text-bamboo rounded-full">
          <span className="w-2 h-2 bg-bamboo rounded-full animate-pulse"></span>
          {promos.filter(p => p.active).length} активних акцій
        </div>
      </div>

      {/* Promos Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {promos.map(promo => (
          <PromoCard key={promo.id} promo={promo} />
        ))}
      </div>

      {/* Important notes */}
      <section className="card pattern-bamboo">
        <div className="text-center space-y-4">
          <h3 className="text-2xl font-bold">⚠️ Важливо знати</h3>
          <div className="max-w-3xl mx-auto space-y-3 text-left">
            <div className="glass-effect p-4 rounded-2xl">
              <p className="text-sm text-text-secondary">
                <strong className="text-white">Поєднання акцій:</strong> Деякі акції не можна поєднувати між собою. 
                Завжди питайте у бармена про можливість комбінування знижок.
              </p>
            </div>
            <div className="glass-effect p-4 rounded-2xl">
              <p className="text-sm text-text-secondary">
                <strong className="text-white">Термін дії купонів:</strong> Всі виграні купони мають обмежений термін дії. 
                Слідкуйте за датами в своєму профілі.
              </p>
            </div>
            <div className="glass-effect p-4 rounded-2xl">
              <p className="text-sm text-text-secondary">
                <strong className="text-white">Перевірка документів:</strong> Для деяких акцій може знадобитися 
                підтвердження особи або віку. Завжди майте при собі документ.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="text-center space-y-6">
        <h3 className="text-2xl font-bold">Готові скористатися акціями?</h3>
        <div className="flex flex-wrap justify-center gap-4">
          <button className="btn btn-primary">
            🎡 Крутити колесо
          </button>
          <a href="/menu" className="btn btn-secondary">
            📋 Переглянути меню
          </a>
          <button className="btn btn-ghost">
            📞 Забронювати стіл
          </button>
        </div>
      </section>
    </div>
  )
}