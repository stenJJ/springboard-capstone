function ClipForm({
  formData,
  editingId,
  onChange,
  onSubmit,
  onCancelEdit
}) {
  return (
    <form onSubmit={onSubmit} className="clip-form">
      <label>
        Video URL
        <input
          name="url"
          value={formData.url}
          onChange={onChange}
          placeholder="https://www.youtube.com/watch?v=..."
          required
        />
      </label>

      <label>
        Title
        <input
          name="title"
          value={formData.title}
          onChange={onChange}
          placeholder="Clip title"
        />
      </label>

      <label>
        Status
        <select name="status" value={formData.status} onChange={onChange}>
          <option value="saved">Saved</option>
          <option value="watch_later">Watch Later</option>
          <option value="watched">Watched</option>
          <option value="archived">Archived</option>
        </select>
      </label>

      <label>
        Tags
        <input
          name="tags"
          value={formData.tags}
          onChange={onChange}
          placeholder="coding, anime, music"
        />
      </label>

      <label>
        Notes
        <textarea
          name="notes"
          value={formData.notes}
          onChange={onChange}
          placeholder="Why did you save this?"
        />
      </label>

      <button type="submit">
        {editingId ? "Save Changes" : "Save Clip"}
      </button>

      {editingId && (
        <button type="button" className="secondary" onClick={onCancelEdit}>
          Cancel Edit
        </button>
      )}
    </form>
  );
}

export default ClipForm;