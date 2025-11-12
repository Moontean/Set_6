const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const { rateLimiter } = require('./middleware/rateLimiter');
const { authMiddleware } = require('./middleware/auth');
const { connectRedis } = require('./utils/redis');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Apply rate limiting
app.use(rateLimiter);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'api-gateway' });
});

// Service URLs
const SERVICES = {
  AUTH: process.env.AUTH_SERVICE_URL || 'http://user-auth-service:3001',
  CV: process.env.CV_SERVICE_URL || 'http://cv-management-service:3002',
  EXPORT: process.env.EXPORT_SERVICE_URL || 'http://template-export-service:3003',
  NOTIFICATION: process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3004'
};

// Proxy configuration
const proxyOptions = {
  changeOrigin: true,
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(502).json({ error: 'Service unavailable' });
  }
};

// Public routes (no authentication required)
app.use('/api/auth', createProxyMiddleware({
  target: SERVICES.AUTH,
  ...proxyOptions,
  pathRewrite: { '^/api/auth': '/api/auth' }
}));

// Protected routes (authentication required)
app.use('/api/profile', authMiddleware, createProxyMiddleware({
  target: SERVICES.AUTH,
  ...proxyOptions,
  pathRewrite: { '^/api/profile': '/api/profile' }
}));

app.use('/api/cvs', authMiddleware, createProxyMiddleware({
  target: SERVICES.CV,
  ...proxyOptions,
  pathRewrite: { '^/api/cvs': '/api/cvs' }
}));

app.use('/api/templates', createProxyMiddleware({
  target: SERVICES.EXPORT,
  ...proxyOptions,
  pathRewrite: { '^/api/templates': '/api/templates' }
}));

app.use('/api/export', authMiddleware, createProxyMiddleware({
  target: SERVICES.EXPORT,
  ...proxyOptions,
  pathRewrite: { '^/api/export': '/api/export' }
}));

app.use('/api/notify', createProxyMiddleware({
  target: SERVICES.NOTIFICATION,
  ...proxyOptions,
  pathRewrite: { '^/api/notify': '/api/notify' }
}));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
const startServer = async () => {
  try {
    await connectRedis();
    
    app.listen(PORT, () => {
      console.log(`API Gateway running on port ${PORT}`);
      console.log('Service endpoints:');
      Object.entries(SERVICES).forEach(([name, url]) => {
        console.log(`  ${name}: ${url}`);
      });
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
