#!/bin/bash

# 🐼 PANDA Lounge - Скрипт быстрого запуска

echo "🐼 Запуск PANDA Lounge..."
echo ""

# Проверка .env файла
if [ ! -f .env ]; then
    echo "⚠️  Файл .env не найден. Создаём из .env.example..."
    cp .env.example .env
    echo "✅ Создан .env файл"
    echo ""
    echo "📝 ВАЖНО: Для Google OAuth добавьте свои ключи!"
    echo "   📚 Читайте инструкцию: SECRETS_SETUP.md"
    echo ""
    echo "   Или просто нажмите Enter для запуска без Google OAuth"
    echo "   (email/password вход работает сразу)"
    echo ""
    read -p "Нажмите Enter для продолжения..."
fi

# Установка зависимостей
if [ ! -d "node_modules" ]; then
    echo "📦 Установка зависимостей..."
    yarn install
    echo "✅ Зависимости установлены"
    echo ""
fi

# Настройка базы данных
if [ ! -f "prisma/dev.db" ]; then
    echo "🗄️  Настройка базы данных..."
    npx prisma generate
    npx prisma migrate dev --name init
    echo "✅ База данных настроена"
    echo ""
    
    # Заполнение тестовыми данными
    echo "🌱 Заполнение тестовыми данными..."
    npm run prisma:seed
    echo "✅ Тестовые данные добавлены"
    echo ""
fi

# Запуск сервера
echo "🚀 Запуск сервера разработки..."
echo ""
echo "📱 Приложение будет доступно по адресу:"
echo "   http://localhost:3000"
echo ""
echo "🧪 Тестовые учетные записи:"
echo "   Админ:  admin@panda.com / admin123"
echo "   Демо:   demo@panda.com / demo123"
echo "   Персонал: staff@panda.com / staff123"
echo ""
echo "⚙️  Google OAuth Callback URL (добавьте в Google Console):"
echo "   http://localhost:3000/api/auth/callback/google"
echo ""
echo "Press Ctrl+C to stop"
echo ""

npm run dev
