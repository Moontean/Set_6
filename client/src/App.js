import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskList from './components/TaskList';
import TaskForm from './components/TaskForm';
import EmailForm from './components/EmailForm';
import { w3cwebsocket as W3CWebSocket } from 'websocket';

const client = new W3CWebSocket('ws://localhost:5000');

const App = () => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchTasks();
    client.onopen = () => {
      console.log('WebSocket Client Connected');
    };
    client.onmessage = (message) => {
      const data = JSON.parse(message.data);
      console.log('Received WebSocket message:', data);
      if (data.action) {
        fetchTasks(); // Обновляем список задач при получении события
      }
    };
    client.onerror = (error) => {
      console.error('WebSocket Error:', error);
    };
  }, []);

  const fetchTasks = async () => {
    const response = await axios.get('http://localhost:5000/api/tasks');
    setTasks(response.data);
  };

  return (
    <div>
      <h1>ToDo List</h1>
      <TaskForm fetchTasks={fetchTasks} />
      <TaskList tasks={tasks} fetchTasks={fetchTasks} />
      <EmailForm />
    </div>
  );
};

export default App;