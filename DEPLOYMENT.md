# Deployment Guide - CV Platform

Руководство по развертыванию микросервисной платформы для создания CV.

## 🎯 Окружения

- **Development** - Локальная разработка
- **Staging** - Тестовое окружение
- **Production** - Продакшн окружение

---

## 🔧 Development (Локальная разработка)

### Требования

- Docker >= 20.10
- Docker Compose >= 2.0
- Git

### Шаги развертывания

1. **Клонировать репозиторий**
```bash
git clone https://github.com/Moontean/Set_6.git
cd Set_6
```

2. **Запустить все сервисы**
```bash
docker-compose -f docker-compose.microservices.yml up --build
```

3. **Проверить статус сервисов**
```bash
docker-compose -f docker-compose.microservices.yml ps
```

4. **Проверить health checks**
```bash
curl http://localhost:3000/health  # API Gateway
curl http://localhost:3001/health  # User/Auth Service
curl http://localhost:3002/health  # CV Management Service
curl http://localhost:3003/health  # Template/Export Service
curl http://localhost:3004/health  # Notification Service
```

### Остановка сервисов

```bash
# Остановить сервисы
docker-compose -f docker-compose.microservices.yml down

# Остановить и удалить volumes
docker-compose -f docker-compose.microservices.yml down -v
```

---

## 🌐 Production Deployment

### Вариант 1: Docker Compose на VPS

#### Требования

- VPS с Ubuntu 20.04+ или другой Linux дистрибутив
- Docker и Docker Compose установлены
- Домен с настроенным DNS
- SSL сертификат (Let's Encrypt)

#### Шаги

1. **Подключиться к серверу**
```bash
ssh user@your-server-ip
```

2. **Установить Docker**
```bash
# Обновить пакеты
sudo apt update && sudo apt upgrade -y

# Установить Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Установить Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
```

3. **Клонировать репозиторий**
```bash
cd /opt
sudo git clone https://github.com/Moontean/Set_6.git
cd Set_6
```

4. **Настроить environment variables**
```bash
# Создать production .env файл
sudo nano .env.production
```

Содержимое `.env.production`:
```env
# Database
POSTGRES_USER=cv_user
POSTGRES_PASSWORD=strong_password_here
POSTGRES_DB=cv_platform

# JWT Secret (сгенерировать: openssl rand -base64 64)
JWT_SECRET=your_very_long_secret_key_here

# Redis
REDIS_URL=redis://redis:6379

# SMTP (для email уведомлений)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
EMAIL_FROM=noreply@yourdomain.com

# Service URLs (для production с nginx)
AUTH_SERVICE_URL=http://user-auth-service:3001
CV_SERVICE_URL=http://cv-management-service:3002
EXPORT_SERVICE_URL=http://template-export-service:3003
NOTIFICATION_SERVICE_URL=http://notification-service:3004
```

5. **Создать production docker-compose файл**
```bash
sudo nano docker-compose.prod.yml
```

Содержимое с настройками для production:
```yaml
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    container_name: cv-platform-postgres
    env_file: .env.production
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - cv-platform-network
    restart: always
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER} -d ${POSTGRES_DB}"]
      interval: 10s
      timeout: 5s
      retries: 5

  redis:
    image: redis:7-alpine
    container_name: cv-platform-redis
    networks:
      - cv-platform-network
    restart: always
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data

  user-auth-service:
    build:
      context: ./services/user-auth-service
      dockerfile: Dockerfile
    container_name: user-auth-service
    env_file: .env.production
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - cv-platform-network
    restart: always

  cv-management-service:
    build:
      context: ./services/cv-management-service
      dockerfile: Dockerfile
    container_name: cv-management-service
    env_file: .env.production
    depends_on:
      postgres:
        condition: service_healthy
    networks:
      - cv-platform-network
    restart: always

  template-export-service:
    build:
      context: ./services/template-export-service
      dockerfile: Dockerfile
    container_name: template-export-service
    env_file: .env.production
    networks:
      - cv-platform-network
    restart: always

  notification-service:
    build:
      context: ./services/notification-service
      dockerfile: Dockerfile
    container_name: notification-service
    env_file: .env.production
    networks:
      - cv-platform-network
    restart: always

  api-gateway:
    build:
      context: ./services/api-gateway
      dockerfile: Dockerfile
    container_name: api-gateway
    env_file: .env.production
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
    restart: always

  nginx:
    image: nginx:alpine
    container_name: cv-platform-nginx
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx/nginx.conf:/etc/nginx/nginx.conf:ro
      - ./nginx/ssl:/etc/nginx/ssl:ro
      - /etc/letsencrypt:/etc/letsencrypt:ro
    depends_on:
      - api-gateway
    networks:
      - cv-platform-network
    restart: always

networks:
  cv-platform-network:
    driver: bridge

volumes:
  postgres_data:
  redis_data:
```

6. **Настроить Nginx**
```bash
sudo mkdir -p nginx
sudo nano nginx/nginx.conf
```

Содержимое `nginx/nginx.conf`:
```nginx
events {
    worker_connections 1024;
}

http {
    upstream api_gateway {
        server api-gateway:3000;
    }

    # Redirect HTTP to HTTPS
    server {
        listen 80;
        server_name yourdomain.com www.yourdomain.com;
        
        location /.well-known/acme-challenge/ {
            root /var/www/certbot;
        }
        
        location / {
            return 301 https://$server_name$request_uri;
        }
    }

    # HTTPS Server
    server {
        listen 443 ssl http2;
        server_name yourdomain.com www.yourdomain.com;

        ssl_certificate /etc/letsencrypt/live/yourdomain.com/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/yourdomain.com/privkey.pem;

        ssl_protocols TLSv1.2 TLSv1.3;
        ssl_ciphers HIGH:!aNULL:!MD5;
        ssl_prefer_server_ciphers on;

        client_max_body_size 10M;

        location / {
            proxy_pass http://api_gateway;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_cache_bypass $http_upgrade;
        }
    }
}
```

7. **Получить SSL сертификат (Let's Encrypt)**
```bash
# Установить certbot
sudo apt install certbot -y

# Получить сертификат
sudo certbot certonly --standalone -d yourdomain.com -d www.yourdomain.com
```

8. **Запустить production окружение**
```bash
sudo docker-compose -f docker-compose.prod.yml up -d --build
```

9. **Проверить логи**
```bash
sudo docker-compose -f docker-compose.prod.yml logs -f
```

10. **Настроить автоматическое обновление SSL**
```bash
# Добавить cron job для обновления сертификата
sudo crontab -e

# Добавить строку:
0 0 * * 0 certbot renew --quiet && docker-compose -f /opt/Set_6/docker-compose.prod.yml restart nginx
```

---

### Вариант 2: Kubernetes Deployment

#### Требования

- Kubernetes кластер (v1.24+)
- kubectl установлен и настроен
- Helm 3+

#### Создание Kubernetes манифестов

1. **Создать namespace**
```yaml
# k8s/namespace.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: cv-platform
```

2. **PostgreSQL StatefulSet**
```yaml
# k8s/postgres.yaml
apiVersion: v1
kind: Service
metadata:
  name: postgres
  namespace: cv-platform
spec:
  ports:
  - port: 5432
  selector:
    app: postgres
---
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: postgres
  namespace: cv-platform
spec:
  serviceName: postgres
  replicas: 1
  selector:
    matchLabels:
      app: postgres
  template:
    metadata:
      labels:
        app: postgres
    spec:
      containers:
      - name: postgres
        image: postgres:15-alpine
        env:
        - name: POSTGRES_USER
          valueFrom:
            secretKeyRef:
              name: cv-platform-secrets
              key: postgres-user
        - name: POSTGRES_PASSWORD
          valueFrom:
            secretKeyRef:
              name: cv-platform-secrets
              key: postgres-password
        - name: POSTGRES_DB
          value: cv_platform
        ports:
        - containerPort: 5432
        volumeMounts:
        - name: postgres-storage
          mountPath: /var/lib/postgresql/data
  volumeClaimTemplates:
  - metadata:
      name: postgres-storage
    spec:
      accessModes: [ "ReadWriteOnce" ]
      resources:
        requests:
          storage: 10Gi
```

3. **Применить манифесты**
```bash
kubectl apply -f k8s/
```

4. **Проверить развертывание**
```bash
kubectl get pods -n cv-platform
kubectl get services -n cv-platform
```

---

## 🔐 Безопасность

### Чек-лист безопасности для Production

- [ ] Изменить все default пароли
- [ ] Использовать сильный JWT_SECRET (минимум 64 символа)
- [ ] Настроить SSL/TLS сертификаты
- [ ] Включить firewall и открыть только необходимые порты (80, 443)
- [ ] Настроить регулярные backup базы данных
- [ ] Включить логирование и мониторинг
- [ ] Настроить rate limiting на nginx уровне
- [ ] Использовать environment variables для всех secrets
- [ ] Регулярно обновлять Docker образы
- [ ] Настроить автоматическое обновление SSL сертификатов

### Генерация безопасного JWT Secret

```bash
openssl rand -base64 64
```

---

## 📊 Мониторинг и Логирование

### Prometheus и Grafana (опционально)

```yaml
# docker-compose.monitoring.yml
version: '3.8'

services:
  prometheus:
    image: prom/prometheus
    ports:
      - "9090:9090"
    volumes:
      - ./monitoring/prometheus.yml:/etc/prometheus/prometheus.yml
    networks:
      - cv-platform-network

  grafana:
    image: grafana/grafana
    ports:
      - "3001:3000"
    environment:
      - GF_SECURITY_ADMIN_PASSWORD=admin
    volumes:
      - grafana_data:/var/lib/grafana
    networks:
      - cv-platform-network

volumes:
  grafana_data:

networks:
  cv-platform-network:
    external: true
```

---

## 🔄 Резервное копирование

### Автоматический backup PostgreSQL

```bash
#!/bin/bash
# backup.sh

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/opt/backups/cv-platform"
mkdir -p $BACKUP_DIR

# Backup database
docker exec cv-platform-postgres pg_dump -U user cv_platform | gzip > $BACKUP_DIR/db_backup_$DATE.sql.gz

# Keep only last 7 days
find $BACKUP_DIR -name "db_backup_*.sql.gz" -mtime +7 -delete

echo "Backup completed: $BACKUP_DIR/db_backup_$DATE.sql.gz"
```

Добавить в crontab:
```bash
0 2 * * * /opt/Set_6/backup.sh >> /var/log/cv-platform-backup.log 2>&1
```

### Восстановление из backup

```bash
# Распаковать backup
gunzip db_backup_20240115_020000.sql.gz

# Восстановить базу
docker exec -i cv-platform-postgres psql -U user cv_platform < db_backup_20240115_020000.sql
```

---

## 🚀 CI/CD Pipeline

### GitHub Actions пример

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Deploy to server
        uses: appleboy/ssh-action@master
        with:
          host: ${{ secrets.SERVER_HOST }}
          username: ${{ secrets.SERVER_USER }}
          key: ${{ secrets.SSH_PRIVATE_KEY }}
          script: |
            cd /opt/Set_6
            git pull origin main
            docker-compose -f docker-compose.prod.yml down
            docker-compose -f docker-compose.prod.yml up -d --build
```

---

## 📝 Обслуживание

### Обновление сервисов

```bash
# Перейти в директорию проекта
cd /opt/Set_6

# Получить последние изменения
sudo git pull origin main

# Пересобрать и перезапустить сервисы
sudo docker-compose -f docker-compose.prod.yml up -d --build

# Проверить статус
sudo docker-compose -f docker-compose.prod.yml ps
```

### Просмотр логов

```bash
# Все сервисы
sudo docker-compose -f docker-compose.prod.yml logs -f

# Конкретный сервис
sudo docker-compose -f docker-compose.prod.yml logs -f api-gateway
```

### Очистка неиспользуемых Docker ресурсов

```bash
# Удалить неиспользуемые образы
docker image prune -a

# Удалить неиспользуемые volumes
docker volume prune

# Удалить все неиспользуемые ресурсы
docker system prune -a --volumes
```

---

## 🆘 Troubleshooting

### Сервис не запускается

1. Проверить логи:
```bash
docker-compose -f docker-compose.prod.yml logs service-name
```

2. Проверить порты:
```bash
sudo netstat -tulpn | grep :3000
```

3. Проверить disk space:
```bash
df -h
```

### База данных недоступна

1. Проверить статус PostgreSQL:
```bash
docker-compose -f docker-compose.prod.yml ps postgres
```

2. Проверить логи:
```bash
docker-compose -f docker-compose.prod.yml logs postgres
```

3. Перезапустить PostgreSQL:
```bash
docker-compose -f docker-compose.prod.yml restart postgres
```

### SSL сертификат не работает

1. Проверить сертификаты:
```bash
sudo certbot certificates
```

2. Обновить сертификат:
```bash
sudo certbot renew
```

---

## 📞 Поддержка

Для вопросов и проблем создайте issue в GitHub репозитории или свяжитесь с командой разработки.
