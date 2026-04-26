function TaskRow({ task, onEdit, onDelete }) {
  // format the due date nicely
  const formattedDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString("sv-SE")
    : "—";

  // pick a css class for the status badge
  const statusClass = "status-badge status-" + task.status;

  return (
    <tr>
      <td>{task.title}</td>
      <td>
        <span className={statusClass}>
          {task.status.replace("_", " ")}
        </span>
      </td>
      <td>{task.priorityScore}</td>
      <td>{formattedDate}</td>
      <td>{task.projectId?.title || "—"}</td>
      <td>{task.assignedTo?.fullName || "—"}</td>
      <td className="actions-cell">
        <button className="btn-edit" onClick={() => onEdit(task)}>
          Edit
        </button>
        <button className="btn-delete" onClick={() => onDelete(task._id)}>
          Delete
        </button>
      </td>
    </tr>
  );
}

export default TaskRow;
