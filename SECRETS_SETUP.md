# 🔐 Настройка секретов (Google OAuth)

## ⚠️ Важно!

Файл `.env` содержит секретные ключи и **НЕ должен** попадать в Git!
Он уже добавлен в `.gitignore`.

---

## 🔑 Как получить Google OAuth ключи

### Шаг 1: Откройте Google Cloud Console

Перейдите: https://console.cloud.google.com/

### Шаг 2: Создайте или выберите проект

1. Вверху страницы нажмите на название проекта
2. Нажмите "New Project" или выберите существующий

### Шаг 3: Включите Google+ API

1. Перейдите: APIs & Services → Library
2. Найдите "Google+ API"
3. Нажмите "Enable"

### Шаг 4: Настройте OAuth Consent Screen

1. Перейдите: APIs & Services → OAuth consent screen
2. Выберите "External" (для тестирования)
3. Заполните обязательные поля:
   - App name: `PANDA Lounge`
   - User support email: ваш email
   - Developer contact: ваш email
4. Нажмите "Save and Continue"
5. Scopes - пропустите (нажмите "Save and Continue")
6. Test users - добавьте ваш email для тестирования
7. Нажмите "Save and Continue"

### Шаг 5: Создайте OAuth Client ID

1. Перейдите: APIs & Services → Credentials
2. Нажмите "Create Credentials" → "OAuth client ID"
3. Application type: "Web application"
4. Name: `PANDA Lounge Web`
5. Authorized redirect URIs - добавьте:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
   (Для production добавите позже свой домен)
6. Нажмите "Create"

### Шаг 6: Скопируйте ключи

После создания вы увидите:
- ✅ **Client ID** (что-то вроде: `123456789-abc...xyz.apps.googleusercontent.com`)
- ✅ **Client Secret** (что-то вроде: `GOCSPX-...`)

**Скопируйте их!** Они нужны для следующего шага.

---

## 📝 Добавьте ключи в проект

### Способ 1: Создайте .env файл вручную

```bash
# В корне проекта создайте .env файл
nano .env
```

Добавьте туда:

```env
# Database
DATABASE_URL="file:./dev.db"

# NextAuth Configuration
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="panda-lounge-super-secret-key-2025-change-in-production"

# Google OAuth - ВСТАВЬТЕ СВОИ КЛЮЧИ!
GOOGLE_CLIENT_ID="ваш-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="ваш-client-secret"

# Google Maps API (опционально)
GOOGLE_MAPS_API_KEY="your-google-maps-api-key"

# Spotify API (опционально)
SPOTIFY_CLIENT_ID="your-spotify-client-id"
SPOTIFY_CLIENT_SECRET="your-spotify-client-secret"

# Application Settings
APP_NAME="PANDA Lounge"
APP_URL="http://localhost:3000"

# Environment
NODE_ENV="development"
```

### Способ 2: Скопируйте из .env.example

```bash
cp .env.example .env
nano .env
# Вставьте свои ключи вместо placeholders
```

---

## ✅ Проверка

После добавления ключей:

1. Перезапустите сервер:
   ```bash
   pkill -f "next dev"
   npm run dev
   ```

2. Откройте: http://localhost:3000/auth/login

3. Нажмите "Увійти через Google"

4. Если всё настроено правильно - откроется окно выбора Google аккаунта

---

## 🌐 Для Production

Когда будете деплоить на хостинг:

1. В Google Cloud Console добавьте новый redirect URI:
   ```
   https://ваш-домен.com/api/auth/callback/google
   ```

2. В .env обновите:
   ```env
   NEXTAUTH_URL="https://ваш-домен.com"
   APP_URL="https://ваш-домен.com"
   ```

3. Сгенерируйте новый NEXTAUTH_SECRET:
   ```bash
   openssl rand -base64 32
   ```

---

## ⚠️ Безопасность

### ❌ НЕ делайте:
- ❌ Не коммитьте .env файл в Git
- ❌ Не публикуйте ключи в Issues, Pull Requests
- ❌ Не добавляйте ключи в README или другую документацию
- ❌ Не делитесь ключами публично

### ✅ Делайте:
- ✅ Храните .env локально
- ✅ Используйте разные ключи для dev и production
- ✅ Добавьте .env в .gitignore (уже добавлен)
- ✅ Для production используйте environment variables хостинга

---

## 🆘 Проблемы?

### Google OAuth показывает ошибку 400

**Причина:** Неправильный redirect URI

**Решение:**
1. Проверьте что в Google Console добавлен точный URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
2. Убедитесь что нет лишних пробелов
3. Подождите 5-10 минут после добавления
4. Попробуйте снова

### Ошибка "GOOGLE_CLIENT_ID is not defined"

**Причина:** .env файл не создан или ключи не добавлены

**Решение:**
1. Проверьте что .env файл существует: `ls -la .env`
2. Откройте его: `cat .env`
3. Убедитесь что ключи добавлены
4. Перезапустите сервер

---

## 💡 Альтернатива - без Google OAuth

Если не хотите настраивать Google OAuth, просто используйте email/password вход:

**Тестовые аккаунты:**
- admin@panda.com / admin123
- demo@panda.com / demo123
- staff@panda.com / staff123

Приложение полностью работает и без Google OAuth! 👍

---

**Готово!** Теперь у вас настроен безопасный Google OAuth. 🎉
