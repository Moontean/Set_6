const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const taskRoutes = require('./routes/taskRoutes');
const emailRoutes = require('./routes/emailRoutes');
const WebSocket = require('ws');

const app = express();
app.use(cors());
app.use(express.json());

// Настройка подключения к PostgreSQL
const sequelize = new Sequelize('postgres://user:password@db:5432/todolist');

async function connectDatabase() {
  while (true) {
    try {
      await sequelize.authenticate();
      console.log('Database connection has been established successfully.');
      break;
    } catch (error) {
      console.error('Unable to connect to the database:', error.message);
      console.log('Retrying in 5 seconds...');
      await new Promise(resolve => setTimeout(resolve, 5000));
    }
  }
}

// Настройка WebSocket сервера
const server = require('http').createServer(app);
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  console.log('New client connected');
  ws.on('message', (message) => {
    console.log('Received:', message);
  });
  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

// Синхронизация задач через WebSocket
const broadcast = (data) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify(data));
    }
  });
};

// Обновление базы данных и уведомление клиентов
const Task = sequelize.define('Task', {
  title: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT },
  completed: { type: Sequelize.BOOLEAN, defaultValue: false },
});

sequelize.sync().then(() => {
  app.use('/api/tasks', taskRoutes);
  app.use('/api/email', emailRoutes);

  // Обновление через WebSocket при изменении задач
  taskRoutes.on('taskUpdated', (data) => broadcast(data));

  server.listen(5000, () => console.log('Server running on port 5000'));
});

connectDatabase().catch(error => console.error('Server startup error:', error));