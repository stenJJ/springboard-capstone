const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 5000;

const DATA_FILE = path.join(__dirname, "clips.json");

app.use(cors());
app.use(express.json());

function readClips() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify([], null, 2));
  }

  const data = fs.readFileSync(DATA_FILE, "utf-8");
  return JSON.parse(data);
}

function writeClips(clips) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(clips, null, 2));
}

function normalizeUrl(url) {
  try {
    const parsed = new URL(url);

    parsed.hash = "";

    if (parsed.hostname.includes("youtube.com")) {
      const videoId = parsed.searchParams.get("v");
      if (videoId) {
        return `https://www.youtube.com/watch?v=${videoId}`;
      }
    }

    if (parsed.hostname.includes("youtu.be")) {
      return `https://www.youtube.com/watch?v=${parsed.pathname.slice(1)}`;
    }

    parsed.searchParams.delete("utm_source");
    parsed.searchParams.delete("utm_medium");
    parsed.searchParams.delete("utm_campaign");
    parsed.searchParams.delete("t");

    return parsed.toString();
  } catch {
    return null;
  }
}

app.get("/api", (req, res) => {
  res.json({ message: "ClipVault API is running" });
});

app.get("/api/clips", (req, res) => {
  const clips = readClips();
  const { search, status } = req.query;

  let results = clips;

  if (search) {
    const term = search.toLowerCase();
    results = results.filter((clip) => {
      return (
        clip.title.toLowerCase().includes(term) ||
        clip.url.toLowerCase().includes(term) ||
        clip.notes.toLowerCase().includes(term) ||
        clip.tags.toLowerCase().includes(term)
      );
    });
  }

  if (status && status !== "all") {
    results = results.filter((clip) => clip.status === status);
  }

  res.json({ clips: results });
});

app.get("/api/clips/:id", (req, res) => {
  const clips = readClips();
  const clip = clips.find((clip) => clip.id === Number(req.params.id));

  if (!clip) {
    return res.status(404).json({ error: "Clip not found" });
  }

  res.json({ clip });
});

app.post("/api/clips/check-duplicate", (req, res) => {
  const { url } = req.body;
  const normalizedUrl = normalizeUrl(url);

  if (!normalizedUrl) {
    return res.status(400).json({ error: "A valid URL is required" });
  }

  const clips = readClips();
  const existingClip = clips.find((clip) => clip.normalizedUrl === normalizedUrl);

  if (existingClip) {
    return res.json({
      duplicate: true,
      existingClip
    });
  }

  res.json({ duplicate: false });
});

app.post("/api/clips", (req, res) => {
  const { url, title, status, tags, notes } = req.body;
  const normalizedUrl = normalizeUrl(url);

  if (!normalizedUrl) {
    return res.status(400).json({ error: "A valid URL is required" });
  }

  const clips = readClips();

  const duplicate = clips.find((clip) => clip.normalizedUrl === normalizedUrl);

  if (duplicate) {
    return res.status(409).json({
      error: "This clip is already saved",
      existingClipId: duplicate.id
    });
  }

  const newClip = {
    id: Date.now(),
    url,
    normalizedUrl,
    title: title || "Untitled Clip",
    status: status || "saved",
    tags: tags || "",
    notes: notes || "",
    createdAt: new Date().toISOString()
  };

  clips.push(newClip);
  writeClips(clips);

  res.status(201).json({ clip: newClip });
});

app.patch("/api/clips/:id", (req, res) => {
  const clips = readClips();
  const clipIndex = clips.findIndex((clip) => clip.id === Number(req.params.id));

  if (clipIndex === -1) {
    return res.status(404).json({ error: "Clip not found" });
  }

  clips[clipIndex] = {
    ...clips[clipIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  writeClips(clips);

  res.json({ clip: clips[clipIndex] });
});

app.delete("/api/clips/:id", (req, res) => {
  const clips = readClips();
  const filteredClips = clips.filter((clip) => clip.id !== Number(req.params.id));

  if (filteredClips.length === clips.length) {
    return res.status(404).json({ error: "Clip not found" });
  }

  writeClips(filteredClips);

  res.json({ message: "Clip deleted" });
});

app.listen(PORT, () => {
  console.log(`ClipVault server running on http://localhost:${PORT}`);
});