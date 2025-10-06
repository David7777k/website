import React from 'react'

export const metadata = {
  title: 'Умови користування | PANDA Hookah',
  description: 'Умови використання сервісів PANDA Hookah Lounge'
}

export default function TermsOfService() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black gradient-text-bamboo">
          📜 Умови користування
        </h1>
        <p className="text-[var(--text-secondary)]">
          Останнє оновлення: {new Date().toLocaleDateString('uk-UA')}
        </p>
      </div>

      {/* Content */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-8 space-y-8">
        
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. Загальні положення</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p>
              Ці Умови користування регулюють використання веб-сайту та мобільного додатку 
              PANDA Hookah Lounge (далі - "Сервіс"). Використовуючи Сервіс, ви погоджуєтесь 
              з цими умовами.
            </p>
            <p>
              PANDA Hookah Lounge ("ми", "нас", "наш") надає цей Сервіс користувачам ("ви", "ваш") 
              за умови прийняття всіх умов, викладених нижче.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. Реєстрація та облікові записи</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <ul className="list-disc list-inside space-y-2">
              <li>Для доступу до деяких функцій Сервісу може знадобитися реєстрація</li>
              <li>Ви повинні надати точну, актуальну та повну інформацію про себе</li>
              <li>Ви несете відповідальність за збереження конфіденційності свого облікового запису</li>
              <li>Ви несете відповідальність за всі дії, виконані через ваш обліковий запис</li>
              <li>Мінімальний вік користувача: 18 років</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Використання сервісу</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p className="font-semibold text-white">Ви погоджуєтесь:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Використовувати Сервіс лише для законних цілей</li>
              <li>Не порушувати права інших користувачів</li>
              <li>Не завантажувати шкідливий або незаконний контент</li>
              <li>Не намагатися отримати несанкціонований доступ до Сервісу</li>
              <li>Не використовувати автоматизовані системи для доступу до Сервісу без дозволу</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. Програма лояльності та бонуси</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <ul className="list-disc list-inside space-y-2">
              <li>Бонуси та промокоди не підлягають обміну на готівку</li>
              <li>Кожен бонус має термін дії, вказаний при отриманні</li>
              <li>Ми залишаємо за собою право скасувати бонуси у випадку виявлення зловживань</li>
              <li>Колесо фортуни доступне один раз на тиждень для кожного користувача</li>
              <li>Реферальні бонуси нараховуються після першого візиту запрошеної особи</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. Бронювання та скасування</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <ul className="list-disc list-inside space-y-2">
              <li>Бронювання столиків здійснюється через Сервіс або за телефоном</li>
              <li>Скасування бронювання можливе не пізніше ніж за 2 години до події</li>
              <li>У випадку неявки без попередження, бронювання може бути анульовано</li>
              <li>Ми залишаємо за собою право відмовити в бронюванні без пояснення причин</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. Оплата та повернення коштів</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <ul className="list-disc list-inside space-y-2">
              <li>Оплата здійснюється в закладі або онлайн через інтегровані платіжні системи</li>
              <li>Повернення коштів здійснюється відповідно до законодавства України</li>
              <li>Депозити за бронювання можуть не підлягати поверненню у випадку скасування менш ніж за 24 години</li>
              <li>Всі ціни вказані в гривнях (UAH) та включають ПДВ</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">7. Інтелектуальна власність</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p>
              Весь контент Сервісу, включаючи тексти, графіку, логотипи, зображення та програмне 
              забезпечення, є власністю PANDA Hookah Lounge або наших ліцензіарів і захищений 
              законами про інтелектуальну власність.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">8. Обмеження відповідальності</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <ul className="list-disc list-inside space-y-2">
              <li>Сервіс надається "як є" без будь-яких гарантій</li>
              <li>Ми не несемо відповідальності за збої в роботі Сервісу</li>
              <li>Ми не несемо відповідальності за втрату даних або упущену вигоду</li>
              <li>Наша відповідальність обмежена сумою, сплаченою вами за останні 12 місяців</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">9. Зміни в Умовах</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p>
              Ми залишаємо за собою право в будь-який час змінювати ці Умови. Про суттєві зміни 
              ми повідомимо вас через Сервіс або електронною поштою. Продовження використання 
              Сервісу після внесення змін означає ваше прийняття оновлених Умов.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">10. Застосовне право</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p>
              Ці Умови регулюються законодавством України. Всі спори вирішуються в судах України 
              за місцезнаходженням нашого закладу.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">11. Контактна інформація</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p>
              Якщо у вас є питання щодо цих Умов, будь ласка, зв'яжіться з нами:
            </p>
            <ul className="list-none space-y-2">
              <li>📧 Email: support@panda-hookah.com</li>
              <li>📱 Телефон: +380 (XX) XXX-XX-XX</li>
              <li>📍 Адреса: м. Київ, вул. Прикладна 1</li>
            </ul>
          </div>
        </section>
      </div>

      {/* Back Link */}
      <div className="text-center">
        <a
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-colors font-semibold"
        >
          ← Повернутися на головну
        </a>
      </div>
    </div>
  )
}