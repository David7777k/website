# 🔧 Инструкция по настройке Google OAuth для localhost

Если при входе через Google вы получаете ошибку **400: redirect_uri_mismatch**, следуйте этой инструкции:

## Шаг 1: Откройте Google Cloud Console

1. Перейдите на [Google Cloud Console](https://console.cloud.google.com/)
2. Войдите в свой аккаунт Google

## Шаг 2: Выберите ваш проект

1. В верхнем меню выберите ваш проект (или создайте новый)
2. Если проекта нет, нажмите "Create Project"

## Шаг 3: Настройте OAuth Consent Screen

1. В боковом меню найдите **APIs & Services** → **OAuth consent screen**
2. Выберите тип приложения: **External** (для тестирования)
3. Заполните обязательные поля:
   - App name: **PANDA Lounge**
   - User support email: ваш email
   - Developer contact email: ваш email
4. Нажмите **Save and Continue**
5. Пропустите Scopes (нажмите **Save and Continue**)
6. Добавьте Test Users (ваш email для тестирования)

## Шаг 4: Создайте OAuth Client ID

1. Перейдите в **APIs & Services** → **Credentials**
2. Нажмите **+ CREATE CREDENTIALS** → **OAuth client ID**
3. Выберите тип: **Web application**
4. Укажите имя: **PANDA Lounge Web Client**

## Шаг 5: Добавьте Authorized redirect URIs

⚠️ **ЭТО САМЫЙ ВАЖНЫЙ ШАГ!**

В разделе **Authorized redirect URIs** добавьте:

### Для локальной разработки (localhost):
```
http://localhost:3000/api/auth/callback/google
```

### Для production (когда деплоите):
```
https://ваш-домен.com/api/auth/callback/google
```

**Важно:** 
- URL должен точно совпадать, включая `/api/auth/callback/google`
- Не забудьте нажать **ENTER** после ввода каждого URL
- Убедитесь, что используете `http://` для localhost (не `https://`)

## Шаг 6: Скопируйте credentials

После создания:
1. Скопируйте **Client ID** 
2. Скопируйте **Client Secret**
3. Вставьте их в файл `.env`:

```env
GOOGLE_CLIENT_ID="ваш-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="ваш-client-secret"
```

## Шаг 7: Перезапустите сервер

```bash
# Остановите текущий сервер (Ctrl+C)
# Затем запустите снова
yarn dev
```

## Проверка настроек

Убедитесь, что в Google Cloud Console:
- ✅ OAuth consent screen настроен
- ✅ Ваш email добавлен в Test Users
- ✅ Redirect URI точно совпадает: `http://localhost:3000/api/auth/callback/google`
- ✅ Client ID и Secret скопированы в `.env`

## Частые ошибки

### Ошибка 400: redirect_uri_mismatch
**Причина:** Redirect URI не совпадает с настройками в Google Console

**Решение:** 
1. Проверьте URL в Google Console
2. Убедитесь что он точно: `http://localhost:3000/api/auth/callback/google`
3. Подождите 5 минут после изменений в Google Console

### Ошибка 403: access_denied
**Причина:** Приложение не в production mode и пользователь не в Test Users

**Решение:**
1. Добавьте ваш email в Test Users
2. Или опубликуйте приложение (Publishing status → Publish App)

### Ошибка: This app isn't verified
**Это нормально для тестирования!**
1. Нажмите "Advanced"
2. Нажмите "Go to PANDA Lounge (unsafe)"
3. Для production нужно пройти верификацию Google

## Альтернативный вход

Если Google OAuth не работает, используйте:
- **Email/Password**: Зарегистрируйтесь через форму регистрации
- Тестовый аккаунт:
  - Email: `demo@panda.com`
  - Password: `demo123`

## Нужна помощь?

Если проблема не решена:
1. Проверьте логи в консоли браузера (F12)
2. Проверьте логи сервера в терминале
3. Убедитесь что порт 3000 свободен
4. Попробуйте очистить cookies и cache браузера

---

**Готово!** После правильной настройки вход через Google должен работать. 🎉
