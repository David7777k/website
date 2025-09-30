# 🌐 Website Project

<div align="center">

![Project Status](https://img.shields.io/badge/status-active-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)
![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react)
![Next.js](https://img.shields.io/badge/Next.js-15.5-000000?logo=nextdotjs)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-3178C6?logo=typescript)

*Современный мультисервисный веб-проект с микросервисной архитектурой*

</div>

## 📋 Обзор проекта

Этот репозиторий представляет собой полнофункциональную экосистему веб-приложений, объединяющую в себе:

- **🚀 Backend API** — высокопроизводительный FastAPI сервер на Python
- **⚛️ Frontend SPA** — современное React приложение с i18n поддержкой
- **🔥 Panda-Next** — продвинутое Next.js приложение с Prisma ORM

## 🏗️ Архитектура проекта

```
website/
├── 🔧 backend/              # FastAPI + Python backend
│   ├── server.py           # Основной сервер
│   ├── models.py           # Модели данных
│   └── requirements.txt    # Python зависимости
├── ⚛️ frontend/            # React SPA
│   ├── src/                # Исходный код
│   ├── components.json     # UI компоненты
│   └── package.json        # Node.js зависимости
├── 🔥 panda-next/          # Next.js приложение
│   ├── app/                # App Router
│   ├── prisma/             # База данных
│   └── middleware.ts       # Middleware
└── 📝 docs/                # Документация
```

## ⚡ Быстрый старт

### 🐳 Docker (Рекомендуется)

```bash
# Клонируйте репозиторий
git clone https://github.com/David7777k/website.git
cd website

# Запустите весь стек одной командой
docker-compose up -d
```

### 🪟 Windows PowerShell

Для пользователей Windows предусмотрен автоматический скрипт запуска:

```powershell
# Запустите автоматический скрипт
./start.ps1
```

### 🛠️ Ручная установка

#### Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # Windows: .\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
uvicorn server:app --reload --port 8000
```

#### Frontend Setup
```bash
cd frontend
npm install --legacy-peer-deps
npm start
```

#### Panda-Next Setup
```bash
cd panda-next
npm install
npx prisma generate
npx prisma migrate dev --name init
npm run prisma:seed
npm run dev
```

## 🌟 Ключевые возможности

### 🔐 Аутентификация и безопасность
- **NextAuth.js** с Google OAuth и OTP
- **JWT токены** для API авторизации
- **Bcrypt** хеширование паролей
- **CORS** настройки для безопасности

### 🗄️ База данных
- **Prisma ORM** с TypeScript поддержкой
- **SQLite** для разработки (готов к миграции на PostgreSQL)
- **Автоматические миграции** и seed данные
- **Database Studio** для администрирования

### 🎨 UI/UX
- **Radix UI** компоненты
- **Tailwind CSS** для стилизации
- **Framer Motion** анимации
- **Shadcn/ui** дизайн-система
- **Responsive дизайн** для всех устройств

### 🌍 Интернационализация
- **i18next** для React приложения
- Поддержка **русского** и **украинского** языков
- **Автоматическое определение** языка браузера

### 🧪 Тестирование и качество
- **Vitest** для unit тестов
- **ESLint** с расширенными правилами
- **TypeScript** строгая типизация
- **Puppeteer** для E2E тестирования

## 📚 API Документация

### Backend API (FastAPI)
- **Swagger UI**: `http://localhost:8000/docs`
- **ReDoc**: `http://localhost:8000/redoc`

### Next.js API Routes
- **Authentication**: `/api/auth/*`
- **Wheel Spin**: `/api/wheel/spin`
- **Music Orders**: `/api/music/order`

## 🔧 Доступные команды

### Backend
```bash
# Запуск сервера разработки
uvicorn server:app --reload

# Форматирование кода
black .

# Линтинг
flake8

# Тестирование
pytest
```

### Frontend
```bash
# Разработка
npm start

# Сборка
npm run build

# Тестирование
npm test

# Линтинг
npx eslint src/
```

### Panda-Next
```bash
# Разработка
npm run dev

# Сборка
npm run build

# База данных
npm run prisma:studio
npm run prisma:generate
npm run prisma:migrate

# Тестирование
npm test

# Линтинг
npm run lint
```

## 🐳 Docker контейнеризация

```yaml
# docker-compose.yml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
  
  frontend:
    build: ./frontend
    ports:
      - "3000:3000"
  
  panda-next:
    build: ./panda-next
    ports:
      - "3001:3000"
```

## 🚀 Развертывание

### Production готовность
- ✅ Environment переменные
- ✅ SSL/TLS сертификаты
- ✅ Database миграции
- ✅ Статические файлы
- ✅ Логирование
- ✅ Мониторинг

### Популярные платформы
- **Vercel** (Next.js приложение)
- **Railway** (Backend API)
- **Netlify** (React SPA)
- **Docker** (полный стек)

## 🤝 Участие в разработке

### Workflow
1. Fork репозитория
2. Создайте feature ветку: `git checkout -b feature/amazing-feature`
3. Commit изменения: `git commit -m 'Add amazing feature'`
4. Push в ветку: `git push origin feature/amazing-feature`
5. Откройте Pull Request

### Code Style
- Используйте **ESLint** и **Prettier**
- Следуйте **TypeScript** строгим правилам
- Пишите **тесты** для новых функций
- Документируйте **API endpoints**

## 📈 Производительность

### Оптимизации
- **Tree shaking** и code splitting
- **Image optimization** с Next.js
- **API response caching**
- **Database query optimization**
- **Bundle size monitoring**

### Метрики
- ⚡ **Lighthouse Score**: 95+
- 🚀 **First Contentful Paint**: <1.5s
- 📱 **Mobile Performance**: Optimized
- ♿ **Accessibility**: WCAG 2.1 AA

## 🔒 Безопасность

- 🛡️ **SQL Injection** защита через Prisma
- 🔐 **XSS** защита через CSP headers
- 🚫 **CSRF** токены
- 🔑 **Environment secrets** management
- 📊 **Security audit** с npm audit

## 📊 Мониторинг и аналитика

- 📈 **Application Performance Monitoring**
- 🐛 **Error tracking** с Sentry
- 📊 **User analytics**
- 🔍 **Database monitoring**
- 📨 **Health checks**

## 🎯 Roadmap

- [ ] **GraphQL API** интеграция
- [ ] **Microservices** архитектура
- [ ] **Redis** кеширование
- [ ] **Kubernetes** развертывание
- [ ] **CI/CD** pipeline с GitHub Actions
- [ ] **Mobile app** с React Native

## 📄 Лицензия

Этот проект лицензирован под MIT License - см. [LICENSE](LICENSE) файл для деталей.

## 👥 Команда

<table>
<tr>
<td align="center">
<a href="https://github.com/David7777k">
<img src="https://github.com/David7777k.png" width="100px;" alt="David"/><br />
<sub><b>David</b></sub>
</a><br />
💻 Fullstack Developer
</td>
</tr>
</table>

## 🆘 Поддержка

Если у вас есть вопросы или проблемы:

1. 📖 Проверьте [документацию](./docs)
2. 🔍 Поищите в [Issues](https://github.com/David7777k/website/issues)
3. 💬 Создайте новый [Issue](https://github.com/David7777k/website/issues/new)

---

<div align="center">

**⭐ Поставьте звезду, если проект был полезен!**

</div>

