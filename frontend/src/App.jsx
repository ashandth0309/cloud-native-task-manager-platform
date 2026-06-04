import React, { useEffect, useMemo, useState } from "react";
import { createTask, deleteTask, getTasks, updateTask } from "./api.js";

const emptyForm = {
  title: "",
  description: "",
  priority: "medium",
};

const statusFlow = {
  todo: "in-progress",
  "in-progress": "done",
  done: "todo",
};

const statusLabels = {
  todo: "To Do",
  "in-progress": "In Progress",
  done: "Completed",
};

const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

function App() {
  const [tasks, setTasks] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");

  async function loadTasks() {
    try {
      setLoading(true);
      const data = await getTasks();
      setTasks(data);
      setError("");
    } catch (err) {
      setError("API connection failed. Start the backend on port 5000 and check MongoDB.");
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
    const nextStatus = statusFlow[task.status] || "todo";
    await updateTask(task._id, { status: nextStatus });
    await loadTasks();
  }

  async function handleDelete(id) {
    await deleteTask(id);
    await loadTasks();
  }

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter((task) => task.status === "todo").length,
      progress: tasks.filter((task) => task.status === "in-progress").length,
      done: tasks.filter((task) => task.status === "done").length,
      high: tasks.filter((task) => task.priority === "high").length,
    };
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    if (filter === "all") return tasks;
    return tasks.filter((task) => task.status === filter);
  }, [tasks, filter]);

  const columns = [
    { key: "todo", title: "To Do", subtitle: "Planned work" },
    { key: "in-progress", title: "In Progress", subtitle: "Currently active" },
    { key: "done", title: "Completed", subtitle: "Delivered work" },
  ];

  return (
    <main className="app">
      <section className="hero">
        <div className="hero-left">
          <div className="badge-row">
            <span className="badge">Cloud Native</span>
            <span className="badge muted">Docker</span>
            <span className="badge muted">CI/CD</span>
          </div>

          <h1>TaskOps Platform</h1>

          <p>
            A polished full-stack task management dashboard built with React,
            Node.js, Express, MongoDB, Docker, GitHub Actions, health checks,
            and cloud deployment readiness.
          </p>

          <div className="hero-actions">
            <a href="#new-task" className="primary-action">
              Create Work Item
            </a>
            <button type="button" className="secondary-action" onClick={loadTasks}>
              Refresh API
            </button>
          </div>
        </div>

        <div className="platform-card">
          <div className="platform-top">
            <span className={error ? "status-dot offline" : "status-dot"}></span>
            <span>{error ? "API Offline" : "API Online"}</span>
          </div>
          <h2>Platform Health</h2>
          <p>
            {error
              ? "Backend or database connection needs attention."
              : "Frontend is connected to the backend service."}
          </p>

          <div className="mini-grid">
            <div>
              <strong>React</strong>
              <span>Frontend</span>
            </div>
            <div>
              <strong>Express</strong>
              <span>REST API</span>
            </div>
            <div>
              <strong>MongoDB</strong>
              <span>Database</span>
            </div>
            <div>
              <strong>Docker</strong>
              <span>Runtime</span>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        <article>
          <span>Total Tasks</span>
          <strong>{stats.total}</strong>
        </article>
        <article>
          <span>To Do</span>
          <strong>{stats.todo}</strong>
        </article>
        <article>
          <span>In Progress</span>
          <strong>{stats.progress}</strong>
        </article>
        <article>
          <span>Completed</span>
          <strong>{stats.done}</strong>
        </article>
        <article>
          <span>High Priority</span>
          <strong>{stats.high}</strong>
        </article>
      </section>

      <section className="workspace">
        <aside className="create-panel" id="new-task">
          <div className="section-heading">
            <span>New Work Item</span>
            <h2>Create Task</h2>
            <p>Add tasks to test the full React → Express → MongoDB workflow.</p>
          </div>

          <form onSubmit={handleSubmit} className="task-form">
            <label>
              Task title
              <input
                placeholder="Deploy backend to Render"
                value={form.title}
                onChange={(event) =>
                  setForm({ ...form, title: event.target.value })
                }
                required
              />
            </label>

            <label>
              Description
              <textarea
                placeholder="Add deployment notes, API details, or platform work..."
                value={form.description}
                onChange={(event) =>
                  setForm({ ...form, description: event.target.value })
                }
              />
            </label>

            <label>
              Priority
              <select
                value={form.priority}
                onChange={(event) =>
                  setForm({ ...form, priority: event.target.value })
                }
              >
                <option value="low">Low Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="high">High Priority</option>
              </select>
            </label>

            <button type="submit" className="submit-button">
              Add Task
            </button>
          </form>

          <div className="tips-card">
            <h3>Platform Features</h3>
            <ul>
              <li>Environment-based configuration</li>
              <li>Container-ready architecture</li>
              <li>REST API health checks</li>
              <li>GitHub Actions pipeline</li>
            </ul>
          </div>
        </aside>

        <section className="board-panel">
          <div className="board-header">
            <div>
              <span>Live Task Pipeline</span>
              <h2>Operations Board</h2>
            </div>

            <div className="filters">
              <button
                type="button"
                className={filter === "all" ? "active" : ""}
                onClick={() => setFilter("all")}
              >
                All
              </button>
              <button
                type="button"
                className={filter === "todo" ? "active" : ""}
                onClick={() => setFilter("todo")}
              >
                To Do
              </button>
              <button
                type="button"
                className={filter === "in-progress" ? "active" : ""}
                onClick={() => setFilter("in-progress")}
              >
                Progress
              </button>
              <button
                type="button"
                className={filter === "done" ? "active" : ""}
                onClick={() => setFilter("done")}
              >
                Done
              </button>
            </div>
          </div>

          {error && <div className="error-banner">{error}</div>}

          {loading ? (
            <div className="loading-card">
              <div className="spinner"></div>
              <p>Loading tasks from API...</p>
            </div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <h3>No tasks yet</h3>
              <p>Create your first work item and verify the full-stack flow.</p>
            </div>
          ) : filter === "all" ? (
            <div className="kanban">
              {columns.map((column) => {
                const columnTasks = tasks.filter(
                  (task) => task.status === column.key
                );

                return (
                  <div className="kanban-column" key={column.key}>
                    <div className="column-header">
                      <div>
                        <h3>{column.title}</h3>
                        <p>{column.subtitle}</p>
                      </div>
                      <span>{columnTasks.length}</span>
                    </div>

                    <div className="column-list">
                      {columnTasks.length === 0 ? (
                        <div className="column-empty">No tasks here</div>
                      ) : (
                        columnTasks.map((task) => (
                          <TaskCard
                            key={task._id}
                            task={task}
                            onMove={handleStatusChange}
                            onDelete={handleDelete}
                          />
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="task-list">
              {filteredTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onMove={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </section>
      </section>
    </main>
  );
}

function TaskCard({ task, onMove, onDelete }) {
  return (
    <article className={`task-card priority-${task.priority}`}>
      <div className="task-card-top">
        <span className={`priority priority-${task.priority}`}>
          {priorityLabels[task.priority] || task.priority}
        </span>
        <span className={`status status-${task.status}`}>
          {statusLabels[task.status] || task.status}
        </span>
      </div>

      <h3>{task.title}</h3>
      <p>{task.description || "No description added yet."}</p>

      <div className="card-actions">
        <button type="button" onClick={() => onMove(task)}>
          Move Status
        </button>
        <button type="button" className="danger" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default App;