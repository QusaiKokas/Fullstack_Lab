import { useState, useEffect } from "react";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import SearchFilter from "./components/SearchFilter";
import StatsPanel from "./components/StatsPanel";

function App() {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [stats, setStats] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [editingTask, setEditingTask] = useState(null);

  // filter / search state
  const [searchText, setSearchText] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // fetch tasks from backend
  async function fetchTasks() {
    try {
      const res = await fetch("/api/tasks");
      if (!res.ok) throw new Error("Could not load tasks");
      const data = await res.json();
      setTasks(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    }
  }

  // fetch everything on mount + set interval
  useEffect(() => {
    async function loadAll() {
      setLoading(true);
      try {
        const [tasksRes, usersRes, projectsRes, statsRes] = await Promise.all([
          fetch("/api/tasks"),
          fetch("/api/users"),
          fetch("/api/projects"),
          fetch("/api/stats/tasks"),
        ]);

        if (!tasksRes.ok) throw new Error("Failed to fetch tasks");
        if (!usersRes.ok) throw new Error("Failed to fetch users");
        if (!projectsRes.ok) throw new Error("Failed to fetch projects");

        const tasksData = await tasksRes.json();
        const usersData = await usersRes.json();
        const projectsData = await projectsRes.json();
        const statsData = statsRes.ok ? await statsRes.json() : null;

        setTasks(tasksData);
        setUsers(usersData);
        setProjects(projectsData);
        setStats(statsData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    loadAll();

    // auto-refresh every 10 seconds
    const intervalId = setInterval(() => {
      fetchTasks();
      // also refresh stats
      fetch("/api/stats/tasks")
        .then((r) => r.ok ? r.json() : null)
        .then((data) => { if (data) setStats(data); })
        .catch(() => {});
    }, 10000);

    // cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, []);

  // create a new task
  async function handleCreate(taskData) {
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (!res.ok) {
        const errBody = await res.json();
        throw new Error(errBody.error?.message || "Failed to create task");
      }

      await fetchTasks();
      // refresh stats too
      const statsRes = await fetch("/api/stats/tasks");
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // update an existing task
  async function handleUpdate(taskData) {
    try {
      const res = await fetch(`/api/tasks/${editingTask._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });

      if (!res.ok) {
        const errBody = await res.json();
        throw new Error(errBody.error?.message || "Failed to update task");
      }

      setEditingTask(null);
      await fetchTasks();
      const statsRes = await fetch("/api/stats/tasks");
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  // delete a task
  async function handleDelete(taskId) {
    if (!window.confirm("Are you sure you want to delete this task?")) return;

    try {
      const res = await fetch(`/api/tasks/${taskId}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete task");

      await fetchTasks();
      const statsRes = await fetch("/api/stats/tasks");
      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      alert("Error: " + err.message);
    }
  }

  function handleEdit(task) {
    setEditingTask(task);
  }

  function handleCancelEdit() {
    setEditingTask(null);
  }

  // apply search and status filter on the client side
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchText.toLowerCase());
    const matchesStatus = statusFilter === "" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="app">
        <header className="app-header">
          <h1>Student Project Manager</h1>
        </header>
        <main className="app-main">
          <p className="loading-text">Loading data...</p>
        </main>
      </div>
    );
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1>Student Project Manager</h1>
        <p className="subtitle">Track your projects and tasks in one place</p>
      </header>

      <main className="app-main">
        {error && <p className="error-banner">{error}</p>}

        <StatsPanel stats={stats} />

        <section className="form-section">
          <h2>{editingTask ? "Edit Task" : "New Task"}</h2>
          <TaskForm
            users={users}
            projects={projects}
            onSubmit={editingTask ? handleUpdate : handleCreate}
            editingTask={editingTask}
            onCancel={handleCancelEdit}
          />
        </section>

        <section className="list-section">
          <h2>Tasks</h2>
          <SearchFilter
            searchText={searchText}
            onSearchChange={setSearchText}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
          />
          <TaskList
            tasks={filteredTasks}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </section>
      </main>
    </div>
  );
}

export default App;
