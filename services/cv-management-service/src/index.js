const express = require('express');
const cors = require('cors');
require('dotenv').config();

const cvRoutes = require('./routes/cvRoutes');
const { connectDatabase, sequelize } = require('./config/database');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'cv-management-service' });
});

// Routes
app.use('/api/cvs', cvRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// Start server
const startServer = async () => {
  try {
    await connectDatabase();
    await sequelize.sync();
    console.log('Database synchronized');
    
    app.listen(PORT, () => {
      console.log(`CV Management Service running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
