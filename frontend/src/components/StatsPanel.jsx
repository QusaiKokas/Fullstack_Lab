function StatsPanel({ stats }) {
  if (!stats) return null;

  return (
    <section className="stats-panel">
      <h2>Overview</h2>
      <div className="stats-cards">
        <div className="stat-card">
          <span className="stat-number">{stats.totalTasks}</span>
          <span className="stat-label">Total Tasks</span>
        </div>
        <div className="stat-card card-todo">
          <span className="stat-number">{stats.byStatus.todo}</span>
          <span className="stat-label">Todo</span>
        </div>
        <div className="stat-card card-progress">
          <span className="stat-number">{stats.byStatus.in_progress}</span>
          <span className="stat-label">In Progress</span>
        </div>
        <div className="stat-card card-done">
          <span className="stat-number">{stats.byStatus.done}</span>
          <span className="stat-label">Done</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.avgPriority}</span>
          <span className="stat-label">Avg Priority</span>
        </div>
        <div className="stat-card">
          <span className="stat-number">{stats.totalEstimatedHours}h</span>
          <span className="stat-label">Est. Hours</span>
        </div>
      </div>
    </section>
  );
}

export default StatsPanel;
