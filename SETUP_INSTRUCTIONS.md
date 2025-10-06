# 🚀 Інструкції по налаштуванню PANDA Lounge

## ✅ Що вже зроблено:

### 1. База даних
- ✅ SQLite база даних створена та налаштована
- ✅ Всі таблиці створені через Prisma
- ✅ Тестові дані завантажені (користувачі, персонал, події, FAQ)

### 2. API ключі
- ✅ Google OAuth налаштовано (Client ID та Secret додані в .env)
- ✅ Google Maps API налаштовано
- ✅ NextAuth налаштовано з безпечним секретом

### 3. Видалено LiqPay
- ✅ Всі згадки LiqPay видалені з коду
- ✅ Система чайових перероблена: тепер показує номер картки персоналу
- ✅ Кнопка "Копіювати" для легкого копіювання номера картки
- ✅ FAQ та Admin панель оновлені

### 4. Структура проекту
- ✅ Видалено package-lock.json (використовуємо yarn)
- ✅ Очищено від непотрібних файлів
- ✅ Створено API endpoint для отримання персоналу

---

## 🔧 Що потрібно зробити ВАМ:

### Налаштування Google OAuth (ОБОВ'ЯЗКОВО!)

Щоб вхід через Google працював, виконайте ці кроки:

1. **Відкрийте Google Cloud Console**
   - Перейдіть на: https://console.cloud.google.com/

2. **Виберіть проект**
   - Ваш Client ID из Google Cloud Console
   - Знайдіть проект з цим ID або виберіть існуючий проект

3. **Налаштуйте OAuth consent screen** (якщо ще не налаштовано)
   - Перейдіть: APIs & Services → OAuth consent screen
   - Тип: External (для тестування)
   - Заповніть:
     - App name: **PANDA Lounge**
     - User support email: ваш email
     - Developer contact: ваш email
   - Додайте Test Users (ваш email для тестування)

4. **Додайте Authorized Redirect URI**
   - Перейдіть: APIs & Services → Credentials
   - Знайдіть OAuth 2.0 Client ID з вашим ID
   - Натисніть Edit (редагувати)
   - В розділі "Authorized redirect URIs" додайте:
     ```
     https://easy-launch-tool.preview.emergentagent.com/api/auth/callback/google
     ```
   - **ВАЖЛИВО:** Натисніть ENTER після вводу URL
   - Натисніть "Save" (Зберегти)
   - Також додайте для localhost (якщо тестуєте локально):
     ```
     http://localhost:3000/api/auth/callback/google
     ```

5. **Зачекайте 5 хвилин**
   - Google потребує час для застосування змін

6. **Тестування**
   - Відкрийте: https://easy-launch-tool.preview.emergentagent.com/auth/login
   - Натисніть "Увійти через Google"
   - Має працювати!

---

## 🎯 Тестові облікові записи

Ви можете також увійти через email/password:

### Адміністратор:
- Email: `admin@panda.com`
- Password: `admin123`
- Роль: admin (повний доступ)

### Демо користувач:
- Email: `demo@panda.com`
- Password: `demo123`
- Роль: guest (звичайний користувач)

### Персонал:
- Email: `staff@panda.com`
- Password: `staff123`
- Роль: staff (персонал)

---

## 🏃 Як запустити проект

Проект вже запущено на порту 3000!

Якщо потрібно перезапустити:

```bash
cd /app
npm run dev
```

Відкрийте в браузері: https://easy-launch-tool.preview.emergentagent.com

---

## 💳 Як працюють чайові тепер

1. Користувач натискає на кнопку "Чайові майстру"
2. Вибирає персонал зі списку
3. Вводить суму чайових
4. Бачить номер картки обраного працівника
5. Натискає "Копіювати" щоб скопіювати номер картки
6. Робить переказ самостійно через банкінг

**Номери карток персоналу** (для тесту):
- Олександр: `5375414112347893`
- Марія: `5168742312345678`
- Дмитро: `4149439112345678`

Ви можете змінити ці номери в базі даних через Prisma Studio:
```bash
npm run prisma:studio
```

---

## 📦 Деплой на хостинг (коли купите)

Коли будете деплоїти на справжній хостинг:

1. **Оновіть .env файл**
   ```env
   NEXTAUTH_URL="https://ваш-домен.com"
   APP_URL="https://ваш-домен.com"
   NEXTAUTH_SECRET="новий-секретний-ключ"  # Згенеруйте: openssl rand -base64 32
   ```

2. **Додайте новий Redirect URI в Google Console**
   ```
   https://ваш-домен.com/api/auth/callback/google
   ```

3. **База даних для Production**
   - Рекомендую використати PostgreSQL
   - Оновіть DATABASE_URL в .env
   - Змініть provider в prisma/schema.prisma на "postgresql"
   - Запустіть: `npx prisma migrate deploy`

---

## 🆘 Якщо щось не працює

### Google OAuth показує помилку 400
- Перевірте чи додали redirect URI в Google Console
- Зачекайте 5-10 хвилин після додавання
- Переконайтесь що URL точно: `http://localhost:3000/api/auth/callback/google`

### Персонал не відображається в модалці чайових
- Перевірте чи запустили seed: `npm run prisma:seed`
- Відкрийте Prisma Studio та перевірте таблицю Staff

### Сервер не запускається
- Перевірте чи порт 3000 вільний
- Видаліть .next папку: `rm -rf .next`
- Заново зробіть build: `npm run build`

---

## 📞 Контакти для підтримки

Якщо виникли питання:
1. Перевірте логи в консолі браузера (F12)
2. Перевірте логи сервера в терміналі
3. Перевірте файл `/tmp/nextjs.log`

---

**Статус:** ✅ Готово до використання!
**Дата:** 2025 рік
