# 🔧 Решение распространённых проблем

## 🚨 Частые ошибки и их решения

### 1. Module not found: Can't resolve 'lucide-react'

**Проблема:** Не установлены зависимости

**Решение:**
```bash
yarn install
# или
npm install
```

---

### 2. Error: P1001: Can't reach database server

**Проблема:** База данных не создана или неправильный путь

**Решение:**
```bash
# Проверьте .env файл
cat .env | grep DATABASE_URL

# Создайте базу данных заново
rm -f prisma/dev.db
npx prisma migrate dev --name init
npm run prisma:seed
```

---

### 3. Google OAuth Error 400: redirect_uri_mismatch

**Проблема:** Не добавлен redirect URI в Google Console

**Решение:**
1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. APIs & Services → Credentials
3. Найдите OAuth 2.0 Client ID
4. Добавьте **Authorized redirect URIs**:
   - Для localhost: `http://localhost:3000/api/auth/callback/google`
   - Для production: `https://ваш-домен.com/api/auth/callback/google`
5. Сохраните и подождите 5-10 минут

**Быстрая проверка:**
```bash
# Убедитесь что NEXTAUTH_URL совпадает с redirect URI
grep NEXTAUTH_URL .env
```

---

### 4. Ошибка "Module not found" при импорте компонентов

**Проблема:** TypeScript не может найти модули

**Решение:**
```bash
# Перезапустите TypeScript server
rm -rf .next
rm -rf node_modules
yarn install
npm run dev
```

---

### 5. Страница загружается, но показывает ошибку 500

**Проблема:** Ошибка на сервере, обычно связана с БД или API

**Решение:**
```bash
# Проверьте логи сервера
tail -100 /tmp/nextjs.log

# Проверьте что Prisma Client сгенерирован
npx prisma generate

# Перезапустите сервер
pkill -f "next dev"
npm run dev
```

---

### 6. Prisma Client не синхронизирован со схемой

**Ошибка:**
```
Error: @prisma/client did not initialize yet
```

**Решение:**
```bash
npx prisma generate
npx prisma migrate dev
```

---

### 7. Сервер не запускается, порт 3000 занят

**Проблема:** Другое приложение использует порт 3000

**Решение:**
```bash
# Найдите и остановите процесс
lsof -ti:3000 | xargs kill -9

# Или запустите на другом порту
PORT=3001 npm run dev
```

---

### 8. Не работает вход с тестовыми аккаунтами

**Проблема:** База данных не заполнена seed данными

**Решение:**
```bash
npm run prisma:seed
```

**Проверьте учетные данные:**
- Email: `admin@panda.com` / Пароль: `admin123`
- Email: `demo@panda.com` / Пароль: `demo123`

---

### 9. После деплоя на production не работает авторизация

**Проблема:** Неправильные environment variables

**Чек-лист:**
1. ✅ `NEXTAUTH_URL` должен быть вашим production URL
2. ✅ `NEXTAUTH_SECRET` должен быть уникальным (сгенерируйте: `openssl rand -base64 32`)
3. ✅ Google OAuth redirect URI обновлен в Google Console
4. ✅ База данных PostgreSQL настроена и доступна
5. ✅ Миграции применены: `npx prisma migrate deploy`

---

### 10. Ошибка при сборке: "Cannot find module '@/lib/...'"

**Проблема:** TypeScript не может разрешить алиасы путей

**Решение:**
Проверьте `tsconfig.json`:
```json
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}
```

Если проблема остается:
```bash
rm -rf .next
npm run build
```

---

### 11. Стили не применяются / странный вид страницы

**Проблема:** Tailwind CSS не скомпилирован

**Решение:**
```bash
# Убедитесь что Tailwind установлен
yarn add -D tailwindcss postcss autoprefixer

# Перезапустите dev server
npm run dev
```

---

### 12. SQLite база работает медленно в production

**Проблема:** SQLite не подходит для production с высокой нагрузкой

**Решение:** Мигрируйте на PostgreSQL

См. [HOSTING_MIGRATION.md](./HOSTING_MIGRATION.md) для деталей

Краткие шаги:
1. Измените `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```

2. Обновите `DATABASE_URL` в `.env`:
   ```
   DATABASE_URL="postgresql://user:password@localhost:5432/panda_lounge"
   ```

3. Примените миграции:
   ```bash
   npx prisma migrate dev
   npm run prisma:seed
   ```

---

## 🛠️ Полезные команды для отладки

### Проверка статуса всех сервисов:
```bash
# Проверить что Node.js работает
node --version

# Проверить что yarn установлен
yarn --version

# Проверить процессы Next.js
ps aux | grep next

# Проверить порты
netstat -tulpn | grep 3000
```

### Очистка и переустановка:
```bash
# Полная очистка
rm -rf node_modules
rm -rf .next
rm -f yarn.lock

# Переустановка
yarn install
npm run build
```

### Работа с базой данных:
```bash
# Открыть Prisma Studio (GUI для БД)
npm run prisma:studio

# Просмотр миграций
npx prisma migrate status

# Сброс базы данных (ОСТОРОЖНО! Удалит все данные)
npx prisma migrate reset

# Заполнить тестовыми данными
npm run prisma:seed
```

### Проверка логов:
```bash
# Логи Next.js
tail -f /tmp/nextjs.log

# Логи в реальном времени
npm run dev | tee /tmp/debug.log
```

---

## 📞 Всё ещё не работает?

### Шаг 1: Соберите информацию
```bash
# Версии
node --version
yarn --version
npx prisma --version

# Переменные окружения (без секретов!)
cat .env | grep -v SECRET | grep -v PASSWORD

# Последние 50 строк логов
tail -50 /tmp/nextjs.log
```

### Шаг 2: Проверьте документацию
- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [NextAuth.js Docs](https://next-auth.js.org/)

### Шаг 3: Попробуйте чистую установку
```bash
# Сохраните .env
cp .env .env.backup

# Полная переустановка
rm -rf node_modules .next prisma/dev.db
yarn install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed

# Восстановите .env
cp .env.backup .env

# Запуск
npm run dev
```

---

## ✅ Всё работает?

Если всё заработало, не забудьте:
1. ⭐ Добавить проект в избранное на GitHub
2. 📝 Обновить README с вашими контактами
3. 🔐 Изменить NEXTAUTH_SECRET для production
4. 🗄️ Настроить регулярные бэкапы БД

**Удачи! 🚀**
