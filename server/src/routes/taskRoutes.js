const express = require('express');
const router = express.Router();
const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://user:password@db:5432/todolist');
const Task = sequelize.define('Task', {
  title: { type: Sequelize.STRING, allowNull: false },
  description: { type: Sequelize.TEXT },
  completed: { type: Sequelize.BOOLEAN, defaultValue: false },
});

// Событие для WebSocket
router.on = function(event, listener) {
  if (event === 'taskUpdated') {
    this._taskUpdatedListeners = this._taskUpdatedListeners || [];
    this._taskUpdatedListeners.push(listener);
  }
};

router.emit = function(event, data) {
  if (event === 'taskUpdated' && this._taskUpdatedListeners) {
    this._taskUpdatedListeners.forEach(listener => listener(data));
  }
};

// Получить все задачи
router.get('/', async (req, res) => {
  const tasks = await Task.findAll();
  res.json(tasks);
});

// Получить задачу по ID
router.get('/:id', async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (task) res.json(task);
  else res.status(404).json({ error: 'Task not found' });
});

// Создать задачу
router.post('/', async (req, res) => {
  const task = await Task.create(req.body);
  router.emit('taskUpdated', { action: 'created', task });
  res.json(task);
});

// Обновить задачу
router.put('/:id', async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (task) {
    await task.update(req.body);
    router.emit('taskUpdated', { action: 'updated', task });
    res.json(task);
  } else res.status(404).json({ error: 'Task not found' });
});

// Удалить задачу
router.delete('/:id', async (req, res) => {
  const task = await Task.findByPk(req.params.id);
  if (task) {
    await task.destroy();
    router.emit('taskUpdated', { action: 'deleted', id: req.params.id });
    res.json({ message: 'Task deleted' });
  } else res.status(404).json({ error: 'Task not found' });
});

module.exports = router;