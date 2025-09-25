# Проект website

Этот репозиторий содержит набор сервисов и приложений для одного продукта:
- backend — FastAPI приложение (Python)
- frontend — React SPA (классическая фронтенд-часть)
- panda-next — современное Next.js приложение (TypeScript + Prisma)

README кратко описывает структуру проекта, как быстро запустить всё в Windows (PowerShell) и полезные команды.

## Основные фишки проекта
- Разделение на backend (API) и несколько фронтенд-приложений (React SPA и Next.js).
- FastAPI backend с запуском через Uvicorn (hot-reload).
- Next.js приложение (`panda-next`) с Prisma (включая `prisma/seed`), аутентификацией (next-auth) и TailwindCSS.
- Локализация / i18n в классическом frontend (папка `frontend/src/locales` содержит `ru` и `uk`).
- Утилиты для аудита (есть `puppeteer-audit.js`), тесты (Vitest в `panda-next`) и пример seed для БД.

## Структура репозитория (важные папки)
- `backend/` — FastAPI сервер: `server.py`, `models.py`, `requirements.txt`.
- `frontend/` — React-приложение (компоненты, контексты, стили, i18n).
- `panda-next/` — Next.js (app router) с Prisma, `package.json`, `tsconfig.json`.
- `prisma/` — файл схемы, `dev.db` и seed-скрипты.
- `start.ps1` — помощник для Windows, который запускает backend и frontend в отдельных окнах PowerShell.

## Быстрый старт (Windows / PowerShell)
1. Откройте PowerShell в корне репозитория (там где `start.ps1`).
2. Запустите скрипт:

```powershell
./start.ps1
```

Что делает `start.ps1`:
- Создаёт виртуальное окружение `backend/.venv` и устанавливает зависимости из `backend/requirements.txt`, если его ещё нет.
- Запускает backend: `uvicorn server:app --reload --port 8000`.
- Запускает frontend: `yarn start` (если есть `yarn.lock`) или `npm start`.

Если хотите запускать компоненты вручную — инструкции ниже.

### Запуск backend вручную
1. Перейдите в папку backend:

```powershell
cd "d:\Idea project\website\backend"
```

2. Создайте виртуальное окружение (если нужно) и активируйте его:

```powershell
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

3. При необходимости создайте `.env` по примеру `.env.example` и заполните переменные (например, URL базы данных, SECRET_KEY).

4. Запустите сервер:

```powershell
uvicorn server:app --reload --port 8000
```

### Запуск классического frontend (React)
Перейдите в папку `frontend` и выполните:

```powershell
cd "d:\Idea project\website\frontend"
# используйте yarn если есть yarn.lock
yarn install
yarn start

# или npm
npm install
npm start
```

### Запуск Next.js приложения (`panda-next`)
Перейдите в папку `panda-next` и выполните:

```powershell
cd "d:\Idea project\website\panda-next"
npm install
npm run dev
```

После запуска dev-сервера Next.js приложение будет доступно по адресу `http://localhost:3000`.

Чтобы собрать production-версию:

```powershell
npm run build
npm run start
```

## Prisma / База данных
В папке `prisma/` есть `schema.prisma` и `dev.db` (локальная БД). Для генерации клиента и применения миграций:

```powershell
cd "d:\Idea project\website\panda-next"
npm run prisma:generate
# если нужно мигрировать (локально):
npm run prisma:migrate
# заполнить данными:
npm run prisma:seed
```

## Тесты
- В `panda-next` используется Vitest. Запуск тестов:

```powershell
cd "d:\Idea project\website\panda-next"
npm test
```

## Полезные скрипты и файлы
- `start.ps1` — автоматический запуск backend + frontend (Windows).
- `panda-next/puppeteer-audit.js` — скрипт аудита страниц (Puppeteer).
- `prisma/seed.mjs` и `seed.ts` — пример заполнения БД.

## Функциональные фишки (кратко)
- Поддержка локалей (в фронтенде есть `ru` и `uk`).
- Next.js приложение с компонентной структурой (авторизация, модальные окна, колесо/акции — см. `app/components`).
- Prisma + seed для локальной разработки.
- Быстрые dev-скрипты и helper для Windows.

## Внесение изменений / вклад
- Для локальной разработки используйте ветки feature/* и открывайте PR в основную ветку `main`.
- Прежде чем пушить, запускайте локальные тесты и, при возможности, `npm run build` в `panda-next`.

## Лицензия
По умолчанию в репозитории лицензия не указана — добавьте `LICENSE` если хотите явную лицензию.

Если хотите, могу:
- добавить Dockerfile / docker-compose для упрощённого локального запуска,
- настроить single-terminal запуск через tmux/ConEmu или дать инструкции для macOS/Linux,
- прогнать `npm audit fix` и оформить изменения в отдельной ветке.

Если нужно, подправлю README под ваши требования или добавлю диаграмму архитектуры/скриншоты.

