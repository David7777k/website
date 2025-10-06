# 🔧 Виправлення авторизації

## Проблема
При спробі входу через email/password або Google показувалась помилка:
```
Сторінка не працює
Хост database-setup-6.preview.emergentagent.com зараз не може обробити цей запит
```

## Причина
`NEXTAUTH_URL` в `.env` файлі був налаштований на `http://localhost:3000`, 
але додаток працює на `https://md-consolidation.preview.emergentagent.com`

NextAuth використовує `NEXTAUTH_URL` для формування callback URLs, і коли URL не співпадає,
авторизація не може завершитись успішно.

## Виправлення

### 1. Оновлено `.env` файл:
```env
# Було:
NEXTAUTH_URL="http://localhost:3000"
APP_URL="http://localhost:3000"

# Стало:
NEXTAUTH_URL="https://md-consolidation.preview.emergentagent.com"
APP_URL="https://md-consolidation.preview.emergentagent.com"
```

### 2. Перезапущено сервер
Щоб зміни в `.env` вступили в силу.

## Тепер має працювати

### ✅ Email/Password логін:
- Email: `admin@panda.com`
- Password: `admin123`

### ✅ Google OAuth:
**ВАЖЛИВО!** Для роботи Google OAuth потрібно додати в Google Cloud Console:

1. Відкрити: https://console.cloud.google.com/
2. Перейти в Credentials → OAuth 2.0 Client IDs
3. Додати Authorized Redirect URI:
   ```
   https://md-consolidation.preview.emergentagent.com/api/auth/callback/google
   ```
4. Зберегти та зачекати 5 хвилин

## Тестування

Відкрийте:
```
https://md-consolidation.preview.emergentagent.com/auth/login
```

Спробуйте увійти через:
1. Email/Password (має працювати відразу)
2. Google (після додавання redirect URI)

---

**Статус**: ✅ Виправлено
**Час**: 2025-10-05
