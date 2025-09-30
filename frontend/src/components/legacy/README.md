# Legacy Components

⚠️ **DEPRECATED COMPONENTS** ⚠️

Эти компоненты были перемещены в legacy папку во время очистки проекта.

## Причины перемещения:

### Конфликты навигации:
- `Header.js/css` - конфликтовал с новым BottomNavigation
- `Footer.js/css` - не нужен при bottom navigation

### Устаревший дизайн:
- `Hero.js/css` - не соответствовал новой dark theme
- `MenuSection.js/css` - старый дизайн меню
- `MenuCard.js/css` - устаревшие карточки
- `MenuItem.js/css` - старые элементы меню
- `MenuContent.js/css` - старая структура контента
- `MenuPage.js/css` - заменен на новую страницу

### Неиспользуемые компоненты:
- `PopularPage.js/css` - не интегрирован в новую архитектуру
- `RestaurantInfo.js/css` - дублирует функционал HomePage
- `Sidebar.js/css` - заменен на FloatingDock
- `StatusBar.js/css` - не используется

## Текущая архитектура:

### Новая навигация:
- `layout/BottomNavigation.js` - основная навигация
- `layout/FloatingDock.js` - плавающие действия

### Новые страницы:
- `pages/HomePage.js` - обновленная главная страница
- `pages/EventsPage.js` - страница событий

### Активные компоненты:
- `AdvancedAnalytics.js` - аналитика
- `NotificationSystem.js` - уведомления
- `ReferralSystem.js` - реферальная система
- `ProtectedRoute.js` - защищенные маршруты
- `GoogleAuthButton.js` - авторизация

## Миграция завершена: ✅

Эти компоненты можно безопасно удалить после тестирования новой системы.