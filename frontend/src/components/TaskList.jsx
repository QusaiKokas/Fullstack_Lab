import { useState } from "react";
import TaskRow from "./TaskRow";

function TaskList({ tasks, onEdit, onDelete }) {
  const [sortField, setSortField] = useState("dueDate");
  const [sortAsc, setSortAsc] = useState(true);

  function handleSort(field) {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(true);
    }
  }

  function getSortIndicator(field) {
    if (sortField !== field) return "";
    return sortAsc ? " ▲" : " ▼";
  }

  // sort tasks before rendering
  const sorted = [...tasks].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    // handle nested populated fields
    if (sortField === "projectTitle") {
      valA = a.projectId?.title || "";
      valB = b.projectId?.title || "";
    }
    if (sortField === "assigneeName") {
      valA = a.assignedTo?.fullName || "";
      valB = b.assignedTo?.fullName || "";
    }

    if (typeof valA === "string") valA = valA.toLowerCase();
    if (typeof valB === "string") valB = valB.toLowerCase();

    if (valA < valB) return sortAsc ? -1 : 1;
    if (valA > valB) return sortAsc ? 1 : -1;
    return 0;
  });

  if (tasks.length === 0) {
    return <p className="empty-msg">No tasks found.</p>;
  }

  return (
    <div className="table-wrapper">
      <table className="task-table">
        <thead>
          <tr>
            <th onClick={() => handleSort("title")}>
              Title{getSortIndicator("title")}
            </th>
            <th onClick={() => handleSort("status")}>
              Status{getSortIndicator("status")}
            </th>
            <th onClick={() => handleSort("priorityScore")}>
              Priority{getSortIndicator("priorityScore")}
            </th>
            <th onClick={() => handleSort("dueDate")}>
              Due Date{getSortIndicator("dueDate")}
            </th>
            <th onClick={() => handleSort("projectTitle")}>
              Project{getSortIndicator("projectTitle")}
            </th>
            <th onClick={() => handleSort("assigneeName")}>
              Assigned To{getSortIndicator("assigneeName")}
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((task) => (
            <TaskRow
              key={task._id}
              task={task}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TaskList;
