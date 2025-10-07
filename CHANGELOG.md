# Changelog

Всі важливі зміни в проекті PANDA Lounge документуються тут.

## [v2.1.0] - 2025-01-07

### 🎯 Критичні фікси

#### 🔧 Навігація (ВИПРАВЛЕНО)
- ✅ Виправлено всі некоректні якорі та посилання
- ✅ Створено окрему сторінку `/wheel` для колеса фортуни
- ✅ Замінено всі `href="#wheel"` на `/wheel`
- ✅ Замінено всі `href="#"` на реальні посилання (Instagram, Telegram)
- ✅ Додано loading states (Suspense) для всіх основних роутів
- ✅ ErrorBoundary вже присутній для обробки помилок

#### 🎡 Колесо фортуни - Машина станів (FSM)
- ✅ **API Endpoints:**
  - `GET /api/wheel/status` - перевірка статусу користувача
  - `POST /api/wheel/spin` - обертання колеса з валідацією
- ✅ **FSM States:** LOADING → READY → SPINNING → RESULT → COOLDOWN → ERROR
- ✅ **Серверні перевірки:**
  - Кулдаун 7 днів між спінами
  - Валідація токену користувача (NextAuth)
  - Анті-абуз логування (IP, User Agent)
- ✅ **Транзакційна видача призів:**
  - Атомарна операція: WheelSpin + Coupon + AuditLog
  - Призи діють 7 днів після виграшу
  - Захист від одночасних запитів
- ✅ **UI оновлення:**
  - Інтеграція WheelModal з API
  - Правильне відображення станів (READY, COOLDOWN, SPINNING)
  - Таймер до наступного спіну
  - Toast-повідомлення замість попапів

#### 🔐 NextAuth стабілізація
- ✅ Перевірено конфігурацію NextAuth
- ✅ JWT strategy з правильними callbacks
- ✅ Захист API endpoints через getServerSession
- ✅ Middleware для захисту /staff/* та /profile/*

### 🗄️ База даних

#### Оновлення схеми
- **WheelSpin:** додано `prize_id`, `prize_name`, `state`, індекси
- **WheelPrize:** додано `icon`, `max_per_period`, `current_count`, `updated_at`
- **AuditLog (NEW):** структуроване логування всіх дій
  - `user_id`, `action`, `entity_type`, `entity_id`, `details` (JSON)
  - Індекси по `user_id`, `action`, `created_at`

#### Міграції
```bash
npx prisma migrate dev --name add_wheel_fsm_and_audit
```

### 📦 Нові компоненти

- `/app/app/wheel/page.tsx` - окрема сторінка колеса
- `/app/app/wheel/loading.tsx` - loading state
- `/app/app/api/wheel/status/route.ts` - API статусу
- `/app/app/api/wheel/spin/route.ts` - API спіну (оновлено)
- Loading states для: profile, events, menu, music

### 🔒 Безпека

- ✅ Всі критичні операції на сервері
- ✅ Валідація токенів через NextAuth
- ✅ Логування спроб обходу кулдауну
- ✅ Захист від race conditions (транзакції)
- ✅ Audit log для всіх важливих дій

### 📝 Правила колеса фортуни

- 🎡 Спін доступний раз на 7 днів
- 🎁 Призи діють 7 днів
- 💎 Виграші зберігаються як купони в БД
- 📊 Вірогідності призів налаштовуються в БД
- 🔐 Захист від абузу через кулдаун

### 🔄 Зміни в навігації

#### До v2.1:
```tsx
href: '#wheel'  // ❌ Не працювало
```

#### Після v2.1:
```tsx
href: '/wheel'  // ✅ Працює
```

### 📚 Оновлена документація

- `.env.example` - додано QR_SECRET, QR_TTL_MINUTES
- Коментарі щодо PostgreSQL для production
- Інструкції з міграцій

---

## [v2.0.0] - 2024-10-01

### Основний реліз
- Next.js 15.5 + TypeScript 5.3
- Prisma 6.16 ORM
- NextAuth аутентификація
- QR система
- Реферальна програма
- Музичний джукбокс
- Система чайових
- Админ-панель

---

## Roadmap v2.2 (планується)

### ФАЗА 4: PostgreSQL Production
- [ ] Міграція з SQLite на PostgreSQL для production
- [ ] Оновлення schema.prisma
- [ ] Інструкції деплою з PostgreSQL

### ФАЗА 5: E2E тестування
- [ ] Playwright setup
- [ ] Базові тести: auth, wheel, navigation
- [ ] CI/CD integration

### ФАЗА 6: Админ-панель (розширення)
- [ ] CRUD для events, wheel prizes
- [ ] Статистика (recharts)
- [ ] Аудит-лог UI
- [ ] Управління користувачами

### Інші покращення
- [ ] Real-time notifications (WebSocket)
- [ ] Rate limiting на API
- [ ] 2FA для адмінів
- [ ] PWA manifest і offline support

---

**Статус:** ✅ v2.1 - Production Ready  
**Наступний реліз:** v2.2 (PostgreSQL + E2E тести)
