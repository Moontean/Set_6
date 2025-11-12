# Guide: Splitting Microservices into Separate Repositories

This guide explains how to split the monorepo into separate repositories for each microservice.

## Created Repositories

You've created the following repositories:
- `api-gateway`
- `user-auth-service`
- `cv-management-service`
- `template-export-service`
- `notification-service`

## Step-by-Step Migration

### 1. API Gateway

```bash
# Navigate to the api-gateway repository
cd /path/to/api-gateway

# Copy files from monorepo
cp -r /path/to/Set_6/services/api-gateway/* .

# Create README.md
cat > README.md << 'EOF'
# API Gateway - CV Platform

API Gateway for the CV Platform microservices architecture.

## Features
- JWT authentication
- Rate limiting (100 requests/15 minutes)
- Request routing to microservices
- Redis integration for caching

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your configuration

# Run locally
npm start

# Or with Docker
docker build -t api-gateway .
docker run -p 3000:3000 --env-file .env api-gateway
```

## Environment Variables

See `.env.example` for required variables:
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - Secret for JWT verification
- `REDIS_URL` - Redis connection URL
- `AUTH_SERVICE_URL` - User/Auth service URL
- `CV_SERVICE_URL` - CV Management service URL
- `EXPORT_SERVICE_URL` - Template/Export service URL
- `NOTIFICATION_SERVICE_URL` - Notification service URL

## API Endpoints

All requests are proxied to appropriate microservices:
- `/api/auth/*` → User/Auth Service
- `/api/profile/*` → User/Auth Service (protected)
- `/api/cvs/*` → CV Management Service (protected)
- `/api/templates/*` → Template/Export Service
- `/api/export/*` → Template/Export Service (protected)
- `/api/notify/*` → Notification Service

## Health Check

```bash
GET /health
```

Response:
```json
{"status": "ok", "service": "api-gateway"}
```

## Part of CV Platform

This is one of 5 microservices in the CV Platform:
- **api-gateway** (this service)
- user-auth-service
- cv-management-service
- template-export-service
- notification-service
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
*.log
.DS_Store
EOF

# Initialize git and commit
git init
git add .
git commit -m "Initial commit: API Gateway from CV Platform"
git branch -M main
git remote add origin https://github.com/Moontean/api-gateway.git
git push -u origin main
```

### 2. User/Auth Service

```bash
# Navigate to the user-auth-service repository
cd /path/to/user-auth-service

# Copy files from monorepo
cp -r /path/to/Set_6/services/user-auth-service/* .

# Create README.md
cat > README.md << 'EOF'
# User/Auth Service - CV Platform

User authentication and profile management service.

## Features
- User registration
- JWT authentication (24h tokens)
- Profile management
- Password hashing with bcrypt (10 rounds)
- PostgreSQL with Sequelize ORM

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database configuration

# Run locally
npm start

# Or with Docker
docker build -t user-auth-service .
docker run -p 3001:3001 --env-file .env user-auth-service
```

## Environment Variables

See `.env.example`:
- `PORT` - Server port (default: 3001)
- `DB_HOST` - PostgreSQL host
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret for JWT tokens

## Database Schema

**users table:**
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

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user

### Profile (requires JWT)
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update user profile

## Health Check

```bash
GET /health
```

## Part of CV Platform

This is one of 5 microservices in the CV Platform.
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
*.log
.DS_Store
EOF

# Initialize git and commit
git init
git add .
git commit -m "Initial commit: User/Auth Service from CV Platform"
git branch -M main
git remote add origin https://github.com/Moontean/user-auth-service.git
git push -u origin main
```

### 3. CV Management Service

```bash
# Navigate to the cv-management-service repository
cd /path/to/cv-management-service

# Copy files from monorepo
cp -r /path/to/Set_6/services/cv-management-service/* .

# Create README.md
cat > README.md << 'EOF'
# CV Management Service - CV Platform

CRUD operations for CV (resume) management.

## Features
- Create, read, update, delete CVs
- User-based filtering
- JSONB storage for flexible data structure
- Support for experience, education, skills, languages
- Template selection

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your database configuration

# Run locally
npm start

# Or with Docker
docker build -t cv-management-service .
docker run -p 3002:3002 --env-file .env cv-management-service
```

## Environment Variables

See `.env.example`:
- `PORT` - Server port (default: 3002)
- `DB_HOST` - PostgreSQL host
- `DB_NAME` - Database name
- `DB_USER` - Database user
- `DB_PASSWORD` - Database password
- `JWT_SECRET` - Secret for JWT verification

## Database Schema

**cvs table:**
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

## API Endpoints (all require JWT)

- `GET /api/cvs` - List all user's CVs
- `POST /api/cvs` - Create new CV
- `GET /api/cvs/{id}` - Get CV details
- `PUT /api/cvs/{id}` - Update CV
- `DELETE /api/cvs/{id}` - Delete CV

## Health Check

```bash
GET /health
```

## Part of CV Platform

This is one of 5 microservices in the CV Platform.
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
*.log
.DS_Store
EOF

# Initialize git and commit
git init
git add .
git commit -m "Initial commit: CV Management Service from CV Platform"
git branch -M main
git remote add origin https://github.com/Moontean/cv-management-service.git
git push -u origin main
```

### 4. Template/Export Service

```bash
# Navigate to the template-export-service repository
cd /path/to/template-export-service

# Copy files from monorepo
cp -r /path/to/Set_6/services/template-export-service/* .

# Create README.md
cat > README.md << 'EOF'
# Template/Export Service - CV Platform

CV template management and export service (PDF & DOCX).

## Features
- 4 professional CV templates (Classic, Modern, Minimal, Professional)
- PDF export using reportlab
- DOCX export using python-docx
- FastAPI with automatic OpenAPI documentation

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Set up environment
cp .env.example .env

# Run locally
uvicorn app.main:app --host 0.0.0.0 --port 3003

# Or with Docker
docker build -t template-export-service .
docker run -p 3003:3003 template-export-service
```

## Environment Variables

See `.env.example`:
- `PORT` - Server port (default: 3003)

## API Endpoints

### Templates
- `GET /api/templates` - List all templates
- `GET /api/templates/{id}` - Get template details

### Export (requires JWT)
- `POST /api/export/pdf` - Export CV to PDF
- `POST /api/export/docx` - Export CV to DOCX

### Documentation
- `GET /docs` - Swagger UI documentation
- `GET /redoc` - ReDoc documentation

## Health Check

```bash
GET /health
```

## Available Templates

1. **Classic** - Traditional clean layout
2. **Modern** - Contemporary design with accents
3. **Minimal** - Minimalist clean look
4. **Professional** - Corporate style

## Part of CV Platform

This is one of 5 microservices in the CV Platform.
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
__pycache__/
*.pyc
.env
*.log
.DS_Store
EOF

# Initialize git and commit
git init
git add .
git commit -m "Initial commit: Template/Export Service from CV Platform"
git branch -M main
git remote add origin https://github.com/Moontean/template-export-service.git
git push -u origin main
```

### 5. Notification Service

```bash
# Navigate to the notification-service repository
cd /path/to/notification-service

# Copy files from monorepo
cp -r /path/to/Set_6/services/notification-service/* .

# Create README.md
cat > README.md << 'EOF'
# Notification Service - CV Platform

Notification service for email and push notifications.

## Features
- Email notifications via nodemailer
- Push notifications (stub for future expansion)
- Configurable SMTP settings

## Quick Start

```bash
# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your SMTP configuration

# Run locally
npm start

# Or with Docker
docker build -t notification-service .
docker run -p 3004:3004 --env-file .env notification-service
```

## Environment Variables

See `.env.example`:
- `PORT` - Server port (default: 3004)
- `SMTP_HOST` - SMTP server host
- `SMTP_PORT` - SMTP server port (default: 587)
- `SMTP_SECURE` - Use SSL/TLS (default: false)
- `SMTP_USER` - SMTP username
- `SMTP_PASS` - SMTP password
- `EMAIL_FROM` - Default sender email

## API Endpoints

- `POST /api/notify/email` - Send email notification
- `POST /api/notify/push` - Send push notification (stub)

## Health Check

```bash
GET /health
```

## Part of CV Platform

This is one of 5 microservices in the CV Platform.
EOF

# Create .gitignore
cat > .gitignore << 'EOF'
node_modules/
.env
*.log
.DS_Store
EOF

# Initialize git and commit
git init
git add .
git commit -m "Initial commit: Notification Service from CV Platform"
git branch -M main
git remote add origin https://github.com/Moontean/notification-service.git
git push -u origin main
```

## Docker Compose for Development

After splitting, you'll need a new `docker-compose.yml` that references the separate repositories.

Create in a new repository (e.g., `cv-platform-deployment`):

```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: cv-platform-postgres
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
      POSTGRES_DB: cv_platform
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "5432:5432"
    networks:
      - cv-platform-network
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d cv_platform"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: cv-platform-redis
    ports:
      - "6379:6379"
    networks:
      - cv-platform-network
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 10s
      timeout: 5s
      retries: 5

  user-auth-service:
    image: moontean/user-auth-service:latest
    # Or for local development:
    # build: ../user-auth-service
    container_name: user-auth-service
    environment:
      PORT: 3001
      DB_HOST: postgres
      DB_NAME: cv_platform
      DB_USER: user
      DB_PASSWORD: password
      JWT_SECRET: your-secret-key-change-in-production
    ports:
      - "3001:3001"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - cv-platform-network
    restart: unless-stopped

  cv-management-service:
    image: moontean/cv-management-service:latest
    # Or for local development:
    # build: ../cv-management-service
    container_name: cv-management-service
    environment:
      PORT: 3002
      DB_HOST: postgres
      DB_NAME: cv_platform
      DB_USER: user
      DB_PASSWORD: password
      JWT_SECRET: your-secret-key-change-in-production
    ports:
      - "3002:3002"
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - cv-platform-network
    restart: unless-stopped

  template-export-service:
    image: moontean/template-export-service:latest
    # Or for local development:
    # build: ../template-export-service
    container_name: template-export-service
    environment:
      PORT: 3003
    ports:
      - "3003:3003"
    networks:
      - cv-platform-network
    restart: unless-stopped

  notification-service:
    image: moontean/notification-service:latest
    # Or for local development:
    # build: ../notification-service
    container_name: notification-service
    environment:
      PORT: 3004
    ports:
      - "3004:3004"
    networks:
      - cv-platform-network
    restart: unless-stopped

  api-gateway:
    image: moontean/api-gateway:latest
    # Or for local development:
    # build: ../api-gateway
    container_name: api-gateway
    environment:
      PORT: 3000
      JWT_SECRET: your-secret-key-change-in-production
      REDIS_URL: redis://redis:6379
      AUTH_SERVICE_URL: http://user-auth-service:3001
      CV_SERVICE_URL: http://cv-management-service:3002
      EXPORT_SERVICE_URL: http://template-export-service:3003
      NOTIFICATION_SERVICE_URL: http://notification-service:3004
    ports:
      - "3000:3000"
    depends_on:
      - redis
      - user-auth-service
      - cv-management-service
      - template-export-service
      - notification-service
    networks:
      - cv-platform-network
    restart: unless-stopped

networks:
  cv-platform-network:
    driver: bridge

volumes:
  postgres_data:
```

## GitHub Actions CI/CD

Add to each repository (`.github/workflows/docker-publish.yml`):

```yaml
name: Docker Build and Push

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout repository
        uses: actions/checkout@v3

      - name: Log in to Container Registry
        uses: docker/login-action@v2
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v4
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}

      - name: Build and push Docker image
        uses: docker/build-push-action@v4
        with:
          context: .
          push: ${{ github.event_name != 'pull_request' }}
          tags: ${{ steps.meta.outputs.tags }}
          labels: ${{ steps.meta.outputs.labels }}
```

## Benefits of Multi-Repo Approach

1. **Independent Development** - Each team can work on their service independently
2. **Separate CI/CD** - Each service has its own build and deployment pipeline
3. **Independent Versioning** - Services can have different release cycles
4. **Smaller Codebases** - Easier to understand and maintain
5. **Access Control** - Different permissions per service
6. **Technology Freedom** - Each service can use different tech stacks

## Coordination

With separate repositories, you'll need:

1. **Shared Documentation** - Create a main repository with overall architecture docs
2. **API Contracts** - Document and version APIs between services
3. **Deployment Repository** - Central place for docker-compose and K8s manifests
4. **Dependency Management** - Track service dependencies and versions

## Recommended Repository Structure

```
GitHub Organization: Moontean
├── cv-platform-docs (main documentation)
├── cv-platform-deployment (docker-compose, K8s)
├── api-gateway
├── user-auth-service
├── cv-management-service
├── template-export-service
└── notification-service
```

## Next Steps

1. Follow the migration steps above for each service
2. Create a `cv-platform-deployment` repository with docker-compose
3. Create a `cv-platform-docs` repository with centralized documentation
4. Set up CI/CD pipelines for each service
5. Update service URLs in configuration
6. Test the multi-repo setup locally
7. Deploy to production

## Notes

- Keep the original monorepo as reference or archive it
- Update all documentation to reference new repository structure
- Consider using git submodules or a tool like Lerna for development
- Set up proper semantic versioning for each service
