# 🚀 Миграция на Production Хостинг

## Быстрая инструкция по смене хостинга

### 1️⃣ Подготовка перед миграцией

**Что нужно:**
- Доменное имя (например, `panda-lounge.com`)
- Хостинг с поддержкой Node.js 18+ (Vercel, Netlify, или VPS)
- PostgreSQL база данных (для production)

### 2️⃣ Обновление конфигурации

#### A. Обновите `.env` файл

```env
# Production URLs
NEXTAUTH_URL="https://ваш-домен.com"
APP_URL="https://ваш-домен.com"

# Сгенерируйте новый секрет для production
NEXTAUTH_SECRET="ваш-новый-секретный-ключ"

# PostgreSQL база данных (вместо SQLite)
DATABASE_URL="postgresql://user:password@localhost:5432/panda_lounge"

# Google OAuth - получите свои ключи в Google Cloud Console
GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Остальные настройки...
NODE_ENV="production"
```

**Как сгенерировать NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

#### B. Обновите `prisma/schema.prisma`

Замените:
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

На:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

### 3️⃣ Настройка Google OAuth для Production

1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Перейдите: APIs & Services → Credentials
3. Найдите ваш OAuth 2.0 Client ID
4. **Добавьте новый Authorized Redirect URI:**
   ```
   https://ваш-домен.com/api/auth/callback/google
   ```
5. Сохраните изменения
6. Подождите 5-10 минут для применения

### 4️⃣ Деплой на различные платформы

---

## 🟢 Вариант 1: Vercel (Рекомендуется - Самый простой)

### Преимущества:
- ✅ Автоматический деплой при push в Git
- ✅ Бесплатный SSL сертификат
- ✅ CDN и оптимизация
- ✅ Простая настройка environment variables

### Шаги:

1. **Подготовка репозитория:**
   ```bash
   # Инициализируйте git (если еще не сделано)
   git init
   git add .
   git commit -m "Initial commit"
   
   # Создайте репозиторий на GitHub и push
   git remote add origin https://github.com/ваш-username/panda-lounge.git
   git push -u origin main
   ```

2. **Деплой на Vercel:**
   - Зайдите на [vercel.com](https://vercel.com)
   - Нажмите "Import Project"
   - Выберите ваш GitHub репозиторий
   - Vercel автоматически определит Next.js проект

3. **Настройка Environment Variables:**
   В Vercel Dashboard → Settings → Environment Variables добавьте:
   ```
   NEXTAUTH_URL = https://your-project.vercel.app
   NEXTAUTH_SECRET = [сгенерированный секрет]
   DATABASE_URL = [ваш PostgreSQL URL]
   GOOGLE_CLIENT_ID = your-google-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET = your-google-client-secret
   APP_URL = https://your-project.vercel.app
   NODE_ENV = production
   ```

4. **Настройка базы данных:**
   - Используйте [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres) (бесплатно до 256MB)
   - Или подключите [Supabase](https://supabase.com/), [Railway](https://railway.app/), или [Neon](https://neon.tech/)
   
   После подключения БД:
   ```bash
   # Примените миграции
   npx prisma migrate deploy
   
   # Заполните данными (опционально)
   npm run prisma:seed
   ```

5. **Добавьте Vercel URL в Google Console:**
   ```
   https://your-project.vercel.app/api/auth/callback/google
   ```

6. **Готово!** 🎉
   Vercel автоматически пере деплоит при каждом push в main ветку.

---

## 🔵 Вариант 2: VPS (Ubuntu/Debian) с PM2

### Преимущества:
- ✅ Полный контроль
- ✅ Можно настроить любую конфигурацию
- ✅ Подходит для сложных проектов

### Шаги:

1. **Подключитесь к VPS:**
   ```bash
   ssh root@your-server-ip
   ```

2. **Установите Node.js и зависимости:**
   ```bash
   # Обновите систему
   apt update && apt upgrade -y
   
   # Установите Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   apt-get install -y nodejs
   
   # Установите Yarn и PM2
   npm install -g yarn pm2
   
   # Установите PostgreSQL
   apt install postgresql postgresql-contrib -y
   ```

3. **Настройте PostgreSQL:**
   ```bash
   # Переключитесь на пользователя postgres
   sudo -u postgres psql
   
   # Создайте базу данных и пользователя
   CREATE DATABASE panda_lounge;
   CREATE USER panda_user WITH PASSWORD 'strong_password';
   GRANT ALL PRIVILEGES ON DATABASE panda_lounge TO panda_user;
   \q
   ```

4. **Клонируйте проект:**
   ```bash
   cd /var/www
   git clone https://github.com/your-username/panda-lounge.git
   cd panda-lounge
   ```

5. **Настройте .env файл:**
   ```bash
   nano .env
   ```
   
   Обновите:
   ```env
   NEXTAUTH_URL="https://ваш-домен.com"
   DATABASE_URL="postgresql://panda_user:strong_password@localhost:5432/panda_lounge"
   # ... остальные переменные
   ```

6. **Измените provider в schema.prisma на postgresql**

7. **Установите зависимости и соберите проект:**
   ```bash
   yarn install
   npx prisma generate
   npx prisma migrate deploy
   npm run prisma:seed
   npm run build
   ```

8. **Запустите с PM2:**
   ```bash
   pm2 start npm --name "panda-lounge" -- start
   pm2 save
   pm2 startup
   ```

9. **Настройте Nginx (реверс-прокси):**
   ```bash
   apt install nginx -y
   nano /etc/nginx/sites-available/panda-lounge
   ```
   
   Добавьте:
   ```nginx
   server {
       listen 80;
       server_name ваш-домен.com;
   
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
   
   Активируйте конфиг:
   ```bash
   ln -s /etc/nginx/sites-available/panda-lounge /etc/nginx/sites-enabled/
   nginx -t
   systemctl restart nginx
   ```

10. **Установите SSL сертификат (Let's Encrypt):**
    ```bash
    apt install certbot python3-certbot-nginx -y
    certbot --nginx -d ваш-домен.com
    ```

11. **Готово!** Ваше приложение работает на `https://ваш-домен.com`

---

## 🟠 Вариант 3: Netlify

### Шаги:

1. Push проект на GitHub
2. Зайдите на [netlify.com](https://netlify.com)
3. "Import from Git" → выберите репозиторий
4. Build settings:
   - Build command: `npm run build`
   - Publish directory: `.next`
5. Добавьте Environment Variables (как в Vercel)
6. Deploy!

---

## 📋 Чек-лист миграции

Перед запуском в production убедитесь:

- [ ] ✅ Обновлен `.env` с production URLs
- [ ] ✅ Сгенерирован новый `NEXTAUTH_SECRET`
- [ ] ✅ Изменен provider в `schema.prisma` на `postgresql`
- [ ] ✅ База данных PostgreSQL создана и настроена
- [ ] ✅ Миграции применены: `npx prisma migrate deploy`
- [ ] ✅ Google OAuth callback URL обновлен в Google Console
- [ ] ✅ Проект собран: `npm run build`
- [ ] ✅ SSL сертификат установлен (HTTPS)
- [ ] ✅ Тестирование всех функций на production

---

## 🆘 Troubleshooting

### Проблема: Google OAuth не работает на production
**Решение:** 
1. Проверьте, что в Google Console добавлен правильный callback URL
2. Подождите 5-10 минут после добавления
3. Убедитесь что `NEXTAUTH_URL` в `.env` совпадает с доменом

### Проблема: Ошибка подключения к базе данных
**Решение:**
1. Проверьте `DATABASE_URL` в `.env`
2. Убедитесь что PostgreSQL запущен: `systemctl status postgresql`
3. Проверьте права доступа пользователя БД

### Проблема: 500 Internal Server Error
**Решение:**
1. Проверьте логи: `pm2 logs panda-lounge` (для VPS)
2. Убедитесь что все environment variables установлены
3. Проверьте что Prisma client сгенерирован: `npx prisma generate`

---

## 📞 Полезные ссылки

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Prisma Production Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization/production-best-practices)
- [Google OAuth Setup](https://console.cloud.google.com/)

---

**Удачи с деплоем! 🚀**
