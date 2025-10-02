import React from 'react'

export const metadata = {
  title: 'Меню | PANDA Hookah',
  description: 'Меню кальянної PANDA - кальяни, напої та закуски'
}

export default function MenuPage() {
  const menuCategories = [
    {
      id: 'hookah',
      name: 'Кальяни',
      icon: '💨',
      items: [
        { name: 'Класичний кальян', price: 350, description: 'Традиційний кальян з якісним тютюном' },
        { name: 'Преміум кальян', price: 450, description: 'Кальян з преміальним тютюном та молоком' },
        { name: 'Фруктовий кальян', price: 400, description: 'На фруктовій чаші з натуральними соками' },
        { name: 'Міксовий кальян', price: 500, description: 'Авторський мікс смаків від майстра' }
      ]
    },
    {
      id: 'drinks',
      name: 'Напої',
      icon: '🥤',
      items: [
        { name: 'Чай (чорний/зелений)', price: 80, description: 'Якісний листовий чай' },
        { name: 'Кава еспресо', price: 60, description: 'Ароматна кава з італійських зерен' },
        { name: 'Кава американо', price: 70, description: 'Класичний американо' },
        { name: 'Капучино', price: 85, description: 'Ніжна кава з молочною піною' },
        { name: 'Лате', price: 90, description: 'Кава з молоком в ідеальних пропорціях' },
        { name: 'Свіжевичавлений сік', price: 120, description: 'Натуральні соки з сезонних фруктів' },
        { name: 'Лимонад', price: 100, description: 'Освіжаючий домашній лимонад' },
        { name: 'Мінеральна вода', price: 45, description: 'Газована та негазована' }
      ]
    },
    {
      id: 'snacks',
      name: 'Закуски',
      icon: '🍽️',
      items: [
        { name: 'Мікс горіхів', price: 150, description: 'Солоні горіхи в асортименті' },
        { name: 'Чіпси', price: 80, description: 'Картопляні чіпси різних смаків' },
        { name: 'Попкорн', price: 70, description: 'Солодкий або солоний попкорн' },
        { name: 'Фруктова тарілка', price: 200, description: 'Сезонні свіжі фрукти' },
        { name: 'Сирна тарілка', price: 250, description: 'Асорті з якісних сирів' }
      ]
    },
    {
      id: 'desserts',
      name: 'Десерти',
      icon: '🍰',
      items: [
        { name: 'Тірамісу', price: 180, description: 'Класичний італійський десерт' },
        { name: 'Чізкейк', price: 160, description: 'Ніжний чізкейк з ягодами' },
        { name: 'Шоколадний браунi', price: 140, description: 'Багатий шоколадний смак' },
        { name: 'Морозиво', price: 80, description: 'Ванільне, шоколадне або полуничне' }
      ]
    }
  ]

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black gradient-text-bamboo">
          Меню PANDA
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Ласкаво просимо до нашого світу смаків і ароматів
        </p>
      </div>

      {/* Menu Categories */}
      <div className="space-y-8">
        {menuCategories.map(category => (
          <section key={category.id} className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-bamboo flex items-center justify-center text-2xl text-black">
                {category.icon}
              </div>
              <h2 className="text-3xl font-bold">{category.name}</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-bamboo/50 to-transparent"></div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {category.items.map((item, index) => (
                <div key={index} className="card group cursor-pointer">
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold mb-2 group-hover:text-bamboo transition-colors">
                        {item.name}
                      </h3>
                      <p className="text-text-secondary text-sm leading-relaxed">
                        {item.description}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-bamboo">
                        {item.price}₴
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Special offers */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold text-accent">Спеціальні пропозиції</h2>
          <div className="flex-1 h-px bg-gradient-to-r from-accent/50 to-transparent"></div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div className="card pattern-bamboo">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-bamboo mx-auto flex items-center justify-center text-2xl text-black">
                🎉
              </div>
              <h3 className="text-xl font-bold">Happy Hour</h3>
              <p className="text-text-secondary">
                Знижка 15% на всі кальяни щодня з 15:00 до 18:00
              </p>
              <span className="inline-block px-4 py-2 bg-bamboo/20 text-bamboo rounded-full text-sm font-medium">
                Пн-Пт 15:00-18:00
              </span>
            </div>
          </div>

          <div className="card">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-accent/20 mx-auto flex items-center justify-center text-2xl text-accent">
                👥
              </div>
              <h3 className="text-xl font-bold">Компанія друзів</h3>
              <p className="text-text-secondary">
                При замовленні від 3х кальянів - 4й кальян безкоштовно!
              </p>
              <span className="inline-block px-4 py-2 bg-accent/20 text-accent rounded-full text-sm font-medium">
                Щодня після 20:00
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Contact info */}
      <section className="card pattern-bamboo text-center">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="text-4xl mb-4">🐼</div>
          <h3 className="text-2xl font-bold">Маєте питання до меню?</h3>
          <p className="text-text-secondary">
            Наші майстри з радістю проконсультують вас та допоможуть обрати ідеальний кальян
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-6">
            <a href="tel:+380123456789" className="btn btn-primary">
              📞 Зателефонувати
            </a>
            <button className="btn btn-secondary">
              📅 Забронювати стіл
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}