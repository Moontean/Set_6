# Quick Start Guide - CV Platform

Быстрый старт для локального запуска микросервисной платформы CV.

## 🚀 Быстрый запуск (5 минут)

### Шаг 1: Предварительные требования

Убедитесь что установлены:
```bash
docker --version    # Docker >= 20.10
docker compose version  # Compose >= 2.0
```

### Шаг 2: Клонирование и запуск

```bash
# Клонировать репозиторий
git clone https://github.com/Moontean/Set_6.git
cd Set_6

# Запустить все сервисы
docker compose -f docker-compose.microservices.yml up --build -d

# Дождаться запуска всех сервисов (30-60 сек)
docker compose -f docker-compose.microservices.yml ps
```

### Шаг 3: Проверка работоспособности

```bash
# Проверить health check всех сервисов
curl http://localhost:3000/health  # API Gateway
curl http://localhost:3001/health  # User/Auth Service
curl http://localhost:3002/health  # CV Management Service  
curl http://localhost:3003/health  # Template/Export Service
curl http://localhost:3004/health  # Notification Service
```

Ожидаемый ответ:
```json
{"status":"ok","service":"service-name"}
```

## 📝 Быстрый тест API

### 1. Регистрация пользователя

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User"
  }'
```

Сохраните `token` из ответа!

### 2. Создание резюме

```bash
TOKEN="your-token-from-step-1"

curl -X POST http://localhost:3000/api/cvs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Software Engineer CV",
    "fullName": "Test User",
    "email": "test@example.com",
    "skills": ["JavaScript", "Docker", "PostgreSQL"],
    "summary": "Experienced developer"
  }'
```

Сохраните `id` резюме из ответа!

### 3. Экспорт в PDF

```bash
curl -X POST http://localhost:3000/api/export/pdf \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "skills": ["JavaScript", "Docker"]
  }' \
  --output my-cv.pdf
```

Файл `my-cv.pdf` сохранен!

### 4. Экспорт в DOCX

```bash
curl -X POST http://localhost:3000/api/export/docx \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "skills": ["JavaScript", "Docker"]
  }' \
  --output my-cv.docx
```

Файл `my-cv.docx` сохранен!

## 🎯 Основные endpoints

### Аутентификация
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/profile` - Получить профиль (требует токен)
- `PUT /api/profile` - Обновить профиль (требует токен)

### Управление CV
- `GET /api/cvs` - Список всех резюме (требует токен)
- `POST /api/cvs` - Создать резюме (требует токен)
- `GET /api/cvs/{id}` - Получить резюме (требует токен)
- `PUT /api/cvs/{id}` - Обновить резюме (требует токен)
- `DELETE /api/cvs/{id}` - Удалить резюме (требует токен)

### Шаблоны и экспорт
- `GET /api/templates` - Список шаблонов
- `POST /api/export/pdf` - Экспорт в PDF (требует токен)
- `POST /api/export/docx` - Экспорт в DOCX (требует токен)

### Уведомления
- `POST /api/notify/email` - Отправить email
- `POST /api/notify/push` - Отправить push (stub)

## 🔍 Просмотр логов

```bash
# Все сервисы
docker compose -f docker-compose.microservices.yml logs -f

# Конкретный сервис
docker compose -f docker-compose.microservices.yml logs -f api-gateway
docker compose -f docker-compose.microservices.yml logs -f user-auth-service
docker compose -f docker-compose.microservices.yml logs -f cv-management-service
docker compose -f docker-compose.microservices.yml logs -f template-export-service
docker compose -f docker-compose.microservices.yml logs -f notification-service
```

## 🛑 Остановка сервисов

```bash
# Остановить все сервисы
docker compose -f docker-compose.microservices.yml down

# Остановить и удалить volumes (очистка БД)
docker compose -f docker-compose.microservices.yml down -v
```

## 🔄 Перезапуск сервисов

```bash
# Перезапустить конкретный сервис
docker compose -f docker-compose.microservices.yml restart api-gateway

# Перезапустить все сервисы
docker compose -f docker-compose.microservices.yml restart

# Пересобрать и перезапустить
docker compose -f docker-compose.microservices.yml up --build -d
```

## 🐛 Устранение неполадок

### Порт уже занят

Если порт занят, измените порты в `docker-compose.microservices.yml`:
```yaml
api-gateway:
  ports:
    - "3000:3000"  # Измените 3000 на другой порт, например 8000:3000
```

### Сервис не запускается

1. Проверить логи:
```bash
docker compose -f docker-compose.microservices.yml logs service-name
```

2. Проверить статус:
```bash
docker compose -f docker-compose.microservices.yml ps
```

3. Перезапустить:
```bash
docker compose -f docker-compose.microservices.yml restart service-name
```

### База данных не готова

PostgreSQL требует время для инициализации. Подождите 10-15 секунд и проверьте:
```bash
docker compose -f docker-compose.microservices.yml logs postgres
```

### Проблемы с Redis

```bash
# Проверить Redis
docker compose -f docker-compose.microservices.yml logs redis

# Перезапустить Redis
docker compose -f docker-compose.microservices.yml restart redis
```

## 📚 Дополнительная документация

- **Полная документация**: [README.microservices.md](./README.microservices.md)
- **Примеры API**: [API_EXAMPLES.md](./API_EXAMPLES.md)
- **Развертывание**: [DEPLOYMENT.md](./DEPLOYMENT.md)

## 🎓 Следующие шаги

1. Изучите полную документацию API в `API_EXAMPLES.md`
2. Настройте SMTP для email уведомлений
3. Попробуйте разные шаблоны для экспорта
4. Разверните на production сервере (см. `DEPLOYMENT.md`)

## 💡 Советы

- Используйте Postman или аналогичные инструменты для тестирования API
- Сохраняйте JWT токен в переменную окружения для удобства
- Rate limit: 100 запросов за 15 минут с одного IP
- JWT токен действителен 24 часа
- Все данные хранятся в PostgreSQL volume

## 🔐 Безопасность

**Важно для production:**
1. Измените `JWT_SECRET` в `.env`
2. Используйте сильные пароли для PostgreSQL
3. Настройте SSL/TLS
4. Не коммитьте `.env` файлы
5. Используйте secrets management (Docker Secrets, Vault)

## 📞 Поддержка

Если возникли проблемы:
1. Проверьте логи сервисов
2. Убедитесь что все порты свободны
3. Проверьте наличие Docker и Docker Compose
4. Создайте issue на GitHub
