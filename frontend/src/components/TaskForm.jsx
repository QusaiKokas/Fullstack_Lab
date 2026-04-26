import { useState, useEffect } from "react";

function TaskForm({ users, projects, onSubmit, editingTask, onCancel }) {
  const [title, setTitle] = useState("");
  const [details, setDetails] = useState("");
  const [status, setStatus] = useState("todo");
  const [dueDate, setDueDate] = useState("");
  const [priorityScore, setPriorityScore] = useState(5);
  const [estimatedHours, setEstimatedHours] = useState(2);
  const [projectId, setProjectId] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  // when editingTask changes, fill the form
  useEffect(() => {
    if (editingTask) {
      setTitle(editingTask.title || "");
      setDetails(editingTask.details || "");
      setStatus(editingTask.status || "todo");
      // format date for the input field
      setDueDate(
        editingTask.dueDate
          ? editingTask.dueDate.substring(0, 10)
          : ""
      );
      setPriorityScore(editingTask.priorityScore || 5);
      setEstimatedHours(editingTask.estimatedHours || 2);
      // handle populated refs - could be object or string
      setProjectId(
        typeof editingTask.projectId === "object"
          ? editingTask.projectId._id
          : editingTask.projectId || ""
      );
      setAssignedTo(
        typeof editingTask.assignedTo === "object"
          ? editingTask.assignedTo._id
          : editingTask.assignedTo || ""
      );
    } else {
      resetForm();
    }
  }, [editingTask]);

  function resetForm() {
    setTitle("");
    setDetails("");
    setStatus("todo");
    setDueDate("");
    setPriorityScore(5);
    setEstimatedHours(2);
    setProjectId("");
    setAssignedTo("");
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim() || title.trim().length < 3) {
      alert("Title must be at least 3 characters.");
      return;
    }
    if (!dueDate) {
      alert("Please pick a due date.");
      return;
    }
    if (!projectId) {
      alert("Please select a project.");
      return;
    }
    if (!assignedTo) {
      alert("Please select who the task is assigned to.");
      return;
    }

    onSubmit({
      title: title.trim(),
      details: details.trim(),
      status,
      dueDate,
      priorityScore: Number(priorityScore),
      estimatedHours: Number(estimatedHours),
      projectId,
      assignedTo,
    });

    if (!editingTask) {
      resetForm();
    }
  }

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <div className="form-row">
        <label>
          Title
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task title"
            required
          />
        </label>
        <label>
          Status
          <select value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="todo">Todo</option>
            <option value="in_progress">In Progress</option>
            <option value="done">Done</option>
          </select>
        </label>
      </div>

      <div className="form-row">
        <label>
          Due Date
          <input
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            required
          />
        </label>
        <label>
          Priority (1-10)
          <input
            type="number"
            min="1"
            max="10"
            value={priorityScore}
            onChange={(e) => setPriorityScore(e.target.value)}
          />
        </label>
        <label>
          Est. Hours
          <input
            type="number"
            min="1"
            max="40"
            value={estimatedHours}
            onChange={(e) => setEstimatedHours(e.target.value)}
          />
        </label>
      </div>

      <div className="form-row">
        <label>
          Project
          <select value={projectId} onChange={(e) => setProjectId(e.target.value)}>
            <option value="">-- Select project --</option>
            {projects.map((p) => (
              <option key={p._id} value={p._id}>
                {p.title} ({p.courseCode})
              </option>
            ))}
          </select>
        </label>
        <label>
          Assigned To
          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)}>
            <option value="">-- Select user --</option>
            {users.map((u) => (
              <option key={u._id} value={u._id}>
                {u.fullName}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="form-row">
        <label className="full-width">
          Details
          <textarea
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Optional description"
            rows={3}
          />
        </label>
      </div>

      <div className="form-actions">
        <button type="submit" className="btn-primary">
          {editingTask ? "Save Changes" : "Add Task"}
        </button>
        {editingTask && (
          <button type="button" className="btn-secondary" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}

export default TaskForm;
