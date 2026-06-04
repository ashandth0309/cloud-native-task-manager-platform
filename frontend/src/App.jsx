import React, { useEffect, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from './api.js';

const emptyForm = {
  title: '',
  description: '',
  priority: 'medium'
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  async function loadTasks() {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
      setError('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTasks();
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    try {
      await createTask(form);
      setForm(emptyForm);
      await loadTasks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function handleStatusChange(task) {
    const nextStatus = task.status === 'todo' ? 'in-progress' : task.status === 'in-progress' ? 'done' : 'todo';
    await updateTask(task._id, { status: nextStatus });
    await loadTasks();
  }

  async function handleDelete(id) {
    await deleteTask(id);
    await loadTasks();
  }

  return (
    <main className="container">
      <section className="hero">
        <p className="eyebrow">Cloud-Native Platform Project</p>
        <h1>Task Manager</h1>
        <p>React + Node.js + MongoDB + Docker + GitHub Actions</p>
      </section>

      <form className="task-form" onSubmit={handleSubmit}>
        <input
          placeholder="Task title"
          value={form.title}
          onChange={(event) => setForm({ ...form, title: event.target.value })}
          required
        />
        <input
          placeholder="Description"
          value={form.description}
          onChange={(event) => setForm({ ...form, description: event.target.value })}
        />
        <select
          value={form.priority}
          onChange={(event) => setForm({ ...form, priority: event.target.value })}
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit">Add Task</button>
      </form>

      {error && <p className="error">{error}</p>}
      {loading ? (
        <p>Loading tasks...</p>
      ) : (
        <section className="task-grid">
          {tasks.map((task) => (
            <article className="task-card" key={task._id}>
              <div>
                <h3>{task.title}</h3>
                <p>{task.description || 'No description'}</p>
              </div>
              <div className="meta">
                <span>{task.priority}</span>
                <button onClick={() => handleStatusChange(task)}>{task.status}</button>
                <button className="danger" onClick={() => handleDelete(task._id)}>Delete</button>
              </div>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}

export default App;
