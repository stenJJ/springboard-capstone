import { useEffect, useState } from "react";
import "./App.css";

import {
  checkDuplicateClip,
  createClip,
  deleteClip,
  getClips,
  loginUser,
  registerUser,
  updateClip
} from "./api";

import AlertMessage from "./components/AlertMessage";
import AuthForm from "./components/AuthForm";
import ClipCard from "./components/ClipCard";
import ClipFilters from "./components/ClipFilters";
import ClipForm from "./components/ClipForm";

const emptyClipForm = {
  url: "",
  title: "",
  status: "saved",
  tags: "",
  notes: ""
};

const emptyAuthForm = {
  username: "",
  email: "",
  usernameOrEmail: "",
  password: ""
};

function App() {
  const [clips, setClips] = useState([]);
  const [clipFormData, setClipFormData] = useState(emptyClipForm);
  const [authFormData, setAuthFormData] = useState(emptyAuthForm);
  const [authMode, setAuthMode] = useState("login");
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [editingId, setEditingId] = useState(null);

  async function loadClips() {
    if (!user) return;

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
  }, [search, statusFilter, user]);

  function handleClipChange(event) {
    const { name, value } = event.target;

    setClipFormData((data) => ({
      ...data,
      [name]: value
    }));
  }

  function handleAuthChange(event) {
    const { name, value } = event.target;

    setAuthFormData((data) => ({
      ...data,
      [name]: value
    }));
  }

  async function handleAuthSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      const result =
        authMode === "register"
          ? await registerUser({
              username: authFormData.username,
              email: authFormData.email,
              password: authFormData.password
            })
          : await loginUser({
              usernameOrEmail: authFormData.usernameOrEmail,
              password: authFormData.password
            });

      localStorage.setItem("token", result.token);
      localStorage.setItem("user", JSON.stringify(result.user));

      setUser(result.user);
      setAuthFormData(emptyAuthForm);
      setMessage(`Logged in as ${result.user.username}.`);
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed.");
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setClips([]);
    setMessage("");
    setError("");
  }

  async function handleClipSubmit(event) {
    event.preventDefault();
    setError("");
    setMessage("");

    try {
      if (editingId) {
        await updateClip(editingId, clipFormData);
        setMessage("Clip updated.");
        setEditingId(null);
      } else {
        const duplicateCheck = await checkDuplicateClip(clipFormData.url);

        if (duplicateCheck.duplicate) {
          setError("Duplicate warning: this URL is already saved.");
          return;
        }

        await createClip(clipFormData);
        setMessage("Clip saved.");
      }

      setClipFormData(emptyClipForm);
      loadClips();
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  }

  function startEdit(clip) {
    setEditingId(clip.id);

    setClipFormData({
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
    setClipFormData(emptyClipForm);
  }

  function toggleAuthMode() {
    setAuthMode((mode) => (mode === "login" ? "register" : "login"));
    setError("");
    setMessage("");
  }

  return (
    <div className="app">
      <header className="hero">
        <h1>ClipVault</h1>
        <p>
          Save video links, organize clips, and prevent duplicate URLs from
          cluttering your media library.
        </p>

        {user && (
          <div className="user-bar">
            <span>Logged in as {user.username}</span>
            <button type="button" className="secondary" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </header>

      <main className={user ? "layout" : "auth-layout"}>
        {!user && (
          <>
            <AlertMessage error={error} message={message} />

            <AuthForm
              mode={authMode}
              formData={authFormData}
              onChange={handleAuthChange}
              onSubmit={handleAuthSubmit}
              onToggleMode={toggleAuthMode}
            />
          </>
        )}

        {user && (
          <>
            <section className="panel">
              <h2>{editingId ? "Edit Clip" : "Add Clip"}</h2>

              <AlertMessage error={error} message={message} />

              <ClipForm
                formData={clipFormData}
                editingId={editingId}
                onChange={handleClipChange}
                onSubmit={handleClipSubmit}
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
          </>
        )}
      </main>
    </div>
  );
}

export default App;