function ClipCard({ clip, onEdit, onDelete }) {
  return (
    <article className="clip-card">
      <h3>{clip.title}</h3>

      <a href={clip.url} target="_blank" rel="noreferrer">
        Open URL
      </a>

      <p>
        <strong>Status:</strong> {clip.status}
      </p>

      <p>
        <strong>Tags:</strong> {clip.tags || "None"}
      </p>

      <p>
        <strong>Notes:</strong> {clip.notes || "None"}
      </p>

      <p className="small">
        <strong>Normalized URL:</strong> {clip.normalizedUrl}
      </p>

      <div className="card-actions">
        <button onClick={() => onEdit(clip)}>Edit</button>
        <button className="danger" onClick={() => onDelete(clip.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default ClipCard;