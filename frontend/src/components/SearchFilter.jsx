function SearchFilter({ searchText, onSearchChange, statusFilter, onStatusChange }) {
  return (
    <div className="search-filter">
      <input
        type="text"
        placeholder="Search by title..."
        value={searchText}
        onChange={(e) => onSearchChange(e.target.value)}
        className="search-input"
      />
      <select
        value={statusFilter}
        onChange={(e) => onStatusChange(e.target.value)}
        className="status-select"
      >
        <option value="">All statuses</option>
        <option value="todo">Todo</option>
        <option value="in_progress">In Progress</option>
        <option value="done">Done</option>
      </select>
    </div>
  );
}

export default SearchFilter;
