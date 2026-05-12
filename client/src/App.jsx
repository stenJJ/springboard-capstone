import { useEffect, useState } from "react";
import "./App.css";

import {
  checkDuplicateClip,
  createClip,
  deleteClip,
  getClips,
  updateClip
} from "./api";

import AlertMessage from "./components/AlertMessage";
import ClipCard from "./components/ClipCard";
import ClipFilters from "./components/ClipFilters";
import ClipForm from "./components/ClipForm";

const emptyForm = {
  url: "",
  title: "",
  status: "saved",
  tags: "",
  notes: ""
};

function App() {
  const [clips, setClips] = useState([]);
  const [formData, setFormData] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  async function loadClips() {
    try {
      const clipsFromApi = await getClips({
        search,
        status: statusFilter
      });

      setClips(clipsFromApi);
    } catch {
      setError("Could not load clips.");
    }
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
        await updateClip(editingId, formData);
        setMessage("Clip updated.");
        setEditingId(null);
      } else {
        const duplicateCheck = await checkDuplicateClip(formData.url);

        if (duplicateCheck.duplicate) {
          setError("Duplicate warning: this URL is already saved.");
          return;
        }

        await createClip(formData);
        setMessage("Clip saved.");
      }

      setFormData(emptyForm);
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

  async function handleDeleteClip(id) {
    await deleteClip(id);
    setMessage("Clip deleted.");
    loadClips();
  }

  function cancelEdit() {
    setEditingId(null);
    setFormData(emptyForm);
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

          <AlertMessage error={error} message={message} />

          <ClipForm
            formData={formData}
            editingId={editingId}
            onChange={handleChange}
            onSubmit={handleSubmit}
            onCancelEdit={cancelEdit}
          />
        </section>

        <section className="panel">
          <h2>Clip Library</h2>

          <ClipFilters
            search={search}
            statusFilter={statusFilter}
            onSearchChange={setSearch}
            onStatusChange={setStatusFilter}
          />

          <p className="count">{clips.length} clip(s) found</p>

          <div className="clip-list">
            {clips.map((clip) => (
              <ClipCard
                key={clip.id}
                clip={clip}
                onEdit={startEdit}
                onDelete={handleDeleteClip}
              />
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