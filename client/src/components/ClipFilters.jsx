function ClipFilters({ search, statusFilter, onSearchChange, onStatusChange }) {
  return (
    <div className="filters">
      <input
        value={search}
        onChange={(event) => onSearchChange(event.target.value)}
        placeholder="Search clips..."
      />

      <select
        value={statusFilter}
        onChange={(event) => onStatusChange(event.target.value)}
      >
        <option value="all">All Statuses</option>
        <option value="saved">Saved</option>
        <option value="watch_later">Watch Later</option>
        <option value="watched">Watched</option>
        <option value="archived">Archived</option>
      </select>
    </div>
  );
}

export default ClipFilters;