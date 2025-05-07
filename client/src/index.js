// const express = require('express');
// const cors = require('cors');
// const { Sequelize } = require('sequelize');
// const taskRoutes = require('./routes/taskRoutes');
// const emailRoutes = require('./routes/emailRoutes');

// const app = express();
// app.use(cors());
// app.use(express.json());

// // Настройка подключения к PostgreSQL
// const sequelize = new Sequelize('postgres://user:password@db:5432/todolist');

// async function connectDatabase() {
//   while (true) {
//     try {
//       await sequelize.authenticate();
//       console.log('Database connection has been established successfully.');
//       break;
//     } catch (error) {
//       console.error('Unable to connect to the database:', error.message);
//       console.log('Retrying in 5 seconds...');
//       await new Promise(resolve => setTimeout(resolve, 5000)); // Повтор через 5 секунд
//     }
//   }
// }

// // Синхронизация моделей и запуск сервера
// connectDatabase().then(async () => {
//   const Task = sequelize.define('Task', {
//     title: { type: Sequelize.STRING, allowNull: false },
//     description: { type: Sequelize.TEXT },
//     completed: { type: Sequelize.BOOLEAN, defaultValue: false },
//   });

//   await sequelize.sync();

//   app.use('/api/tasks', taskRoutes);
//   app.use('/api/email', emailRoutes);

//   app.listen(5000, () => console.log('Server running on port 5000'));
// }).catch(error => console.error('Server startup error:', error));
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);