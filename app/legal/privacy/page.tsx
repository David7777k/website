import React from 'react'

export const metadata = {
  title: 'Політика конфіденційності | PANDA Hookah',
  description: 'Політика конфіденційності PANDA Hookah Lounge'
}

export default function PrivacyPolicy() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-5xl font-black gradient-text-bamboo">
          🔒 Політика конфіденційності
        </h1>
        <p className="text-[var(--text-secondary)]">
          Останнє оновлення: {new Date().toLocaleDateString('uk-UA')}
        </p>
      </div>

      {/* GDPR Badge */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl p-6 text-center text-white">
        <div className="text-4xl mb-2">🛡️</div>
        <h3 className="text-xl font-bold mb-2">GDPR Compliance</h3>
        <p className="text-white/90">
          Ми дотримуємось Загального регламенту захисту даних (GDPR) та забезпечуємо 
          найвищий рівень захисту ваших персональних даних
        </p>
      </div>

      {/* Content */}
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-3xl p-8 space-y-8">
        
        <section>
          <h2 className="text-2xl font-bold text-white mb-4">1. Вступ</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p>
              PANDA Hookah Lounge ("ми", "нас", "наш") серйозно ставиться до захисту вашої 
              конфіденційності. Ця Політика конфіденційності описує, як ми збираємо, використовуємо, 
              зберігаємо та захищаємо ваші персональні дані.
            </p>
            <p>
              Використовуючи наш Сервіс, ви погоджуєтесь зі збором та використанням інформації 
              відповідно до цієї політики.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">2. Які дані ми збираємо</h2>
          <div className="space-y-4 text-[var(--text-secondary)]">
            
            <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">📝 Дані, які ви надаєте нам:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Ім'я та прізвище</li>
                <li>Електронна адреса</li>
                <li>Номер телефону</li>
                <li>Дата народження (для перевірки віку та святкування)</li>
                <li>Фотографії профілю (необов'язково)</li>
              </ul>
            </div>

            <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">🔍 Дані, які ми збираємо автоматично:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>IP-адреса</li>
                <li>Тип браузера та пристрою</li>
                <li>Операційна система</li>
                <li>Час та дата відвідування</li>
                <li>Переглянуті сторінки</li>
                <li>Дані про використання Сервісу</li>
              </ul>
            </div>

            <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">📍 Дані про місцезнаходження:</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Приблизне місцезнаходження на основі IP-адреси</li>
                <li>Точне місцезнаходження (тільки з вашого дозволу)</li>
              </ul>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">3. Як ми використовуємо ваші дані</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p className="font-semibold text-white">Ми використовуємо зібрані дані для:</p>
            <ul className="list-disc list-inside space-y-2">
              <li>Надання та покращення наших послуг</li>
              <li>Персоналізації вашого досвіду</li>
              <li>Обробки бронювань та замовлень</li>
              <li>Надання програми лояльності та бонусів</li>
              <li>Відправки важливих повідомлень та оновлень</li>
              <li>Відповіді на ваші запити</li>
              <li>Аналізу використання Сервісу</li>
              <li>Запобігання шахрайству та забезпечення безпеки</li>
              <li>Дотримання законодавства</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">4. Cookies та подібні технології</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p>
              Ми використовуємо cookies та подібні технології відстеження для відстеження активності 
              на нашому Сервісі та зберігання певної інформації.
            </p>
            
            <div className="bg-[var(--bg-tertiary)] rounded-xl p-4">
              <h3 className="font-semibold text-white mb-2">Типи cookies:</h3>
              <ul className="list-disc list-inside space-y-2">
                <li><strong>Необхідні cookies:</strong> Забезпечують базову функціональність Сервісу</li>
                <li><strong>Функціональні cookies:</strong> Запам'ятовують ваші налаштування</li>
                <li><strong>Аналітичні cookies:</strong> Допомагають нам зрозуміти, як користувачі взаємодіють з Сервісом</li>
                <li><strong>Рекламні cookies:</strong> Використовуються для показу релевантної реклами</li>
              </ul>
            </div>

            <p>
              Ви можете контролювати cookies через налаштування вашого браузера. Однак відключення 
              cookies може вплинути на функціональність Сервісу.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">5. Передача даних третім особам</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p>
              Ми можемо передавати ваші дані таким третім особам:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Постачальники послуг:</strong> Для обробки платежів, аналітики, хостингу</li>
              <li><strong>Правоохоронні органи:</strong> При наявності законного запиту</li>
              <li><strong>Бізнес-партнери:</strong> З вашої згоди для спеціальних пропозицій</li>
            </ul>
            <p className="mt-3">
              <strong>Ми ніколи не продаємо ваші персональні дані третім особам.</strong>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">6. Захист даних</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p>
              Ми впроваджуємо відповідні технічні та організаційні заходи для захисту ваших 
              персональних даних:
            </p>
            <ul className="list-disc list-inside space-y-2">
              <li>Шифрування даних при передачі (SSL/TLS)</li>
              <li>Шифрування даних у спокої</li>
              <li>Регулярні перевірки безпеки</li>
              <li>Обмежений доступ до персональних даних</li>
              <li>Моніторинг безпеки 24/7</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">7. Ваші права (GDPR)</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p className="font-semibold text-white">Ви маєте право на:</p>
            <ul className="list-disc list-inside space-y-2">
              <li><strong>Доступ:</strong> Отримати копію ваших персональних даних</li>
              <li><strong>Виправлення:</strong> Виправити неточні або неповні дані</li>
              <li><strong>Видалення:</strong> Запросити видалення ваших даних ("право бути забутим")</li>
              <li><strong>Обмеження обробки:</strong> Обмежити використання ваших даних</li>
              <li><strong>Переносимість:</strong> Отримати ваші дані у структурованому форматі</li>
              <li><strong>Заперечення:</strong> Заперечити проти обробки ваших даних</li>
              <li><strong>Відкликання згоди:</strong> Відкликати згоду на обробку даних</li>
            </ul>
            <p className="mt-3">
              Для реалізації цих прав зверніться до нас за адресою: <strong>privacy@panda-hookah.com</strong>
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">8. Зберігання даних</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p>
              Ми зберігаємо ваші персональні дані тільки стільки, скільки необхідно для цілей, 
              зазначених у цій Політиці, якщо тривалий період зберігання не вимагається законом.
            </p>
            <p>
              Після видалення вашого облікового запису ми видаляємо або анонімізуємо ваші 
              персональні дані протягом 90 днів, якщо законодавство не вимагає іншого.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">9. Діти</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p>
              Наш Сервіс не призначений для осіб віком до 18 років. Ми свідомо не збираємо 
              персональні дані від дітей. Якщо ви батько або опікун і дізналися, що ваша 
              дитина надала нам персональні дані, зв'яжіться з нами.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">10. Зміни в Політиці</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p>
              Ми можемо час від часу оновлювати нашу Політику конфіденційності. Про будь-які 
              зміни ми повідомимо вас, розмістивши нову Політику на цій сторінці та оновивши 
              дату "Останнє оновлення".
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-4">11. Контактна інформація</h2>
          <div className="space-y-3 text-[var(--text-secondary)]">
            <p>
              Якщо у вас є питання щодо цієї Політики конфіденційності або ви хочете реалізувати 
              свої права, зв'яжіться з нами:
            </p>
            <ul className="list-none space-y-2">
              <li>📧 Email: privacy@panda-hookah.com</li>
              <li>📧 Офіцер з захисту даних: dpo@panda-hookah.com</li>
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