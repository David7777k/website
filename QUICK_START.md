# 🚀 PANDA Lounge - Быстрый старт

## ⚡ Запуск за 30 секунд

### Вариант 1: Автоматический (рекомендуется)

```bash
chmod +x start.sh && ./start.sh
```

Всё! Скрипт сделает всё сам. 🎉

---

### Вариант 2: Ручной запуск

```bash
# 1. Установить зависимости
yarn install

# 2. Настроить БД
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed

# 3. Запустить
npm run dev
```

---

## 🌐 Открыть приложение

После запуска откройте: **http://localhost:3000**

---

## 🔑 Тестовые аккаунты

Войдите сразу без регистрации:

| Роль | Email | Пароль |
|------|-------|--------|
| 👑 Админ | admin@panda.com | admin123 |
| 👤 Пользователь | demo@panda.com | demo123 |
| 👨‍💼 Персонал | staff@panda.com | staff123 |

---

## ⚙️ Google OAuth (опционально)

Если хотите вход через Google:

1. Откройте [Google Cloud Console](https://console.cloud.google.com/)
2. Перейдите: APIs & Services → Credentials
3. Найдите OAuth 2.0 Client ID
4. Добавьте redirect URI:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
5. Подождите 5 минут

Готово! Теперь можно входить через Google.

---

## 🎯 Что дальше?

### Для разработки:
- ✅ Всё работает из коробки
- 📝 Редактируйте файлы - hot reload включён
- 🗄️ Откройте Prisma Studio: `npm run prisma:studio`

### Для деплоя на хостинг:
- 📖 Читайте [HOSTING_MIGRATION.md](./HOSTING_MIGRATION.md)
- 🚀 Рекомендуем Vercel - деплой за 5 минут

### Если что-то не работает:
- 🔧 Смотрите [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- 📋 Там решения всех частых проблем

---

## 📂 Полезные команды

```bash
# Открыть БД в браузере
npm run prisma:studio

# Пересоздать БД
rm prisma/dev.db
npx prisma migrate dev --name init
npm run prisma:seed

# Проверить логи
tail -f /tmp/nextjs.log

# Остановить сервер
pkill -f "next dev"
```

---

## 📚 Документация

- 📖 [README.md](./README.md) - Полное описание проекта
- 🔧 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) - Решение проблем
- 🚀 [HOSTING_MIGRATION.md](./HOSTING_MIGRATION.md) - Деплой на хостинг
- ⚙️ [config.example.js](./config.example.js) - Настройки приложения

---

## ✅ Checklist первого запуска

- [ ] Запустил `./start.sh` или установил вручную
- [ ] Открыл http://localhost:3000
- [ ] Вошёл с тестовым аккаунтом
- [ ] Проверил основные страницы
- [ ] (Опционально) Настроил Google OAuth
- [ ] Готово к разработке! 🎉

---

**Время на настройку: 1-2 минуты**  
**Статус: ✅ Работает из коробки**

**Удачи! 🐼🚀**