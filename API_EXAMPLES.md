# API Examples - CV Platform

Практические примеры использования API платформы для создания CV.

## Базовый URL

Все запросы проходят через API Gateway:
```
http://localhost:3000
```

## Аутентификация

Большинство endpoints требуют JWT токен в заголовке:
```
Authorization: Bearer <your-jwt-token>
```

---

## 1️⃣ User Authentication Flow

### 1.1 Регистрация нового пользователя

**Request:**
```bash
POST http://localhost:3000/api/auth/register
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+1-555-0123"
}
```

**Response (201 Created):**
```json
{
  "message": "User registered successfully",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI5ZDRhYjg3Yy1hNGMzLTRlYjEtYTg2MS1lNzViNzgxYzQwMDAiLCJlbWFpbCI6ImpvaG4uZG9lQGV4YW1wbGUuY29tIiwiaWF0IjoxNzAwMDAwMDAwLCJleHAiOjE3MDAwODY0MDB9.xyz123...",
  "user": {
    "id": "9d4ab87c-a4c3-4eb1-a861-e75b781c4000",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### 1.2 Вход в систему

**Request:**
```bash
POST http://localhost:3000/api/auth/login
Content-Type: application/json

{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Response (200 OK):**
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "9d4ab87c-a4c3-4eb1-a861-e75b781c4000",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

### 1.3 Получение профиля

**Request:**
```bash
GET http://localhost:3000/api/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "user": {
    "id": "9d4ab87c-a4c3-4eb1-a861-e75b781c4000",
    "email": "john.doe@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+1-555-0123",
    "avatar": null,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### 1.4 Обновление профиля

**Request:**
```bash
PUT http://localhost:3000/api/profile
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "firstName": "Jonathan",
  "phone": "+1-555-9999",
  "avatar": "https://example.com/avatar.jpg"
}
```

**Response (200 OK):**
```json
{
  "message": "Profile updated successfully",
  "user": {
    "id": "9d4ab87c-a4c3-4eb1-a861-e75b781c4000",
    "email": "john.doe@example.com",
    "firstName": "Jonathan",
    "lastName": "Doe",
    "phone": "+1-555-9999",
    "avatar": "https://example.com/avatar.jpg",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T12:45:00.000Z"
  }
}
```

---

## 2️⃣ CV Management

### 2.1 Создание резюме

**Request:**
```bash
POST http://localhost:3000/api/cvs
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Senior Software Engineer - Full Stack",
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-0123",
  "address": "San Francisco, CA, USA",
  "summary": "Experienced full-stack software engineer with 8+ years of expertise in building scalable web applications. Proficient in JavaScript, Python, and cloud technologies. Strong background in microservices architecture and agile methodologies.",
  "experience": [
    {
      "company": "Tech Innovators Inc.",
      "position": "Senior Software Engineer",
      "startDate": "2020-03",
      "endDate": null,
      "description": "Leading development of microservices-based platform serving 1M+ users. Architected and implemented CI/CD pipelines reducing deployment time by 60%. Mentored junior developers and conducted code reviews."
    },
    {
      "company": "Digital Solutions LLC",
      "position": "Software Engineer",
      "startDate": "2016-06",
      "endDate": "2020-02",
      "description": "Developed and maintained REST APIs for e-commerce platform. Optimized database queries resulting in 40% performance improvement. Collaborated with cross-functional teams in agile environment."
    }
  ],
  "education": [
    {
      "institution": "University of California",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "startDate": "2012-09",
      "endDate": "2016-05"
    }
  ],
  "skills": [
    "JavaScript",
    "TypeScript",
    "Python",
    "Node.js",
    "React",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Microservices",
    "REST API",
    "GraphQL"
  ],
  "languages": [
    "English (Native)",
    "Spanish (Professional)",
    "French (Basic)"
  ],
  "templateId": "modern"
}
```

**Response (201 Created):**
```json
{
  "message": "CV created successfully",
  "cv": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "userId": "9d4ab87c-a4c3-4eb1-a861-e75b781c4000",
    "title": "Senior Software Engineer - Full Stack",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0123",
    "address": "San Francisco, CA, USA",
    "summary": "Experienced full-stack software engineer...",
    "experience": [...],
    "education": [...],
    "skills": [...],
    "languages": [...],
    "templateId": "modern",
    "createdAt": "2024-01-15T14:20:00.000Z",
    "updatedAt": "2024-01-15T14:20:00.000Z"
  }
}
```

### 2.2 Получение списка всех резюме пользователя

**Request:**
```bash
GET http://localhost:3000/api/cvs
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "cvs": [
    {
      "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "userId": "9d4ab87c-a4c3-4eb1-a861-e75b781c4000",
      "title": "Senior Software Engineer - Full Stack",
      "fullName": "John Doe",
      "templateId": "modern",
      "createdAt": "2024-01-15T14:20:00.000Z",
      "updatedAt": "2024-01-15T14:20:00.000Z"
    },
    {
      "id": "b2c3d4e5-f6g7-8901-bcde-fg2345678901",
      "userId": "9d4ab87c-a4c3-4eb1-a861-e75b781c4000",
      "title": "DevOps Engineer",
      "fullName": "John Doe",
      "templateId": "classic",
      "createdAt": "2024-01-10T09:15:00.000Z",
      "updatedAt": "2024-01-10T09:15:00.000Z"
    }
  ]
}
```

### 2.3 Получение конкретного резюме

**Request:**
```bash
GET http://localhost:3000/api/cvs/a1b2c3d4-e5f6-7890-abcd-ef1234567890
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "cv": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "userId": "9d4ab87c-a4c3-4eb1-a861-e75b781c4000",
    "title": "Senior Software Engineer - Full Stack",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1-555-0123",
    "address": "San Francisco, CA, USA",
    "summary": "Experienced full-stack software engineer...",
    "experience": [...],
    "education": [...],
    "skills": [...],
    "languages": [...],
    "templateId": "modern",
    "createdAt": "2024-01-15T14:20:00.000Z",
    "updatedAt": "2024-01-15T14:20:00.000Z"
  }
}
```

### 2.4 Обновление резюме

**Request:**
```bash
PUT http://localhost:3000/api/cvs/a1b2c3d4-e5f6-7890-abcd-ef1234567890
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "title": "Lead Software Engineer - Full Stack",
  "summary": "Highly experienced full-stack software engineer with 9+ years...",
  "skills": [
    "JavaScript",
    "TypeScript",
    "Python",
    "Node.js",
    "React",
    "Docker",
    "Kubernetes",
    "PostgreSQL",
    "MongoDB",
    "AWS",
    "Azure",
    "Microservices",
    "REST API",
    "GraphQL",
    "CI/CD"
  ]
}
```

**Response (200 OK):**
```json
{
  "message": "CV updated successfully",
  "cv": {
    "id": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "title": "Lead Software Engineer - Full Stack",
    "summary": "Highly experienced full-stack software engineer with 9+ years...",
    "skills": [...],
    "updatedAt": "2024-01-16T10:30:00.000Z"
  }
}
```

### 2.5 Удаление резюме

**Request:**
```bash
DELETE http://localhost:3000/api/cvs/a1b2c3d4-e5f6-7890-abcd-ef1234567890
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**Response (200 OK):**
```json
{
  "message": "CV deleted successfully"
}
```

---

## 3️⃣ Templates

### 3.1 Получение списка шаблонов

**Request:**
```bash
GET http://localhost:3000/api/templates
```

**Response (200 OK):**
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
  },
  {
    "id": "minimal",
    "name": "Minimal",
    "description": "Minimalist design for a clean look",
    "preview": "/templates/minimal/preview.png"
  },
  {
    "id": "professional",
    "name": "Professional",
    "description": "Professional template suitable for corporate roles",
    "preview": "/templates/professional/preview.png"
  }
]
```

### 3.2 Получение конкретного шаблона

**Request:**
```bash
GET http://localhost:3000/api/templates/modern
```

**Response (200 OK):**
```json
{
  "id": "modern",
  "name": "Modern",
  "description": "Contemporary design with accent colors",
  "preview": "/templates/modern/preview.png"
}
```

---

## 4️⃣ Export (PDF/DOCX)

### 4.1 Экспорт резюме в PDF

**Request:**
```bash
POST http://localhost:3000/api/export/pdf
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-0123",
  "address": "San Francisco, CA, USA",
  "summary": "Experienced full-stack software engineer with 8+ years of expertise...",
  "experience": [
    {
      "company": "Tech Innovators Inc.",
      "position": "Senior Software Engineer",
      "startDate": "2020-03",
      "endDate": null,
      "description": "Leading development of microservices-based platform..."
    }
  ],
  "education": [
    {
      "institution": "University of California",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "startDate": "2012-09",
      "endDate": "2016-05"
    }
  ],
  "skills": ["JavaScript", "Python", "Docker", "Kubernetes"],
  "languages": ["English (Native)", "Spanish (Professional)"],
  "templateId": "modern"
}
```

**Response:** Binary PDF file with headers:
```
Content-Type: application/pdf
Content-Disposition: attachment; filename=cv_John_Doe.pdf
```

### 4.2 Экспорт резюме в DOCX

**Request:**
```bash
POST http://localhost:3000/api/export/docx
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json

{
  "fullName": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1-555-0123",
  "address": "San Francisco, CA, USA",
  "summary": "Experienced full-stack software engineer with 8+ years of expertise...",
  "experience": [
    {
      "company": "Tech Innovators Inc.",
      "position": "Senior Software Engineer",
      "startDate": "2020-03",
      "description": "Leading development of microservices-based platform..."
    }
  ],
  "education": [
    {
      "institution": "University of California",
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "startDate": "2012-09",
      "endDate": "2016-05"
    }
  ],
  "skills": ["JavaScript", "Python", "Docker", "Kubernetes"],
  "languages": ["English (Native)", "Spanish (Professional)"],
  "templateId": "classic"
}
```

**Response:** Binary DOCX file with headers:
```
Content-Type: application/vnd.openxmlformats-officedocument.wordprocessingml.document
Content-Disposition: attachment; filename=cv_John_Doe.docx
```

---

## 5️⃣ Notifications

### 5.1 Отправка email уведомления

**Request:**
```bash
POST http://localhost:3000/api/notify/email
Content-Type: application/json

{
  "to": "john.doe@example.com",
  "subject": "Your CV has been created",
  "text": "Congratulations! Your CV has been successfully created on our platform.",
  "html": "<h1>Congratulations!</h1><p>Your CV has been successfully created on our platform.</p><p><a href='http://localhost:3000/cvs/a1b2c3d4'>View your CV</a></p>"
}
```

**Response (200 OK):**
```json
{
  "message": "Email sent successfully",
  "result": {
    "success": true,
    "messageId": "abc123@example.com"
  }
}
```

### 5.2 Отправка push уведомления (stub)

**Request:**
```bash
POST http://localhost:3000/api/notify/push
Content-Type: application/json

{
  "userId": "9d4ab87c-a4c3-4eb1-a861-e75b781c4000",
  "title": "CV Export Complete",
  "body": "Your CV has been successfully exported to PDF",
  "data": {
    "cvId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
    "action": "export_complete"
  }
}
```

**Response (200 OK):**
```json
{
  "message": "Push notification sent successfully (stub)",
  "notification": {
    "userId": "9d4ab87c-a4c3-4eb1-a861-e75b781c4000",
    "title": "CV Export Complete",
    "body": "Your CV has been successfully exported to PDF",
    "data": {
      "cvId": "a1b2c3d4-e5f6-7890-abcd-ef1234567890",
      "action": "export_complete"
    }
  }
}
```

---

## 6️⃣ Error Responses

### 400 Bad Request
```json
{
  "error": "Email and password are required"
}
```

### 401 Unauthorized
```json
{
  "error": "No token provided"
}
```

или

```json
{
  "error": "Invalid or expired token"
}
```

### 404 Not Found
```json
{
  "error": "CV not found"
}
```

### 409 Conflict
```json
{
  "error": "User with this email already exists"
}
```

### 429 Too Many Requests
```json
{
  "error": "Too many requests from this IP, please try again later."
}
```

### 500 Internal Server Error
```json
{
  "error": "Internal server error",
  "message": "Detailed error message"
}
```

### 502 Bad Gateway
```json
{
  "error": "Service unavailable"
}
```

---

## 📝 Примечания

1. Все даты в формате ISO 8601
2. UUID генерируются автоматически
3. JWT токен действителен 24 часа
4. Rate limit: 100 запросов / 15 минут с одного IP
5. Максимальный размер payload: 10MB
6. Экспортированные файлы генерируются динамически

## 🧪 Тестирование с Postman

Импортируйте следующую коллекцию в Postman для быстрого тестирования всех endpoints.

## 🔗 Дополнительные ресурсы

- [README.microservices.md](./README.microservices.md) - Полная документация
- OpenAPI/Swagger документация доступна по адресу: http://localhost:3003/docs (для Template/Export Service)
