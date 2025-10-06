# 🐼 PANDA Lounge - Система управления кальянной

Современное full-stack веб-приложение для управления кальянной с админ-панелью, системой бронирования, промокодами, джукбоксом и реферальной программой.

[![Next.js](https://img.shields.io/badge/Next.js-15.5-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6.16-teal)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## 📋 Содержание

- [Технологический стек](#-технологический-стек)
- [Быстрый старт](#-быстрый-старт)
- [Основной функционал](#-основной-функционал)
- [Структура проекта](#-структура-проекта)
- [База данных](#-база-данных)
- [API ключи и настройка](#-api-ключи-и-настройка)
- [Тестовые данные](#-тестовые-данные)
- [Деплой на production](#-деплой-на-production)
- [Решение проблем](#-решение-проблем)
- [Безопасность](#-безопасность)

---

## 🚀 Технологический стек

### Frontend
- **Next.js 15.5** - React framework с App Router
- **React 18** - UI библиотека
- **TypeScript** - Типизация
- **Tailwind CSS** - Стилизация
- **Framer Motion** - Анимации

### Backend
- **Next.js API Routes** - Серверные эндпоинты
- **NextAuth.js** - Аутентификация (Google OAuth + Email/Password)
- **Prisma ORM** - Работа с БД

### База данных
- **SQLite** (для разработки)
- **PostgreSQL** (рекомендуется для production)

### Дополнительно
- **qrcode** - Генерация QR-кодов
- **bcryptjs** - Хеширование паролей
- **date-fns** - Работа с датами
- **uuid** - Уникальные идентификаторы

---

## ⚡ Быстрый старт

### Предварительные требования
- Node.js 18+
- yarn (или npm)

### Установка (автоматически)

```bash
# Сделайте скрипт исполняемым и запустите
chmod +x start.sh && ./start.sh
```

Скрипт автоматически:
- ✅ Создаст `.env` файл
- ✅ Установит зависимости
- ✅ Настроит базу данных
- ✅ Заполнит тестовыми данными
- ✅ Запустит сервер на http://localhost:3000

### Установка (вручную)

```bash
# 1. Установите зависимости
yarn install

# 2. Создайте .env файл
cp .env.example .env
# Отредактируйте .env с вашими ключами

# 3. Настройте базу данных
npx prisma generate
npx prisma migrate dev --name init

# 4. Заполните тестовыми данными
npm run prisma:seed

# 5. Запустите сервер
npm run dev
```

Откройте: **http://localhost:3000**

### Доступные команды

```bash
npm run dev              # Запуск в режиме разработки
npm run build            # Сборка для продакшна
npm run start            # Запуск продакшн сервера
npm run lint             # Проверка кода
npm run prisma:studio    # Открыть Prisma Studio (GUI для БД)
npm run prisma:seed      # Заполнить БД тестовыми данными
npm run prisma:generate  # Генерация Prisma Client
npm run prisma:migrate   # Применить миграции
```

---

## ✨ Основной функционал

### 🎯 Для пользователей

#### Авторизация и профиль
- 🔐 **Двойная авторизация**: Google OAuth или Email/Password
- 👤 **Личный кабинет**: История визитов, бонусы, купоны
- 🎂 **Бонус на день рождения**: Автоматические подарки
- 📱 **Персональный QR-код**: Для быстрой идентификации

#### Развлечения и бонусы
- 🎡 **Колесо фортуны**: Ежедневные розыгрыши призов с настраиваемыми вероятностями
- 🎟️ **Промокоды**: Система скидок и акций
- 👥 **Реферальная программа**: Приглашай друзей, получай бонусы
- 💰 **Накопительная система**: Бонусы за визиты

#### Интерактив
- 🎵 **Джукбокс**: Заказ музыки с модерацией персонала
- ⭐ **Рейтинг персонала**: Оценка обслуживания
- 💳 **Чаевые**: Прямые переводы на карты сотрудников
- 📱 **QR-визиты**: Подтверждение посещений через QR-коды

#### Информация
- 🍃 **Меню**: Интерактивное меню кальянов, блюд и напитков
- 📅 **Афиша событий**: Актуальные мероприятия
- ❓ **FAQ**: Ответы на частые вопросы
- 📍 **Контакты**: Адрес, карта, социальные сети

### 👨‍💼 Для персонала

- 📱 **Staff панель**: Компактный интерфейс для работы
- ✅ **Подтверждение визитов**: Сканирование QR-кодов гостей
- 🎵 **Модерация музыки**: Одобрение/отклонение треков
- 📊 **Статистика смены**: Визиты, чаевые, рейтинги в реальном времени
- 🎁 **Создание промокодов**: Лимит 2 промокода в неделю
- 🔔 **Уведомления**: Real-time алерты о событиях
- 💰 **Отслеживание чаевых**: История и аналитика

### 🛡️ Для администраторов

#### Дашборд и аналитика
- 📊 **Главный Dashboard**: Полная статистика бизнеса
- 📈 **Расширенная аналитика**: 
  - Визиты по дням/неделям/месяцам
  - Динамика доходов
  - Популярность блюд и напитков
  - Конверсия промокодов
  - Активность рефералов

#### Управление пользователями
- 👥 **База пользователей**: Полный CRUD
- 🚨 **Риск-доска**: Выявление подозрительной активности
- 🏆 **Система рангов**: VIP, обычные, новички
- 🚫 **Бан-система**: Временная или постоянная блокировка

#### Управление контентом
- 🎟️ **Промокоды**: Создание, редактирование, QR-генерация
- 🎡 **Колесо фортуны**: Настройка призов и вероятностей
- 🎵 **Музыкальная библиотека**: Управление треками
- 🍃 **Меню**: Добавление/редактирование позиций
- 📅 **События**: Управление афишей мероприятий
- ❓ **FAQ**: Редактирование вопросов-ответов

#### Системное управление
- ⚙️ **Настройки**: Глобальные параметры приложения
- 📝 **Логи действий**: Полный audit trail
- 👨‍💼 **Управление персоналом**: Добавление, редактирование, статистика
- 💳 **Карты для чаевых**: Привязка банковских карт к сотрудникам

---

## 📁 Структура проекта

```
/app
├── app/                      # Next.js App Router
│   ├── admin/               # Админ-панель
│   │   ├── analytics/       # Расширенная аналитика
│   │   ├── users/           # Управление пользователями
│   │   ├── promos/          # Управление промокодами
│   │   ├── settings/        # Системные настройки
│   │   └── logs/            # Логи действий
│   ├── analytics/           # Общая аналитика
│   ├── api/                 # API routes
│   │   ├── auth/            # Аутентификация (NextAuth)
│   │   ├── users/           # Пользователи
│   │   ├── events/          # События
│   │   ├── wheel/           # Колесо фортуны
│   │   ├── music/           # Джукбокс
│   │   ├── promos/          # Промокоды
│   │   ├── staff/           # Персонал
│   │   └── tips/            # Чаевые
│   ├── auth/                # Страницы авторизации
│   │   ├── login/           # Вход
│   │   ├── register/        # Регистрация
│   │   └── error/           # Ошибки OAuth
│   ├── bookings/            # Бронирование столов
│   ├── components/          # React компоненты
│   │   ├── ui/              # UI компоненты
│   │   ├── BottomDock.tsx   # Навигация
│   │   ├── TipsModal.tsx    # Модалка чаевых
│   │   └── WheelModal.tsx   # Колесо фортуны
│   ├── events/              # Афиша событий
│   ├── faq/                 # FAQ
│   ├── legal/               # Юридические документы
│   ├── menu/                # Меню
│   ├── music/               # Джукбокс
│   ├── profile/             # Профиль пользователя
│   ├── promos/              # Промокоды
│   ├── qr-generator/        # Генератор QR
│   ├── referrals/           # Реферальная программа
│   ├── scan/                # Сканер QR
│   ├── staff/               # Панель персонала
│   ├── visit-confirmation/  # Подтверждение визитов
│   ├── layout.tsx           # Основной layout
│   ├── page.tsx             # Главная страница
│   ├── globals.css          # Глобальные стили
│   └── providers.tsx        # React провайдеры
│
├── lib/                     # Утилиты и хелперы
│   ├── auth-system.ts       # Система авторизации
│   ├── auth.ts              # NextAuth конфиг
│   ├── prisma.ts            # Prisma клиент
│   ├── qr.ts                # Генерация QR
│   ├── settings.ts          # Настройки
│   ├── spotify.ts           # Spotify интеграция
│   ├── tips.ts              # Логика чаевых
│   ├── maps.ts              # Google Maps
│   └── init.ts              # Инициализация
│
├── pages/                   # Pages Router (для NextAuth)
│   └── api/
│       └── auth/            # NextAuth endpoints
│
├── prisma/                  # Prisma ORM
│   ├── schema.prisma        # Схема БД
│   └── dev.db               # SQLite база (для dev)
│
├── public/                  # Статические файлы
│   ├── images/              # Изображения
│   └── icons/               # Иконки
│
├── scripts/                 # Утилитарные скрипты
│   └── seed.ts              # Заполнение БД тестовыми данными
│
├── .env                     # Переменные окружения (не в Git!)
├── .env.example             # Пример .env файла
├── .gitignore               # Игнорируемые файлы
├── middleware.ts            # Next.js middleware
├── next.config.js           # Конфигурация Next.js
├── package.json             # Зависимости
├── postcss.config.cjs       # PostCSS конфиг
├── tailwind.config.js       # Tailwind конфиг
├── tsconfig.json            # TypeScript конфиг
├── start.sh                 # Скрипт автозапуска
└── README.md                # Эта документация
```

---

## 🗄️ База данных

### Модели Prisma

Приложение использует следующие модели:

#### Пользователи и авторизация
- **User** - Основная информация о пользователях
- **Account** - OAuth аккаунты (Google)
- **Session** - Сессии пользователей
- **VerificationToken** - Токены для верификации

#### Основной функционал
- **Event** - События и мероприятия
- **WheelSpin** - История вращений колеса фортуны
- **WheelPrize** - Призы колеса фортуны
- **Coupon** - Купоны пользователей
- **PromoCode** - Промокоды
- **PromoUsage** - История использования промокодов
- **MusicOrder** - Заказы музыки
- **Referral** - Реферальная программа
- **ReferralCheckin** - Отметки рефералов
- **Tip** - Чаевые
- **Staff** - Персонал
- **StaffRating** - Рейтинги персонала
- **Visit** - Визиты посетителей
- **MenuItem** - Позиции меню
- **FAQ** - Вопросы и ответы
- **InstagramStory** - Instagram истории
- **Notification** - Уведомления
- **AdminLog** - Логи действий админов
- **SystemSettings** - Системные настройки

### Переключение на PostgreSQL (для production)

1. Измените в `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

2. Обновите `DATABASE_URL` в `.env`:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/panda_lounge"
```

3. Примените миграции:
```bash
npx prisma migrate deploy
npm run prisma:seed
```

---

## 🔑 API ключи и настройка

### Создание .env файла

Создайте файл `.env` в корне проекта:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-change-in-production"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Google Maps API (опционально)
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Spotify API (опционально)
SPOTIFY_CLIENT_ID="your-spotify-client-id"
SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"

# Application Settings
APP_NAME="PANDA Lounge"
APP_URL="http://localhost:3000"
NODE_ENV="development"
```

### Настройка Google OAuth

#### Шаг 1: Создайте проект в Google Cloud Console

1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Создайте новый проект или выберите существующий

#### Шаг 2: Настройте OAuth Consent Screen

1. Перейдите: **APIs & Services** → **OAuth consent screen**
2. Выберите **External** (для тестирования)
3. Заполните:
   - App name: **PANDA Lounge**
   - User support email: ваш email
   - Developer contact email: ваш email
4. Нажмите **Save and Continue**
5. Пропустите Scopes → **Save and Continue**
6. Добавьте Test Users (ваш email) → **Save and Continue**

#### Шаг 3: Создайте OAuth Client ID

1. Перейдите: **APIs & Services** → **Credentials**
2. Нажмите **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Application type: **Web application**
4. Name: **PANDA Lounge Web Client**

#### Шаг 4: Добавьте Authorized Redirect URIs

⚠️ **Критически важный шаг!**

Для разработки:
```
http://localhost:3000/api/auth/callback/google
```

Для production:
```
https://your-domain.com/api/auth/callback/google
```

#### Шаг 5: Скопируйте ключи

- Скопируйте **Client ID**
- Скопируйте **Client Secret**
- Добавьте их в `.env` файл

#### Шаг 6: Подождите 5-10 минут

Google требуется время для применения изменений.

### Альтернатива: Вход без Google OAuth

Можно использовать только Email/Password авторизацию - настройка Google OAuth опциональна.

---

## 🧪 Тестовые данные

### Учетные записи

После выполнения `npm run prisma:seed` будут созданы:

| Роль | Email | Пароль | Доступ |
|------|-------|--------|--------|
| 👑 **Администратор** | admin@panda.com | admin123 | Полный доступ ко всему |
| 👤 **Пользователь** | demo@panda.com | demo123 | Обычный пользователь |
| 👨‍💼 **Персонал** | staff@panda.com | staff123 | Staff панель |

### Персонал с картами для чаевых

1. **Олександр**
   - Instagram: @alex_hookah
   - Картка: 5375414112347893

2. **Марія**
   - Instagram: @maria_lounge
   - Картка: 5168742312345678

3. **Дмитро**
   - Instagram: @dima_master
   - Картка: 4149439112345678

### Демо данные

- ✅ 7 сотрудников с карточками для чаевых
- ✅ События и афиша
- ✅ FAQ записи
- ✅ Призы для колеса фортуны (с вероятностями)
- ✅ Позиции меню (кальяны, напитки, закуски)
- ✅ Промокоды для тестирования
- ✅ Системные настройки

---

## 🚀 Деплой на production

### Вариант 1: Vercel (Рекомендуется)

#### Преимущества
- ✅ Автоматический деплой при push в Git
- ✅ Бесплатный SSL сертификат
- ✅ CDN и оптимизация
- ✅ Простая настройка environment variables
- ✅ Интеграция с PostgreSQL

#### Шаги

1. **Push в GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/your-username/panda-lounge.git
git push -u origin main
```

2. **Деплой на Vercel**
   - Зайдите на [vercel.com](https://vercel.com)
   - Import Project → выберите репозиторий
   - Vercel автоматически определит Next.js

3. **Настройте Environment Variables**

В Vercel Dashboard → Settings → Environment Variables:
```
NEXTAUTH_URL = https://your-project.vercel.app
NEXTAUTH_SECRET = [сгенерируйте: openssl rand -base64 32]
DATABASE_URL = [ваш PostgreSQL URL]
GOOGLE_CLIENT_ID = your-google-client-id
GOOGLE_CLIENT_SECRET = your-google-client-secret
APP_URL = https://your-project.vercel.app
NODE_ENV = production
```

4. **Подключите PostgreSQL**
   - [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
   - Или [Supabase](https://supabase.com/)
   - Или [Railway](https://railway.app/)
   - Или [Neon](https://neon.tech/)

5. **Примените миграции**
```bash
npx prisma migrate deploy
npm run prisma:seed
```

6. **Обновите Google OAuth**

Добавьте в Google Console:
```
https://your-project.vercel.app/api/auth/callback/google
```

### Вариант 2: VPS (Ubuntu/Debian) с PM2

#### Подготовка сервера

```bash
# Обновите систему
sudo apt update && sudo apt upgrade -y

# Установите Node.js 18
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# Установите Yarn и PM2
sudo npm install -g yarn pm2

# Установите PostgreSQL
sudo apt install postgresql postgresql-contrib -y
```

#### Настройка PostgreSQL

```bash
sudo -u postgres psql

CREATE DATABASE panda_lounge;
CREATE USER panda_user WITH PASSWORD 'strong_password';
GRANT ALL PRIVILEGES ON DATABASE panda_lounge TO panda_user;
\q
```

#### Деплой приложения

```bash
# Клонируйте проект
cd /var/www
git clone https://github.com/your-username/panda-lounge.git
cd panda-lounge

# Создайте .env файл
nano .env
# Добавьте production переменные

# Измените provider в schema.prisma на postgresql

# Установите зависимости и соберите
yarn install
npx prisma generate
npx prisma migrate deploy
npm run prisma:seed
npm run build

# Запустите с PM2
pm2 start npm --name "panda-lounge" -- start
pm2 save
pm2 startup
```

#### Настройка Nginx

```bash
sudo apt install nginx -y
sudo nano /etc/nginx/sites-available/panda-lounge
```

Добавьте конфигурацию:
```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активируйте:
```bash
sudo ln -s /etc/nginx/sites-available/panda-lounge /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

#### Установка SSL (Let's Encrypt)

```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com
```

### Чек-лист миграции на production

- [ ] ✅ Обновлен `.env` с production URLs
- [ ] ✅ Сгенерирован новый `NEXTAUTH_SECRET`
- [ ] ✅ Изменен provider в `schema.prisma` на `postgresql`
- [ ] ✅ База данных PostgreSQL создана
- [ ] ✅ Миграции применены
- [ ] ✅ Google OAuth callback URL обновлен
- [ ] ✅ Проект собран (`npm run build`)
- [ ] ✅ SSL сертификат установлен
- [ ] ✅ Тестирование всех функций

---

## 🔧 Решение проблем

### Проблема: Module not found

```bash
# Переустановите зависимости
rm -rf node_modules
yarn install
npm run dev
```

### Проблема: База данных не работает

```bash
# Пересоздайте базу
rm -f prisma/dev.db
npx prisma migrate dev --name init
npm run prisma:seed
```

### Проблема: Google OAuth ошибка 400

**Причина:** Неправильный redirect URI

**Решение:**
1. Проверьте Google Console
2. Убедитесь что URI точно: `http://localhost:3000/api/auth/callback/google`
3. Подождите 5-10 минут
4. Попробуйте снова

### Проблема: Порт 3000 занят

```bash
# Найдите и остановите процесс
lsof -ti:3000 | xargs kill -9

# Или запустите на другом порту
PORT=3001 npm run dev
```

### Проблема: Prisma Client не синхронизирован

```bash
npx prisma generate
npx prisma migrate dev
```

### Проблема: Стили не применяются

```bash
# Убедитесь что Tailwind установлен
yarn add -D tailwindcss postcss autoprefixer

# Перезапустите
rm -rf .next
npm run dev
```

### Проблема: Ошибка 500 на сервере

```bash
# Проверьте логи
tail -100 /tmp/nextjs.log

# Перегенерируйте Prisma Client
npx prisma generate

# Перезапустите
npm run dev
```

### Полезные команды для отладки

```bash
# Проверка версий
node --version
yarn --version
npx prisma --version

# Открыть Prisma Studio
npm run prisma:studio

# Проверка миграций
npx prisma migrate status

# Сброс БД (ОСТОРОЖНО!)
npx prisma migrate reset

# Просмотр логов
tail -f /tmp/nextjs.log

# Проверка портов
netstat -tulpn | grep 3000
```

---

## 🔐 Безопасность

### Что настроено

- ✅ **NextAuth.js** - Безопасная аутентификация
- ✅ **CSRF защита** - Встроена в NextAuth
- ✅ **Хеширование паролей** - bcrypt
- ✅ **Защита от SQL инъекций** - Prisma ORM
- ✅ **Secure cookies** - httpOnly, secure
- ✅ **Rate limiting** - На критичных API endpoints
- ✅ **Валидация данных** - На всех входах

### Рекомендации для production

⚠️ **Обязательно:**
- Сгенерируйте новый `NEXTAUTH_SECRET`: `openssl rand -base64 32`
- Используйте HTTPS (SSL сертификат)
- Настройте регулярные бэкапы БД
- Используйте environment variables, а не .env файл
- Мониторинг логов и ошибок
- Rate limiting на API

⚠️ **Не коммитьте в Git:**
- `.env` файл (уже в .gitignore)
- Реальные API ключи
- Пароли и токены
- База данных

---

## 🎨 Кастомизация

### Цветовая схема

Откройте `tailwind.config.js`:
```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: '#84cc16',    // lime-500
        secondary: '#10b981',  // emerald-500
        // Добавьте свои цвета
      }
    }
  }
}
```

### Контакты и информация

Обновите в админ-панели → Настройки или через Prisma Studio.

### Логотип и изображения

Замените файлы в `public/` директории.

---

## 📞 Поддержка и контакты

### Документация

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

### Хостинг

- [Vercel](https://vercel.com) - Рекомендуется
- [Railway](https://railway.app) - PostgreSQL
- [Supabase](https://supabase.com) - PostgreSQL + Auth

---

## 📄 Лицензия

MIT License - используйте свободно для своих проектов!

---

## 👨‍💻 Разработка

### Roadmap

- [ ] Mobile приложение (React Native)
- [ ] Telegram бот для уведомлений
- [ ] Интеграция с платежными системами
- [ ] CRM для управления клиентами
- [ ] Система лояльности
- [ ] Analytics dashboard v2

### Contributing

Pull requests приветствуются! Для больших изменений сначала откройте issue.

---

**🎉 Готово к использованию! Удачи в развитии вашего бизнеса!**

**Версия:** 2.0  
**Дата:** Октябрь 2025  
**Статус:** ✅ Production Ready

Создано с ❤️ для современных кальянных и лаунж-баров.
