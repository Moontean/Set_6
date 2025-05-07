import React from 'react';
import axios from 'axios';

const TaskList = ({ tasks, fetchTasks }) => {
  const deleteTask = async (id) => {
    await axios.delete(`http://localhost:5000/api/tasks/${id}`);
    fetchTasks();
  };

  const toggleComplete = async (task) => {
    await axios.put(`http://localhost:5000/api/tasks/${task.id}`, {
      ...task,
      completed: !task.completed,
    });
    fetchTasks();
  };

  return (
    <table>
      <thead>
        <tr>
          <th>Title</th>
          <th>Description</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => (
          <tr key={task.id}>
            <td>{task.title}</td>
            <td>{task.description}</td>
            <td>{task.completed ? 'Completed' : 'Pending'}</td>
            <td>
              <button onClick={() => toggleComplete(task)}>Toggle</button>
              <button onClick={() => deleteTask(task.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TaskList;