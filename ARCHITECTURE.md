# Architecture Documentation - CV Platform

Подробная архитектурная документация микросервисной платформы для создания CV.

## 📐 Общая архитектура

```
┌─────────────────────────────────────────────────────────────────┐
│                           Frontend / Client                     │
│                    (React, Angular, Vue, etc.)                  │
└────────────────────────┬────────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        API Gateway (Port 3000)                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  - JWT Authentication                                      │  │
│  │  - Rate Limiting (100 req/15min)                          │  │
│  │  - Request Routing                                         │  │
│  │  - CORS Configuration                                      │  │
│  └───────────────────────────────────────────────────────────┘  │
└────────────────────────┬────────────────────────────────────────┘
                         │
         ┌───────────────┼───────────────┬─────────────┬─────────┐
         ▼               ▼               ▼             ▼         ▼
┌───────────────┐ ┌────────────┐ ┌────────────┐ ┌──────────┐ ┌─────┐
│  User/Auth    │ │    CV      │ │  Template  │ │ Notif.   │ │Redis│
│   Service     │ │ Management │ │  Export    │ │ Service  │ │Cache│
│  (Port 3001)  │ │(Port 3002) │ │(Port 3003) │ │(Port 3004│ │     │
│               │ │            │ │            │ │)         │ │     │
│  - Register   │ │  - CRUD    │ │  - PDF     │ │ - Email  │ │     │
│  - Login      │ │  - Search  │ │  - DOCX    │ │ - Push   │ │     │
│  - Profile    │ │  - Filter  │ │  - Template│ │          │ │     │
└───────┬───────┘ └──────┬─────┘ └────────────┘ └──────────┘ └─────┘
        │                │
        │                │
        └────────┬───────┘
                 ▼
        ┌─────────────────┐
        │   PostgreSQL    │
        │   (Port 5432)   │
        │                 │
        │  - Users Table  │
        │  - CVs Table    │
        └─────────────────┘
```

## 🎯 Сервисы

### 1. API Gateway (Node.js + Express)

**Порт:** 3000  
**Ответственность:** Единая точка входа для всех клиентов

#### Возможности:
- **Маршрутизация запросов** к соответствующим микросервисам
- **JWT Authentication** - проверка токенов для защищенных endpoints
- **Rate Limiting** - защита от DDoS (100 запросов/15 минут)
- **CORS** - настройка разрешений для cross-origin запросов
- **Request/Response трансформация**
- **Централизованное логирование**

#### Технологии:
- Express.js
- http-proxy-middleware (проксирование)
- express-rate-limit (rate limiting)
- jsonwebtoken (JWT)
- Redis (кеширование)

#### Основные routes:
```
/api/auth/*       → User/Auth Service
/api/profile/*    → User/Auth Service (protected)
/api/cvs/*        → CV Management Service (protected)
/api/templates/*  → Template/Export Service
/api/export/*     → Template/Export Service (protected)
/api/notify/*     → Notification Service
```

---

### 2. User/Auth Service (Node.js + Express)

**Порт:** 3001  
**Ответственность:** Управление пользователями и аутентификация

#### Возможности:
- **Регистрация** новых пользователей
- **Аутентификация** (логин/выход)
- **Управление профилем** (чтение/обновление)
- **Генерация JWT токенов**
- **Хеширование паролей** (bcrypt)

#### Технологии:
- Express.js
- Sequelize ORM
- PostgreSQL
- bcryptjs (хеширование паролей)
- jsonwebtoken (JWT)

#### База данных:

**Таблица: users**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone VARCHAR(50),
  avatar VARCHAR(500),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### API Endpoints:
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/profile` - Получить профиль (protected)
- `PUT /api/profile` - Обновить профиль (protected)

---

### 3. CV Management Service (Node.js + Express)

**Порт:** 3002  
**Ответственность:** Управление резюме пользователей

#### Возможности:
- **CRUD операции** для резюме
- **Фильтрация** по пользователю
- **Хранение структурированных данных** (JSONB)
- **Валидация данных**

#### Технологии:
- Express.js
- Sequelize ORM
- PostgreSQL (JSONB)

#### База данных:

**Таблица: cvs**
```sql
CREATE TABLE cvs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id),
  title VARCHAR(500) NOT NULL,
  full_name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(50),
  address TEXT,
  summary TEXT,
  experience JSONB DEFAULT '[]',
  education JSONB DEFAULT '[]',
  skills JSONB DEFAULT '[]',
  languages JSONB DEFAULT '[]',
  template_id VARCHAR(100) DEFAULT 'default',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);
```

#### Структура JSONB полей:

**experience:**
```json
[
  {
    "company": "Tech Corp",
    "position": "Senior Developer",
    "startDate": "2020-01",
    "endDate": "2024-01",
    "description": "Job description..."
  }
]
```

**education:**
```json
[
  {
    "institution": "University",
    "degree": "Bachelor",
    "field": "Computer Science",
    "startDate": "2015-09",
    "endDate": "2019-06"
  }
]
```

**skills:**
```json
["JavaScript", "Python", "Docker", "PostgreSQL"]
```

**languages:**
```json
["English (Native)", "Russian (Professional)"]
```

#### API Endpoints:
- `GET /api/cvs` - Список резюме (protected)
- `POST /api/cvs` - Создать резюме (protected)
- `GET /api/cvs/{id}` - Получить резюме (protected)
- `PUT /api/cvs/{id}` - Обновить резюме (protected)
- `DELETE /api/cvs/{id}` - Удалить резюме (protected)

---

### 4. Template/Export Service (Python + FastAPI)

**Порт:** 3003  
**Ответственность:** Шаблоны и экспорт резюме

#### Возможности:
- **Управление шаблонами** резюме
- **Экспорт в PDF** (reportlab)
- **Экспорт в DOCX** (python-docx)
- **Кастомизация шаблонов**
- **Валидация данных** (Pydantic)

#### Технологии:
- FastAPI (асинхронный Python фреймворк)
- python-docx (генерация DOCX)
- reportlab (генерация PDF)
- Pydantic (валидация данных)

#### Доступные шаблоны:
1. **Classic** - Традиционный чистый дизайн
2. **Modern** - Современный дизайн с акцентами
3. **Minimal** - Минималистичный дизайн
4. **Professional** - Профессиональный корпоративный стиль

#### API Endpoints:
- `GET /api/templates` - Список шаблонов
- `GET /api/templates/{id}` - Конкретный шаблон
- `POST /api/export/pdf` - Экспорт в PDF (protected)
- `POST /api/export/docx` - Экспорт в DOCX (protected)
- `GET /docs` - Swagger UI документация

#### PDF Generation Flow:
```
CV Data → Validation → Template Selection → PDF Generation → Binary Response
```

#### DOCX Generation Flow:
```
CV Data → Validation → Template Selection → DOCX Generation → Binary Response
```

---

### 5. Notification Service (Node.js + Express)

**Порт:** 3004  
**Ответственность:** Уведомления пользователей

#### Возможности:
- **Email уведомления** (nodemailer)
- **Push уведомления** (заглушка, можно расширить)
- **Асинхронная отправка**
- **Шаблоны писем**

#### Технологии:
- Express.js
- nodemailer (SMTP)
- Поддержка Gmail, SendGrid, AWS SES

#### API Endpoints:
- `POST /api/notify/email` - Отправить email
- `POST /api/notify/push` - Отправить push (stub)

#### Email уведомления:
- Регистрация пользователя
- Успешный экспорт CV
- Изменение профиля
- Сброс пароля (будущая функция)

---

## 🗄️ Инфраструктура

### PostgreSQL

**Версия:** 15-alpine  
**Порт:** 5432

#### Конфигурация:
- **Persistent storage** через Docker volumes
- **Health checks** для проверки готовности
- **Connection pooling** в каждом сервисе
- **Retry logic** при подключении

#### Таблицы:
1. `users` - Пользователи
2. `cvs` - Резюме

#### Индексы:
```sql
CREATE INDEX idx_cvs_user_id ON cvs(user_id);
CREATE INDEX idx_cvs_created_at ON cvs(created_at DESC);
CREATE INDEX idx_users_email ON users(email);
```

---

### Redis

**Версия:** 7-alpine  
**Порт:** 6379

#### Использование:
- **Session storage** для API Gateway
- **Rate limiting** данные
- **Кеширование** часто запрашиваемых данных
- **Pub/Sub** для межсервисной коммуникации (опционально)

#### Конфигурация:
- Persistence: AOF (Append Only File)
- Память: до 256MB (настраивается)
- Eviction policy: allkeys-lru

---

## 🔒 Безопасность

### JWT Authentication

**Секрет:** Настраивается через `JWT_SECRET`  
**Время жизни:** 24 часа  
**Алгоритм:** HS256

**Структура токена:**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Password Security

- **Хеширование:** bcrypt
- **Salt rounds:** 10
- **Хранение:** Только хеш, никогда plain text

### API Security

- **Rate Limiting:** 100 запросов / 15 минут
- **CORS:** Настраивается для production
- **Input validation:** На всех endpoints
- **SQL Injection:** Защита через Sequelize ORM
- **XSS:** Защита через санитизацию входных данных

---

## 🔄 Взаимодействие сервисов

### Типичный flow создания резюме:

```
1. User → POST /api/auth/register → User/Auth Service
   ↓
2. User receives JWT token
   ↓
3. User → POST /api/cvs (with JWT) → API Gateway
   ↓
4. API Gateway validates JWT
   ↓
5. API Gateway → CV Management Service
   ↓
6. CV Management Service saves to PostgreSQL
   ↓
7. Response back to User
   ↓
8. (Optional) Notification Service sends email
```

### Типичный flow экспорта:

```
1. User → POST /api/export/pdf (with JWT) → API Gateway
   ↓
2. API Gateway validates JWT
   ↓
3. API Gateway → Template/Export Service
   ↓
4. Template/Export Service generates PDF
   ↓
5. Binary PDF response to User
   ↓
6. (Optional) Notification Service sends email with link
```

---

## 📊 Масштабирование

### Горизонтальное масштабирование

Каждый сервис может масштабироваться независимо:

```yaml
# Пример для Kubernetes
replicas:
  api-gateway: 3
  user-auth-service: 2
  cv-management-service: 3
  template-export-service: 2
  notification-service: 1
```

### Вертикальное масштабирование

Настройка ресурсов для каждого сервиса:

```yaml
resources:
  limits:
    memory: "512Mi"
    cpu: "500m"
  requests:
    memory: "256Mi"
    cpu: "250m"
```

---

## 🔍 Мониторинг

### Health Checks

Каждый сервис имеет `/health` endpoint:

```bash
GET /health
Response: {"status": "ok", "service": "service-name"}
```

### Логирование

- Централизованное логирование через Docker logs
- Структурированные логи (JSON format)
- Уровни логирования: ERROR, WARN, INFO, DEBUG

### Метрики (будущее)

- Prometheus для сбора метрик
- Grafana для визуализации
- Jaeger для distributed tracing

---

## 🚀 Deployment

### Development
- Docker Compose локально
- Hot reload для разработки

### Staging
- Docker Compose на VPS
- Shared PostgreSQL и Redis

### Production
- Kubernetes кластер
- Managed PostgreSQL (AWS RDS, Azure Database)
- Managed Redis (ElastiCache, Azure Cache)
- Load Balancer
- Auto-scaling
- Multi-region deployment

---

## 🔮 Будущие улучшения

1. **WebSocket support** для real-time обновлений
2. **File upload** для фото и документов
3. **Multi-language support** для интернационализации
4. **Advanced templates** с визуальным редактором
5. **CV analytics** - просмотры, скачивания
6. **Collaboration** - совместная работа над CV
7. **API versioning** (v1, v2)
8. **GraphQL API** как альтернатива REST
9. **CI/CD pipeline** с автоматическим тестированием
10. **Backup и disaster recovery** стратегия

---

## 📚 Технический стек

### Backend
- **Node.js** 18+ (User/Auth, CV, Notification, Gateway)
- **Python** 3.11+ (Template/Export)
- **Express.js** 4+ (Node.js framework)
- **FastAPI** 0.104+ (Python framework)

### Database
- **PostgreSQL** 15 (основная БД)
- **Redis** 7 (кеш и сессии)

### Libraries
- **Sequelize** - ORM для PostgreSQL
- **jsonwebtoken** - JWT токены
- **bcryptjs** - Хеширование паролей
- **python-docx** - Генерация DOCX
- **reportlab** - Генерация PDF
- **nodemailer** - Email отправка

### DevOps
- **Docker** - Контейнеризация
- **Docker Compose** - Оркестрация (dev)
- **Kubernetes** - Оркестрация (prod, опционально)
- **Nginx** - Reverse proxy (prod)

---

## 📝 Соглашения о коде

### API Responses

**Success:**
```json
{
  "message": "Operation successful",
  "data": {...}
}
```

**Error:**
```json
{
  "error": "Error type",
  "message": "Detailed message"
}
```

### HTTP Status Codes
- `200 OK` - Успех (GET, PUT, DELETE)
- `201 Created` - Ресурс создан (POST)
- `400 Bad Request` - Неверные данные
- `401 Unauthorized` - Нет/неверный токен
- `403 Forbidden` - Доступ запрещен
- `404 Not Found` - Ресурс не найден
- `409 Conflict` - Конфликт (например, email уже существует)
- `429 Too Many Requests` - Rate limit превышен
- `500 Internal Server Error` - Ошибка сервера
- `502 Bad Gateway` - Сервис недоступен

### Naming Conventions
- **Variables:** camelCase
- **Functions:** camelCase
- **Classes:** PascalCase
- **Constants:** UPPER_SNAKE_CASE
- **Database tables:** snake_case
- **API routes:** kebab-case

---

## 🔗 Ссылки

- [README.microservices.md](./README.microservices.md) - Основная документация
- [API_EXAMPLES.md](./API_EXAMPLES.md) - Примеры API
- [DEPLOYMENT.md](./DEPLOYMENT.md) - Развертывание
- [QUICKSTART.md](./QUICKSTART.md) - Быстрый старт
