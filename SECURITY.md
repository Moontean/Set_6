# Security Documentation - CV Platform

## Security Architecture

This document outlines the security measures and architectural decisions for the CV Platform.

## 🛡️ Security by Design

### Defense in Depth

The platform implements multiple layers of security:

1. **API Gateway Level** - First line of defense
2. **Service Level** - Individual service authentication
3. **Database Level** - Access control and encryption
4. **Network Level** - Docker network isolation

---

## 🚦 Rate Limiting

### Architectural Decision: Gateway-Level Rate Limiting

**Decision:** Rate limiting is implemented at the API Gateway level, not at individual microservices.

**Rationale:**
- ✅ **Single point of control** - Easier to manage and configure
- ✅ **Reduced complexity** - Services focus on business logic
- ✅ **Better performance** - One rate limiter instead of five
- ✅ **Consistent behavior** - All services protected uniformly
- ✅ **Redis caching** - Shared state across gateway instances

**Implementation:**
```javascript
// API Gateway (services/api-gateway/src/middleware/rateLimiter.js)
const rateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window per IP
  message: 'Too many requests from this IP'
});
```

**Note:** Individual microservices do NOT implement their own rate limiting because:
- They are only accessible through the API Gateway (network isolation)
- Gateway handles all rate limiting before forwarding requests
- Internal service-to-service communication doesn't need rate limiting

### CodeQL Alert Acknowledgment

CodeQL flags individual service routes as missing rate limiting. This is **intentional and by design**:
- Rate limiting is centralized at the API Gateway
- Microservices are in a private Docker network, not publicly exposed
- This follows the **API Gateway pattern** where cross-cutting concerns are handled at the gateway

---

## 🔐 Authentication & Authorization

### JWT Token Security

**Configuration:**
- Algorithm: HS256
- Expiration: 24 hours
- Secret: Configurable via `JWT_SECRET` environment variable

**Best Practices:**
```bash
# Generate a strong secret (minimum 64 characters)
openssl rand -base64 64
```

**Token Structure:**
```json
{
  "userId": "uuid",
  "email": "user@example.com",
  "iat": 1234567890,
  "exp": 1234654290
}
```

### Password Security

**Hashing:**
- Algorithm: bcrypt
- Salt rounds: 10
- Automatic salting

**Implementation:**
```javascript
// services/user-auth-service/src/models/User.js
const salt = await bcrypt.genSalt(10);
user.password = await bcrypt.hash(user.password, salt);
```

**Password Validation:**
```javascript
user.validatePassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};
```

---

## 🔒 Network Security

### Docker Network Isolation

```yaml
# docker-compose.microservices.yml
networks:
  cv-platform-network:
    driver: bridge
```

**Network Topology:**
```
Internet
    ↓
[API Gateway] :3000 (exposed)
    ↓
[Internal Network]
    ├── User/Auth Service :3001 (internal)
    ├── CV Management Service :3002 (internal)
    ├── Template/Export Service :3003 (internal)
    ├── Notification Service :3004 (internal)
    ├── PostgreSQL :5432 (internal)
    └── Redis :6379 (internal)
```

**Security Benefits:**
- Only API Gateway is exposed to public internet
- Microservices only accessible within Docker network
- Database and Redis not exposed externally
- Service-to-service communication over private network

### Port Exposure

**Development (docker-compose.microservices.yml):**
- All services exposed for testing: 3000-3004, 5432, 6379

**Production (should be configured):**
- Only port 80/443 exposed through Nginx
- All other ports internal to Docker network
- Use firewall rules to restrict access

---

## 🛡️ Input Validation

### API Level Validation

**Express Services (Node.js):**
```javascript
// Example: CV Management Service
if (!title) {
  return res.status(400).json({ error: 'Title is required' });
}
```

**FastAPI Service (Python):**
```python
# Template/Export Service uses Pydantic models
class CVData(BaseModel):
    fullName: str
    email: Optional[str] = None
    # ... automatic validation
```

### SQL Injection Protection

**ORM Protection:**
- All database queries use Sequelize ORM
- Parameterized queries prevent SQL injection
- No raw SQL queries in codebase

**Example:**
```javascript
// Safe - uses ORM
const cv = await CV.findOne({ where: { id: cvId, userId: userId } });

// Unsafe - don't do this
// const cv = await sequelize.query(`SELECT * FROM cvs WHERE id = '${cvId}'`);
```

---

## 🚨 Error Handling

### Secure Error Messages

**Development:**
- Detailed error messages for debugging
- Stack traces included

**Production:**
- Generic error messages to users
- Detailed logs stored securely
- No sensitive information in responses

**Implementation:**
```javascript
// Example error handler
app.use((err, req, res, next) => {
  console.error(err.stack); // Log full error
  res.status(500).json({ 
    error: 'Internal server error' // Generic message
    // Don't include: err.message, err.stack
  });
});
```

---

## 🔍 Security Headers

### CORS Configuration

**Development:**
```javascript
app.use(cors()); // Allow all origins for development
```

**Production:**
```javascript
app.use(cors({
  origin: ['https://yourdomain.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
```

### Recommended Headers (via Nginx)

```nginx
# Add security headers
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header X-XSS-Protection "1; mode=block" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Content-Security-Policy "default-src 'self'" always;
```

---

## 🔐 Environment Variables

### Secrets Management

**Development:**
- `.env` files (not committed to git)
- `.env.example` templates provided

**Production:**
- Docker Secrets
- Kubernetes Secrets
- HashiCorp Vault
- AWS Secrets Manager
- Azure Key Vault

**Example:**
```bash
# .env (NEVER commit this file)
JWT_SECRET=very-long-random-secret-here
POSTGRES_PASSWORD=strong-password-here
```

---

## 📝 Security Checklist

### Before Production Deployment

- [ ] Change all default passwords
- [ ] Generate strong JWT_SECRET (64+ characters)
- [ ] Configure SSL/TLS certificates
- [ ] Restrict port exposure (only 80/443)
- [ ] Enable firewall rules
- [ ] Configure CORS for specific domains
- [ ] Set up security headers in Nginx
- [ ] Implement log monitoring
- [ ] Set up backup strategy
- [ ] Use secrets management system
- [ ] Enable database encryption at rest
- [ ] Regular security updates for dependencies
- [ ] Implement intrusion detection
- [ ] Set up alerts for suspicious activity

---

## 🔄 Regular Security Tasks

### Weekly
- [ ] Review access logs for anomalies
- [ ] Check rate limiting effectiveness
- [ ] Monitor failed authentication attempts

### Monthly
- [ ] Update dependencies (`npm audit`, `pip check`)
- [ ] Review and rotate secrets
- [ ] Test backup restoration
- [ ] Review user access permissions

### Quarterly
- [ ] Security audit of codebase
- [ ] Penetration testing
- [ ] Review and update security policies
- [ ] Dependencies upgrade

---

## 🚨 Incident Response

### In Case of Security Breach

1. **Immediate Actions:**
   - Disable affected service
   - Revoke all JWT tokens (change JWT_SECRET)
   - Lock affected user accounts
   - Preserve logs for analysis

2. **Investigation:**
   - Review access logs
   - Identify breach vector
   - Assess data exposure
   - Document timeline

3. **Remediation:**
   - Patch vulnerability
   - Force password resets
   - Notify affected users
   - Update security measures

4. **Post-Mortem:**
   - Document incident
   - Update security procedures
   - Improve monitoring
   - Train team

---

## 📚 Security Resources

### Documentation
- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Docker Security Best Practices](https://docs.docker.com/engine/security/)
- [Node.js Security Best Practices](https://nodejs.org/en/docs/guides/security/)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)

### Tools
- CodeQL (automated security scanning) ✅ Implemented
- npm audit (Node.js dependencies)
- pip-audit (Python dependencies)
- Docker Bench Security
- OWASP ZAP (penetration testing)

---

## 📞 Security Contact

For security vulnerabilities, please:
1. Do NOT create a public GitHub issue
2. Email security@yourdomain.com
3. Include detailed description and steps to reproduce
4. Allow 48 hours for initial response

---

## ✅ Current Security Status

### Implemented
- ✅ JWT authentication
- ✅ bcrypt password hashing
- ✅ Gateway-level rate limiting
- ✅ Docker network isolation
- ✅ SQL injection protection via ORM
- ✅ Input validation
- ✅ CORS configuration
- ✅ Environment-based secrets
- ✅ Health check endpoints
- ✅ Error handling middleware

### Recommended for Production
- 📝 SSL/TLS certificates
- 📝 Security headers via Nginx
- 📝 Secrets management system
- 📝 Database encryption at rest
- 📝 Log aggregation and monitoring
- 📝 Intrusion detection system
- 📝 Regular security audits
- 📝 Automated dependency updates

---

## 📄 License

This security documentation is part of the CV Platform project.
