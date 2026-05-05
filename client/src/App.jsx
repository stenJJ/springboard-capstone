import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_BASE = "http://localhost:5000/api";

function App() {
  const [clips, setClips] = useState([]);
  const [formData, setFormData] = useState({
    url: "",
    title: "",
    status: "saved",
    tags: "",
    notes: ""
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  async function loadClips() {
    const params = new URLSearchParams();

    if (search) params.append("search", search);
    if (statusFilter !== "all") params.append("status", statusFilter);

    const response = await axios.get(`${API_BASE}/clips?${params.toString()}`);
    setClips(response.data.clips);
  }

  useEffect(() => {
    loadClips();
  }, [search, statusFilter]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((data) => ({
      ...data,
      [name]: value
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      if (editingId) {
        await axios.patch(`${API_BASE}/clips/${editingId}`, formData);
        setMessage("Clip updated.");
        setEditingId(null);
      } else {
        const duplicateCheck = await axios.post(`${API_BASE}/clips/check-duplicate`, {
          url: formData.url
        });

        if (duplicateCheck.data.duplicate) {
          setError("Duplicate warning: this URL is already saved.");
          return;
        }

        await axios.post(`${API_BASE}/clips`, formData);
        setMessage("Clip saved.");
      }

      setFormData({
        url: "",
        title: "",
        status: "saved",
        tags: "",
        notes: ""
      });

      loadClips();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  }

  function startEdit(clip) {
    setEditingId(clip.id);
    setFormData({
      url: clip.url,
      title: clip.title,
      status: clip.status,
      tags: clip.tags,
      notes: clip.notes
    });
    setError("");
    setMessage("");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function deleteClip(id) {
    await axios.delete(`${API_BASE}/clips/${id}`);
    setMessage("Clip deleted.");
    loadClips();
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData({
      url: "",
      title: "",
      status: "saved",
      tags: "",
      notes: ""
    });
  }

  return (
    <div className="app">
      <header className="hero">
        <h1>ClipVault</h1>
        <p>
          Save video links, organize clips, and prevent duplicate URLs from
          cluttering your media library.
        </p>
      </header>

      <main className="layout">
        <section className="panel">
          <h2>{editingId ? "Edit Clip" : "Add Clip"}</h2>

          {error && <div className="error">{error}</div>}
          {message && <div className="message">{message}</div>}

          <form onSubmit={handleSubmit} className="clip-form">
            <label>
              Video URL
              <input
                name="url"
                value={formData.url}
                onChange={handleChange}
                placeholder="https://www.youtube.com/watch?v=..."
                required
              />
            </label>

            <label>
              Title
              <input
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Clip title"
              />
            </label>

            <label>
              Status
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
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
                onChange={handleChange}
                placeholder="coding, anime, music"
              />
            </label>

            <label>
              Notes
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="Why did you save this?"
              />
            </label>

            <button type="submit">
              {editingId ? "Save Changes" : "Save Clip"}
            </button>

            {editingId && (
              <button type="button" className="secondary" onClick={cancelEdit}>
                Cancel Edit
              </button>
            )}
          </form>
        </section>

        <section className="panel">
          <h2>Clip Library</h2>

          <div className="filters">
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search clips..."
            />

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="saved">Saved</option>
              <option value="watch_later">Watch Later</option>
              <option value="watched">Watched</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <p className="count">{clips.length} clip(s) found</p>

          <div className="clip-list">
            {clips.map((clip) => (
              <article key={clip.id} className="clip-card">
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
                  <button onClick={() => startEdit(clip)}>Edit</button>
                  <button className="danger" onClick={() => deleteClip(clip.id)}>
                    Delete
                  </button>
                </div>
              </article>
            ))}

            {clips.length === 0 && (
              <p className="empty">No clips saved yet. Add one to begin.</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;