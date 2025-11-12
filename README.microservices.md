# CV Platform - Microservices Architecture

Платформа для создания резюме (CV) с микросервисной архитектурой и поддержкой экспорта в PDF и DOCX.

## 🏗️ Архитектура

Проект состоит из следующих микросервисов:

1. **User/Auth Service** (Node.js + Express) - порт 3001
   - Регистрация и аутентификация пользователей
   - Управление профилями
   - JWT токены

2. **CV Management Service** (Node.js + Express) - порт 3002
   - CRUD операции с резюме
   - Хранение данных CV в PostgreSQL

3. **Template/Export Service** (Python + FastAPI) - порт 3003
   - Управление шаблонами
   - Экспорт резюме в PDF (reportlab)
   - Экспорт резюме в DOCX (python-docx)

4. **Notification Service** (Node.js + Express) - порт 3004
   - Email уведомления
   - Push уведомления (заглушка)

5. **API Gateway** (Node.js + Express) - порт 3000
   - Единая точка входа для всех сервисов
   - JWT аутентификация
   - Rate limiting
   - Проксирование запросов к микросервисам

### Инфраструктура

- **PostgreSQL** - база данных для хранения пользователей и резюме
- **Redis** - кеширование и управление сессиями
- **Docker** - контейнеризация всех сервисов

## 🚀 Быстрый старт

### Требования

- Docker >= 20.10
- Docker Compose >= 2.0
- Node.js >= 18 (для локальной разработки)
- Python >= 3.11 (для локальной разработки)

### Запуск всей платформы

```bash
# Клонировать репозиторий
git clone <repository-url>
cd Set_6

# Запустить все сервисы
docker-compose -f docker-compose.microservices.yml up --build
```

Сервисы будут доступны по следующим адресам:

- API Gateway: http://localhost:3000
- User/Auth Service: http://localhost:3001
- CV Management Service: http://localhost:3002
- Template/Export Service: http://localhost:3003
- Notification Service: http://localhost:3004
- PostgreSQL: localhost:5432
- Redis: localhost:6379

### Остановка сервисов

```bash
docker-compose -f docker-compose.microservices.yml down
```

### Остановка с удалением данных

```bash
docker-compose -f docker-compose.microservices.yml down -v
```

## 📡 API Документация

### User/Auth Service

#### Регистрация пользователя
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1234567890"
}
```

#### Вход в систему
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### Получить профиль
```bash
GET http://localhost:3000/api/profile
Authorization: Bearer <token>
```

#### Обновить профиль
```bash
PUT http://localhost:3000/api/profile
Authorization: Bearer <token>
Content-Type: application/json

{
  "firstName": "Jane",
  "lastName": "Smith",
  "phone": "+0987654321"
}
```

### CV Management Service

#### Получить список резюме
```bash
GET http://localhost:3000/api/cvs
Authorization: Bearer <token>
```

#### Создать резюме
```bash
POST http://localhost:3000/api/cvs
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Software Engineer CV",
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "New York, NY",
  "summary": "Experienced software engineer...",
  "experience": [
    {
      "company": "Tech Corp",
      "position": "Senior Developer",
      "startDate": "2020-01",
      "endDate": "2024-01",
      "description": "Led development team..."
    }
  ],
  "education": [
    {
      "institution": "University of Technology",
      "degree": "Bachelor",
      "field": "Computer Science",
      "startDate": "2015-09",
      "endDate": "2019-06"
    }
  ],
  "skills": ["JavaScript", "Python", "Docker", "PostgreSQL"],
  "languages": ["English", "Russian"],
  "templateId": "classic"
}
```

#### Получить конкретное резюме
```bash
GET http://localhost:3000/api/cvs/{cvId}
Authorization: Bearer <token>
```

#### Обновить резюме
```bash
PUT http://localhost:3000/api/cvs/{cvId}
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated CV Title",
  "summary": "Updated summary..."
}
```

#### Удалить резюме
```bash
DELETE http://localhost:3000/api/cvs/{cvId}
Authorization: Bearer <token>
```

### Template/Export Service

#### Получить список шаблонов
```bash
GET http://localhost:3000/api/templates
```

Response:
```json
[
  {
    "id": "classic",
    "name": "Classic",
    "description": "Traditional CV template with clean layout",
    "preview": "/templates/classic/preview.png"
  },
  {
    "id": "modern",
    "name": "Modern",
    "description": "Contemporary design with accent colors",
    "preview": "/templates/modern/preview.png"
  }
]
```

#### Экспорт в PDF
```bash
POST http://localhost:3000/api/export/pdf
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "summary": "Experienced developer...",
  "experience": [...],
  "education": [...],
  "skills": ["JavaScript", "Python"],
  "languages": ["English"]
}
```

Response: PDF file download

#### Экспорт в DOCX
```bash
POST http://localhost:3000/api/export/docx
Authorization: Bearer <token>
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "summary": "Experienced developer...",
  "experience": [...],
  "education": [...],
  "skills": ["JavaScript", "Python"],
  "languages": ["English"]
}
```

Response: DOCX file download

### Notification Service

#### Отправить email
```bash
POST http://localhost:3000/api/notify/email
Content-Type: application/json

{
  "to": "user@example.com",
  "subject": "Welcome to CV Platform",
  "text": "Thank you for registering!",
  "html": "<h1>Welcome!</h1><p>Thank you for registering!</p>"
}
```

#### Отправить push уведомление (заглушка)
```bash
POST http://localhost:3000/api/notify/push
Content-Type: application/json

{
  "userId": "uuid",
  "title": "CV Updated",
  "body": "Your CV has been successfully updated",
  "data": {}
}
```

## 🔧 Локальная разработка

### Разработка отдельного сервиса

#### User/Auth Service
```bash
cd services/user-auth-service
npm install
cp .env.example .env
# Отредактировать .env
npm run dev
```

#### CV Management Service
```bash
cd services/cv-management-service
npm install
cp .env.example .env
# Отредактировать .env
npm run dev
```

#### Template/Export Service
```bash
cd services/template-export-service
pip install -r requirements.txt
cp .env.example .env
# Отредактировать .env
uvicorn app.main:app --reload --port 3003
```

#### Notification Service
```bash
cd services/notification-service
npm install
cp .env.example .env
# Отредактировать .env
npm run dev
```

#### API Gateway
```bash
cd services/api-gateway
npm install
cp .env.example .env
# Отредактировать .env
npm run dev
```

## 🔐 Безопасность

### JWT Secret
В production обязательно измените `JWT_SECRET` во всех сервисах на длинный случайный ключ:

```bash
# Генерация секретного ключа
openssl rand -base64 64
```

### Environment Variables
Не коммитьте файлы `.env` с реальными credentials. Используйте `.env.example` как шаблон.

## 📊 Мониторинг

### Health Checks

Все сервисы имеют endpoint для проверки здоровья:

```bash
# API Gateway
curl http://localhost:3000/health

# User/Auth Service
curl http://localhost:3001/health

# CV Management Service
curl http://localhost:3002/health

# Template/Export Service
curl http://localhost:3003/health

# Notification Service
curl http://localhost:3004/health
```

### Логирование

Просмотр логов всех сервисов:
```bash
docker-compose -f docker-compose.microservices.yml logs -f
```

Просмотр логов конкретного сервиса:
```bash
docker-compose -f docker-compose.microservices.yml logs -f api-gateway
docker-compose -f docker-compose.microservices.yml logs -f user-auth-service
```

## 🧪 Тестирование

### Примеры curl запросов

Полный workflow:

```bash
# 1. Регистрация
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123",
    "firstName": "Test",
    "lastName": "User"
  }'

# 2. Вход (сохраните token)
TOKEN=$(curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "test123"
  }' | jq -r '.token')

# 3. Создание резюме
CV_ID=$(curl -X POST http://localhost:3000/api/cvs \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My CV",
    "fullName": "Test User",
    "email": "test@example.com",
    "skills": ["JavaScript", "Docker"]
  }' | jq -r '.cv.id')

# 4. Получение списка резюме
curl -X GET http://localhost:3000/api/cvs \
  -H "Authorization: Bearer $TOKEN"

# 5. Экспорт в PDF
curl -X POST http://localhost:3000/api/export/pdf \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "skills": ["JavaScript", "Docker"]
  }' --output cv.pdf

# 6. Экспорт в DOCX
curl -X POST http://localhost:3000/api/export/docx \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fullName": "Test User",
    "email": "test@example.com",
    "skills": ["JavaScript", "Docker"]
  }' --output cv.docx
```

## 🛠️ Устранение неполадок

### PostgreSQL не запускается
```bash
# Проверить логи
docker-compose -f docker-compose.microservices.yml logs postgres

# Пересоздать контейнер
docker-compose -f docker-compose.microservices.yml down -v
docker-compose -f docker-compose.microservices.yml up postgres
```

### Сервис не может подключиться к БД
Убедитесь что PostgreSQL запущен и готов принимать соединения:
```bash
docker-compose -f docker-compose.microservices.yml ps
```

### Redis недоступен
```bash
# Проверить статус Redis
docker-compose -f docker-compose.microservices.yml logs redis

# Перезапустить Redis
docker-compose -f docker-compose.microservices.yml restart redis
```

## 📝 Структура проекта

```
Set_6/
├── services/
│   ├── user-auth-service/        # Сервис аутентификации
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   └── index.js
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── .env.example
│   │
│   ├── cv-management-service/    # Сервис управления CV
│   │   ├── src/
│   │   │   ├── config/
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   ├── middleware/
│   │   │   └── index.js
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── .env.example
│   │
│   ├── template-export-service/  # Сервис шаблонов и экспорта
│   │   ├── app/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── main.py
│   │   ├── Dockerfile
│   │   ├── requirements.txt
│   │   └── .env.example
│   │
│   ├── notification-service/     # Сервис уведомлений
│   │   ├── src/
│   │   │   ├── routes/
│   │   │   ├── services/
│   │   │   └── index.js
│   │   ├── Dockerfile
│   │   ├── package.json
│   │   └── .env.example
│   │
│   └── api-gateway/              # API Gateway
│       ├── src/
│       │   ├── middleware/
│       │   ├── utils/
│       │   └── index.js
│       ├── Dockerfile
│       ├── package.json
│       └── .env.example
│
├── docker-compose.microservices.yml
├── README.microservices.md
└── API_EXAMPLES.md
```

## 🎯 Дальнейшее развитие

- [ ] Добавить WebSocket для real-time обновлений
- [ ] Реализовать полноценные push уведомления
- [ ] Добавить больше шаблонов для резюме
- [ ] Реализовать систему версионирования CV
- [ ] Добавить поиск по резюме
- [ ] Интеграция с LinkedIn API
- [ ] Добавить unit и integration тесты
- [ ] CI/CD pipeline
- [ ] Kubernetes deployment
- [ ] Monitoring с Prometheus и Grafana
- [ ] Distributed tracing с Jaeger

## 📄 Лицензия

MIT
