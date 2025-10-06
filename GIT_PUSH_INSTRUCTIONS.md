# 📤 Инструкция для безопасного push в Git

## ⚠️ Важно перед commit/push!

### ✅ Что МОЖНО коммитить:
- ✅ Весь код приложения
- ✅ Документацию (.md файлы)
- ✅ `.env.example` с placeholders
- ✅ Конфигурационные файлы
- ✅ package.json, yarn.lock и т.д.

### ❌ Что НЕЛЬЗЯ коммитить:
- ❌ `.env` файл (уже в .gitignore)
- ❌ Реальные API ключи и секреты
- ❌ Пароли
- ❌ Токены доступа
- ❌ База данных (dev.db - уже в .gitignore)

---

## 🔍 Проверка перед push

### 1. Убедитесь что .env в .gitignore:
```bash
cat .gitignore | grep "^\.env$"
```
Должно показать: `.env`

### 2. Проверьте что .env не отслеживается Git:
```bash
git status | grep .env
```
Не должно ничего показать!

### 3. Проверьте что в коммитах нет секретов:
```bash
# Поиск по всем файлам
grep -r "GOCSPX" . --exclude-dir=node_modules --exclude-dir=.git
grep -r "434216560690" . --exclude-dir=node_modules --exclude-dir=.git
```
Не должно ничего найти в файлах!

---

## 📝 Правильный процесс commit/push

```bash
# 1. Добавьте файлы
git add .

# 2. Проверьте что добавляется
git status

# 3. Убедитесь что .env не в списке
# Если .env есть - удалите его:
git reset .env

# 4. Создайте коммит
git commit -m "Описание изменений"

# 5. Push
git push origin main
```

---

## 🚨 Что делать если GitHub заблокировал push?

### Случай 1: Секреты в новых файлах

**Проблема:** Вы добавили реальные ключи в документацию

**Решение:**
1. Откройте указанные файлы
2. Замените реальные ключи на placeholders:
   ```
   GOOGLE_CLIENT_ID="your-google-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   ```
3. Сделайте новый коммит:
   ```bash
   git add .
   git commit -m "Remove secrets from documentation"
   git push origin main
   ```

### Случай 2: Секреты в истории коммитов

**Проблема:** Секреты были в старых коммитах

**Решение 1 - Мягкий (рекомендуется):**
```bash
# Отменить последние N коммитов (сохранив изменения)
git reset --soft HEAD~N

# Исправить файлы, удалив секреты

# Создать новый коммит
git add .
git commit -m "Fix: Remove secrets"
git push origin main --force
```

**Решение 2 - Через GitHub UI:**
1. Перейдите по ссылке из ошибки GitHub
2. Нажмите "Allow secret" (разрешить секрет)
3. **Но это небезопасно!** Лучше удалить секреты.

---

## 🔐 Безопасная работа с секретами

### Для разработки:
1. Создайте `.env` локально
2. Добавьте свои ключи
3. `.env` автоматически игнорируется Git

### Для команды:
1. Используйте `.env.example` как шаблон
2. Каждый разработчик создаёт свой `.env`
3. Реальные ключи - только локально

### Для production:
1. Используйте environment variables хостинга
2. Никогда не коммитьте production ключи
3. Используйте разные ключи для dev и prod

---

## ✅ Текущий статус проекта

После исправлений:
- ✅ `.env` в .gitignore
- ✅ Все секреты удалены из документации
- ✅ `.env.example` содержит только placeholders
- ✅ `SECRETS_SETUP.md` с инструкциями для пользователей
- ✅ Проект готов к безопасному push

---

## 📚 Полезные команды

```bash
# Посмотреть что будет закоммичено
git diff --cached

# Убрать файл из staging
git reset имя_файла

# Проверить историю файла
git log --follow -- .env

# Полностью удалить файл из истории Git (ОСТОРОЖНО!)
git filter-branch --force --index-filter \
  "git rm --cached --ignore-unmatch .env" \
  --prune-empty --tag-name-filter cat -- --all
```

---

## 🎯 Чек-лист перед каждым push

- [ ] `.env` не отслеживается Git
- [ ] В коммите нет секретов
- [ ] Проверил `git status`
- [ ] Проверил `git diff`
- [ ] Commit message понятный
- [ ] Всё работает локально
- [ ] Готов к push!

---

**Безопасная работа - залог успеха! 🔒**
