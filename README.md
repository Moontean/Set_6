# CV Platform - Microservices Architecture

Микросервисная платформа для создания и экспорта резюме (CV) с поддержкой PDF и DOCX форматов.

## 🚀 Quick Start

```bash
# Запустить все сервисы
docker compose -f docker-compose.microservices.yml up --build -d

# Проверить статус
curl http://localhost:3000/health
```

Полная инструкция: [QUICKSTART.md](./QUICKSTART.md)

## 📐 Архитектура

Платформа состоит из 5 микросервисов:

1. **API Gateway** (Port 3000) - Маршрутизация, JWT auth, rate limiting
2. **User/Auth Service** (Port 3001) - Регистрация, аутентификация, профили
3. **CV Management Service** (Port 3002) - CRUD операции с резюме
4. **Template/Export Service** (Port 3003) - Экспорт в PDF/DOCX, шаблоны
5. **Notification Service** (Port 3004) - Email и push уведомления

**Инфраструктура:**
- PostgreSQL 15 - Хранение данных
- Redis 7 - Кеширование и сессии
- Docker - Контейнеризация

## 📚 Документация

### Начало работы
- **[QUICKSTART.md](./QUICKSTART.md)** - Быстрый старт за 5 минут
- **[README.microservices.md](./README.microservices.md)** - Полная документация платформы

### Разработка
- **[API_EXAMPLES.md](./API_EXAMPLES.md)** - Примеры использования API
- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Детальная архитектура

### Развертывание
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Инструкции по развертыванию
- **[SECURITY.md](./SECURITY.md)** - Безопасность и лучшие практики

### Справка
- **[SUMMARY.md](./SUMMARY.md)** - Обзор реализации и статистика

## 🎯 Основные возможности

- ✅ Регистрация и аутентификация пользователей (JWT)
- ✅ Создание, редактирование, удаление резюме
- ✅ Экспорт в PDF и DOCX форматы
- ✅ 4 профессиональных шаблона
- ✅ Email уведомления
- ✅ Rate limiting для защиты от DDoS
- ✅ Масштабируемая микросервисная архитектура

## 📝 Примеры API

### Регистрация
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"pass123"}'
```

### Создание CV
```bash
curl -X POST http://localhost:3000/api/cvs \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"title":"My CV","fullName":"John Doe"}'
```

### Экспорт в PDF
```bash
curl -X POST http://localhost:3000/api/export/pdf \
  -H "Authorization: Bearer <token>" \
  -d '{"fullName":"John Doe"}' \
  --output cv.pdf
```

Больше примеров: [API_EXAMPLES.md](./API_EXAMPLES.md)

## 🛠️ Технологии

**Backend:**
- Node.js + Express (4 сервиса)
- Python + FastAPI (1 сервис)

**Database:**
- PostgreSQL 15
- Redis 7

**Key Libraries:**
- Sequelize (ORM)
- jsonwebtoken (JWT)
- bcryptjs (password hashing)
- python-docx (DOCX generation)
- reportlab (PDF generation)
- nodemailer (email)

**DevOps:**
- Docker
- Docker Compose

## 🔐 Безопасность

- JWT аутентификация (24ч)
- bcrypt хеширование паролей
- Rate limiting (100 req/15min)
- SQL injection защита (ORM)
- Docker network isolation
- CORS конфигурация

Подробнее: [SECURITY.md](./SECURITY.md)

## 📊 Endpoints

**Auth:**
- `POST /api/auth/register` - Регистрация
- `POST /api/auth/login` - Вход
- `GET /api/profile` - Профиль

**CV:**
- `GET /api/cvs` - Список резюме
- `POST /api/cvs` - Создать резюме
- `GET /api/cvs/{id}` - Детали резюме
- `PUT /api/cvs/{id}` - Обновить резюме
- `DELETE /api/cvs/{id}` - Удалить резюме

**Export:**
- `GET /api/templates` - Список шаблонов
- `POST /api/export/pdf` - Экспорт в PDF
- `POST /api/export/docx` - Экспорт в DOCX

**Notifications:**
- `POST /api/notify/email` - Email уведомление
- `POST /api/notify/push` - Push уведомление

## 🚀 Развертывание

### Development
```bash
docker compose -f docker-compose.microservices.yml up --build
```

### Production
См. [DEPLOYMENT.md](./DEPLOYMENT.md) для:
- VPS deployment
- Kubernetes deployment
- SSL configuration
- Backup strategies

## 📁 Структура

```
Set_6/
├── services/
│   ├── api-gateway/
│   ├── user-auth-service/
│   ├── cv-management-service/
│   ├── template-export-service/
│   └── notification-service/
├── docker-compose.microservices.yml
└── docs/ (*.md files)
```

## 🐛 Устранение неполадок

```bash
# Логи всех сервисов
docker compose -f docker-compose.microservices.yml logs -f

# Логи конкретного сервиса
docker compose -f docker-compose.microservices.yml logs -f api-gateway

# Перезапуск
docker compose -f docker-compose.microservices.yml restart

# Очистка
docker compose -f docker-compose.microservices.yml down -v
```

## 🔗 Ссылки

- [Issue #1](https://github.com/Moontean/Set_6/issues/1) - Исходное задание
- [Pull Request](https://github.com/Moontean/Set_6/pull/) - Реализация

## 📄 Лицензия

MIT

## 👨‍💻 Разработка

Проект реализован согласно требованиям из issue #1:
- ✅ Микросервисная архитектура
- ✅ Node.js + Python
- ✅ PostgreSQL + Redis
- ✅ Docker
- ✅ PDF/DOCX экспорт
- ✅ Полная документация