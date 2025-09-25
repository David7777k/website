import React from 'react'
import { prisma } from '../../lib/prisma'

export const metadata = {
  title: 'FAQ | PANDA Hookah',
  description: 'Відповіді на часті питання про кальянну PANDA'
}

export default async function FAQPage() {
  const faqs = await prisma.faq.findMany({
    orderBy: { order: 'asc' }
  })

  // Default FAQs if database is empty
  const defaultFAQs = [
    {
      question: "Скільки коштує кальян?",
      answer: "Вартість кальяну залежить від обраного тютюну та типу кальяну. Класичний кальян коштує від 350₴, преміум — від 450₴. Діють знижки в happy hour (15:00-18:00) — 15% на всі кальяни."
    },
    {
      question: "Чи можна бронювати столики?",
      answer: "Так, ми приймаємо бронювання столиків. Телефонуйте нам або використовуйте кнопку 'Бронювання' на сайті. Рекомендуємо бронювати заздалегідь, особливо на вихідні."
    },
    {
      question: "Які години роботи?",
      answer: "Ми працюємо щодня з 14:00 до 02:00. В п'ятницю та суботу можемо працювати довше залежно від кількості гостей."
    },
    {
      question: "Чи є вікові обмеження?",
      answer: "Так, вхід дозволений особам старше 18 років. При вході потрібно пред'явити документ, що підтверджує вік."
    },
    {
      question: "Як працює колесо фортуни?",
      answer: "Колесо фортуни можна крутити раз на 7 днів після входу в аккаунт. Ви можете виграти знижки на кальян, кухню, безкоштовний чай або інші бонуси. Виграні купони діють 7 днів."
    },
    {
      question: "Як замовити музику?",
      answer: "Ви можете замовити трек через наш сайт за невелику плату. Після оплати ви отримаєте код замовлення, який потрібно показати барменові. Обмеження: 1 трек на 10 хвилин, довжина до 6 хвилин."
    },
    {
      question: "Як отримати знижку за Instagram stories?",
      answer: "Опублікуйте stories з відміткою нашого закладу та покажіть його барменові. Ви отримаєте знижку 10% на весь чек. Детальні правила описані на сторінці акцій."
    },
    {
      question: "Що таке програма рефералів?",
      answer: "Запрошуйте друзів і отримуйте бонуси! Після підтвердження візиту друга барменом, ви обидва отримуєте знижкові купони. Максимум 3 підтверджених реферала на місяць."
    },
    {
      question: "Чи можна залишити чайові через додаток?",
      answer: "Так, у нас є функція електронних чайових. Натисніть на плаваючу кнопку 'Чайові майстру', оберіть працівника та суму. Оплата проходить через LiqPay."
    },
    {
      question: "Що робити в день народження?",
      answer: "Якщо ваш візит збігається з днем народження (±3 дні), повідомте про це барменові та покажіть документ. У вас може бути спеціальна пропозиція від закладу."
    }
  ]

  const displayFAQs = faqs.length > 0 ? faqs : defaultFAQs

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-black gradient-text-bamboo">
          FAQ
        </h1>
        <p className="text-xl text-text-secondary max-w-2xl mx-auto">
          Відповіді на найчастіші питання про кальянну PANDA
        </p>
      </div>

      {/* FAQ List */}
      <div className="max-w-4xl mx-auto space-y-4">
        {displayFAQs.map((faq, index) => (
          <details key={index} className="card group">
            <summary className="flex items-center justify-between cursor-pointer list-none">
              <h3 className="text-lg font-semibold pr-4 group-hover:text-bamboo transition-colors">
                {faq.question}
              </h3>
              <div className="w-8 h-8 rounded-full bg-bamboo/20 flex items-center justify-center text-bamboo group-open:rotate-180 transition-transform">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </summary>
            <div className="mt-4 pt-4 border-t border-subtle">
              <p className="text-text-secondary leading-relaxed">
                {faq.answer}
              </p>
            </div>
          </details>
        ))}
      </div>

      {/* Quick actions */}
      <section className="grid md:grid-cols-3 gap-6">
        <div className="card text-center">
          <div className="w-16 h-16 rounded-3xl bg-bamboo mx-auto mb-4 flex items-center justify-center text-2xl text-black">
            📞
          </div>
          <h3 className="text-lg font-semibold mb-2">Зателефонуйте</h3>
          <p className="text-text-secondary text-sm mb-4">
            Не знайшли відповідь? Подзвоніть нам
          </p>
          <a href="tel:+380123456789" className="btn btn-primary w-full">
            Зателефонувати
          </a>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 rounded-3xl bg-accent/20 mx-auto mb-4 flex items-center justify-center text-2xl text-accent">
            📱
          </div>
          <h3 className="text-lg font-semibold mb-2">Instagram</h3>
          <p className="text-text-secondary text-sm mb-4">
            Слідкуйте за новинами в соцмережах
          </p>
          <a href="#" className="btn btn-secondary w-full">
            Підписатися
          </a>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 rounded-3xl bg-panel mx-auto mb-4 flex items-center justify-center text-2xl text-bamboo">
            🏠
          </div>
          <h3 className="text-lg font-semibold mb-2">Відвідайте нас</h3>
          <p className="text-text-secondary text-sm mb-4">
            Приходьте і відчуйте атмосферу PANDA
          </p>
          <button className="btn btn-secondary w-full">
            Показати на мапі
          </button>
        </div>
      </section>

      {/* Contact section */}
      <section className="card pattern-bamboo text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-4xl mb-4">🐼</div>
          <h3 className="text-2xl font-bold">Все ще маєте питання?</h3>
          <p className="text-text-secondary">
            Наша команда завжди готова допомогти вам. Зв'яжіться з нами будь-яким зручним способом
          </p>
          
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <div className="glass-effect p-4 rounded-2xl">
              <h4 className="font-semibold mb-2">Робочі години</h4>
              <p className="text-text-secondary text-sm">Щодня: 14:00 — 02:00</p>
            </div>
            <div className="glass-effect p-4 rounded-2xl">
              <h4 className="font-semibold mb-2">Адреса</h4>
              <p className="text-text-secondary text-sm">Київ, вул. Центральна, 123</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}