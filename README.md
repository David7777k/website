# 🐼 PANDA Lounge - Система управления кальянной

Современное full-stack приложение для управления кальянной с админ-панелью, системой бронирования, промокодами, джукбоксом и QR-визитами.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.16-teal)](https://www.prisma.io/)
[![Production Ready](https://img.shields.io/badge/Production-Ready-green)](/)

---

## 🚀 Быстрый старт

```bash
# Установка
yarn install

# Настройка БД
npx prisma generate
npx prisma migrate dev
npm run prisma:seed

# Запуск
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000)

**Тестовые аккаунты:**
- 👑 Admin: `admin@panda.com` / `admin123`
- 👤 User: `demo@panda.com` / `demo123`
- 👨‍💼 Staff: `staff@panda.com` / `staff123`

---

## 🛠️ Технологии

**Frontend:** Next.js 15.5 • React 18 • TypeScript • Tailwind CSS  
**Backend:** Next.js API Routes • NextAuth.js  
**Database:** SQLite (dev) / PostgreSQL (prod) • Prisma ORM  
**Auth:** NextAuth с Google OAuth + Email/Password

---

## ✨ Основные функции

### Для гостей
✅ Просмотр меню, событий, FAQ  
✅ Регистрация и авторизация

### Для пользователей
✅ Личный кабинет с историей визитов  
✅ Колесо фортуны (раз в день)  
✅ QR-коды для подтверждения визитов  
✅ Промокоды и бонусы  
✅ Реферальная программа  
✅ Заказ музыки (джукбокс)  
✅ Чаевые персоналу

### Для персонала
✅ Staff панель с статистикой смены  
✅ Сканер QR-кодов для визитов  
✅ Модерация музыкальных заказов  
✅ Создание промокодов (2 в неделю)

### Для админов
✅ Управление пользователями  
✅ Risk-доска (мониторинг подозрительной активности)  
✅ Управление промокодами  
✅ Управление событиями и меню  
✅ Настройки системы и логи действий  
✅ Расширенная аналитика

---

## 🏗️ Архитектура

### Структура проекта

```
/app
├── app/                  # Next.js App Router
│   ├── admin/           # Админ-панель
│   ├── staff/           # Панель персонала
│   ├── profile/         # Профиль пользователя
│   ├── api/             # API routes (30+ endpoints)
│   └── components/      # React компоненты (40+)
├── lib/                 # Утилиты
│   ├── auth-system.ts   # NextAuth конфиг
│   ├── qr-system.ts     # QR система с HMAC
│   └── prisma.ts        # Prisma клиент
├── prisma/
│   └── schema.prisma    # 18 моделей БД
└── public/              # Статические файлы
```

### RBAC (Role-Based Access Control)

**4 роли:** Guest → User → Staff → Admin

**Защита на 3 уровнях:**
1. **Middleware** - Защита маршрутов `/admin/*`, `/staff/*`
2. **API** - Проверка роли в каждом endpoint
3. **UI** - Скрытие элементов по ролям

### QR Система

**Безопасность:**
- HMAC-SHA256 подпись
- TTL (60 минут)
- Anti-replay (nonce проверка)
- Аудит всех валидаций

**Типы QR:**
- `visit` - Подтверждение визита
- `promo` - Активация промокода
- `referral` - Реферальная программа
- `staff_check` - Проверка персонала (только admin)

**API:**
- `POST /api/qr/generate` - Генерация QR с PNG
- `POST /api/qr/validate` - Валидация и логирование

---

## 🗄️ База данных

### Основные модели (18 total)

**Аутентификация:** User, Account, Session  
**QR Система:** QRValidationEvent, Visit  
**Промо:** PromoCode, PromoUsage, Coupon  
**Колесо:** WheelSpin, WheelPrize  
**Другое:** MusicOrder, Referral, Tip, Staff, Event, MenuItem, FAQ

### Перехід на PostgreSQL (Production)

**Крок 1:** Оновіть `prisma/schema.prisma`
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

**Крок 2:** Оновіть `.env`
```bash
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host:5432/panda_lounge?schema=public"
```

**Крок 3:** Виконайте міграції
```bash
# Deploy migrations to PostgreSQL
npx prisma migrate deploy

# Generate Prisma Client
npx prisma generate

# Seed initial data
npm run prisma:seed
```

**Рекомендовані провайдери PostgreSQL:**
- [Supabase](https://supabase.com) - Безкоштовний план
- [Neon](https://neon.tech) - Serverless PostgreSQL
- [Vercel Postgres](https://vercel.com/storage/postgres) - Інтеграція з Vercel

---

## 🚀 Деплой на Vercel

### Подготовка

1. **Создайте PostgreSQL БД** (Vercel Postgres / Supabase / Neon)
2. **Сгенерируйте секреты:**
   ```bash
   # NEXTAUTH_SECRET
   openssl rand -base64 32
   
   # QR_SECRET
   openssl rand -base64 32
   ```

### Deployment

```bash
# Через GitHub (рекомендуется)
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo>
git push -u origin main

# Vercel автоматически определит Next.js
# Добавьте environment variables в Vercel Dashboard
```

### Environment Variables (Vercel)

```bash
DATABASE_URL="postgresql://..."
NEXTAUTH_URL="https://your-app.vercel.app"
NEXTAUTH_SECRET="your-generated-secret"
QR_SECRET="your-generated-secret"
QR_TTL_MINUTES="60"
GOOGLE_CLIENT_ID="your-google-id"
GOOGLE_CLIENT_SECRET="your-google-secret"
APP_NAME="PANDA Lounge"
APP_URL="https://your-app.vercel.app"
NODE_ENV="production"
```

### Google OAuth Setup

1. [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. Добавьте Authorized Redirect URI:
   ```
   https://your-app.vercel.app/api/auth/callback/google
   ```

### После деплоя

```bash
# Запустите миграции
npx prisma migrate deploy

# Заполните начальными данными
npm run prisma:seed

# Измените пароли по умолчанию!
```

---

## 🔐 Безопасность

### Реализовано ✅

- NextAuth.js с secure cookies
- bcrypt хеширование паролей (12 rounds)
- CSRF защита (встроена)
- HMAC-SHA256 для QR кодов
- Anti-replay защита
- Role-based access control (3 уровня)
- Audit logging (AdminLog, QRValidationEvent)
- Prisma ORM (защита от SQL injection)

### Рекомендации для production ⚠️

- Добавьте rate limiting на auth endpoints
- Ротируйте секреты каждые 90 дней
- Включите HTTPS (автоматически на Vercel)
- Рассмотрите 2FA для админов
- Настройте мониторинг ошибок (Sentry)

---

## 🎨 Design System

**Тема:** Premium Dark с Bamboo Green accent  
**Цвета:**
- Base: `#0F172A` (Dark Navy)
- Accent: `#10B981` (Bamboo Green)
- Text: `#E5E7EB` (Light Gray)

**Компоненты:**
- Buttons (primary, secondary, ghost, danger)
- Glass morphism cards
- Loading skeletons
- Empty states
- Error boundaries

**Responsive:**
- Mobile: Bottom dock навигация
- Desktop: Top навигация
- Breakpoints: sm, md, lg, xl

---

## 👨‍💻 Разработка

### Команды

```bash
npm run dev              # Dev сервер
npm run build            # Production build
npm run start            # Production сервер
npm run lint             # ESLint

npx prisma studio        # GUI для БД
npx prisma generate      # Генерация Prisma Client
npx prisma migrate dev   # Создание миграции
npm run prisma:seed      # Заполнение тестовыми данными
```

### Структура API

```
/api/
├── auth/               # NextAuth endpoints
├── admin/              # Admin endpoints (admin only)
│   ├── users           # Управление пользователями
│   ├── promos          # Управление промокодами
│   └── settings        # Системные настройки
├── staff/              # Staff endpoints (staff + admin)
│   ├── events          # События персонала
│   └── rate            # Рейтинги
├── qr/                 # QR система
│   ├── generate        # Генерация QR
│   ├── validate        # Валидация QR
│   └── stats           # Статистика
├── user/               # User endpoints
│   └── referrals       # Реферальная программа
└── wheel/              # Колесо фортуны
    └── spin            # Крутить колесо
```

### Добавление новой роли

1. Обновите Prisma schema:
   ```prisma
   model User {
     role String @default("guest") // guest, user, staff, admin, moderator
   }
   ```

2. Обновите middleware (`/app/middleware.ts`)
3. Обновите API проверки
4. Обновите UI компоненты

---

## 🧪 Тестирование

### Ручное тестирование

```bash
# Запустите сервер
npm run dev

# Тестируйте флоу:
# 1. Регистрация нового пользователя
# 2. Авторизация (email + Google OAuth)
# 3. Генерация QR кода
# 4. Сканирование QR (staff account)
# 5. Админ панель (admin account)
```

### Автоматическое тестирование (TODO)

```bash
# Установите зависимости
yarn add -D vitest @testing-library/react playwright

# Структура тестов
/tests/
  /unit/          # Юнит-тесты
  /integration/   # Интеграционные тесты
  /e2e/           # E2E тесты (Playwright)
```

---

## 📊 Производительность

**Lighthouse Score (ожидаемый):**
- Performance: ~85/100
- Accessibility: ~90/100
- Best Practices: ~95/100
- SEO: ~85/100

**Оптимизации:**
- ✅ Code splitting (Next.js automatic)
- ✅ Lazy loading
- ✅ CSS purging (Tailwind)
- ✅ Font optimization
- ⚠️ Используйте `next/image` для всех изображений
- ⚠️ Добавьте sitemap.xml и robots.txt

---

## 🐛 Troubleshooting

### Ошибка: Module not found

```bash
rm -rf node_modules .next
yarn install
npm run dev
```

### Ошибка: База данных

```bash
rm -f prisma/dev.db
npx prisma migrate dev --name init
npm run prisma:seed
```

### Ошибка: Google OAuth 400

- Проверьте redirect URI в Google Console
- Убедитесь: `http://localhost:3000/api/auth/callback/google`
- Подождите 5-10 минут после изменений

### Ошибка: Порт 3000 занят

```bash
# Найдите и остановите процесс
lsof -ti:3000 | xargs kill -9

# Или используйте другой порт
PORT=3001 npm run dev
```

---

## 🎉 What's New in v2.1

### ✅ Критичні фікси
- **Навігація:** Виправлено всі некоректні посилання та якорі
- **Колесо фортуни:** Реалізовано FSM з серверною валідацією та анті-абузом
- **NextAuth:** Стабільна авторизація з правильними callbacks

### 🎡 Колесо фортуни v2.1
- FSM states: LOCKED → READY → SPINNING → RESULT → COOLDOWN
- Серверна валідація (7 днів кулдаун)
- Транзакційна видача призів
- Audit logging всіх дій
- API: `GET /api/wheel/status`, `POST /api/wheel/spin`

### 🗄️ База даних
- Додано AuditLog для логування
- Оновлено WheelSpin та WheelPrize з новими полями
- Підготовка до PostgreSQL (production ready)

Детальний список змін: [CHANGELOG.md](./CHANGELOG.md)

---

## 📈 Roadmap

### v2.2 (Наступний реліз)
- [ ] PostgreSQL для production
- [ ] E2E tests (Playwright)
- [ ] Покращена админ-панель з CRUD та статистикою
- [ ] Rate limiting на API
- [ ] Real-time notifications (WebSocket)

### v3.0 (Будущее)
- [ ] Mobile app (React Native)
- [ ] Telegram bot
- [ ] Payment integration (Stripe/Fondy)
- [ ] CRM система
- [ ] ML recommendations

---

## 📄 Лицензия

MIT License - используйте свободно!

---

## 🤝 Contributing

Pull requests приветствуются! Для больших изменений сначала откройте issue.

---

## 📞 Поддержка

### Полезные ссылки

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth Docs](https://next-auth.js.org/)
- [Tailwind Docs](https://tailwindcss.com/docs)

### Deployment

- [Vercel](https://vercel.com)
- [Supabase](https://supabase.com)
- [Neon](https://neon.tech)

---

## ✨ Features Checklist

- [x] 🔐 Аутентификация (Email + Google OAuth)
- [x] 👥 RBAC (4 роли)
- [x] 📱 QR система (HMAC-SHA256)
- [x] 🎡 Колесо фортуны
- [x] 🎟️ Промокоды
- [x] 👫 Реферальная программа
- [x] 🎵 Джукбокс с модерацией
- [x] 💰 Система чаевых
- [x] ⭐ Рейтинг персонала
- [x] 📅 Управление событиями
- [x] 🍽️ Меню
- [x] 📊 Админ-панель
- [x] 📱 Responsive design
- [x] 🎨 Dark theme
- [x] 📖 Документация

---

**Версія:** 2.1.0  
**Статус:** ✅ Production Ready  
**Останнє оновлення:** Січень 2025

**Создано с ❤️ для современных кальянных и лаунж-баров 🐼**
