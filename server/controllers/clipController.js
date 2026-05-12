const { readClips, writeClips } = require("../data/clipStore");
const normalizeUrl = require("../helpers/normalizeUrl");

function getAllClips(req, res) {
  const clips = readClips();
  const { search, status } = req.query;

  let results = clips.filter((clip) => clip.userId === req.user.id);

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
}

function getClipById(req, res) {
  const clips = readClips();

  const clip = clips.find((clip) => {
    return clip.id === Number(req.params.id) && clip.userId === req.user.id;
  });

  if (!clip) {
    return res.status(404).json({ error: "Clip not found" });
  }

  res.json({ clip });
}

function checkDuplicateClip(req, res) {
  const { url } = req.body;
  const normalizedUrl = normalizeUrl(url);

  if (!normalizedUrl) {
    return res.status(400).json({ error: "A valid URL is required" });
  }

  const clips = readClips();

  const existingClip = clips.find((clip) => {
    return clip.normalizedUrl === normalizedUrl && clip.userId === req.user.id;
  });

  if (existingClip) {
    return res.json({
      duplicate: true,
      existingClip
    });
  }

  res.json({ duplicate: false });
}

function createClip(req, res) {
  const { url, title, status, tags, notes } = req.body;
  const normalizedUrl = normalizeUrl(url);

  if (!normalizedUrl) {
    return res.status(400).json({ error: "A valid URL is required" });
  }

  const clips = readClips();

  const duplicate = clips.find((clip) => {
    return clip.normalizedUrl === normalizedUrl && clip.userId === req.user.id;
  });

  if (duplicate) {
    return res.status(409).json({
      error: "This clip is already saved",
      existingClipId: duplicate.id
    });
  }

  const newClip = {
    id: Date.now(),
    userId: req.user.id,
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
}

function updateClip(req, res) {
  const clips = readClips();

  const clipIndex = clips.findIndex((clip) => {
    return clip.id === Number(req.params.id) && clip.userId === req.user.id;
  });

  if (clipIndex === -1) {
    return res.status(404).json({ error: "Clip not found" });
  }

  clips[clipIndex] = {
    ...clips[clipIndex],
    ...req.body,
    id: clips[clipIndex].id,
    userId: clips[clipIndex].userId,
    updatedAt: new Date().toISOString()
  };

  writeClips(clips);

  res.json({ clip: clips[clipIndex] });
}

function deleteClip(req, res) {
  const clips = readClips();

  const clipExists = clips.some((clip) => {
    return clip.id === Number(req.params.id) && clip.userId === req.user.id;
  });

  if (!clipExists) {
    return res.status(404).json({ error: "Clip not found" });
  }

  const filteredClips = clips.filter((clip) => {
    return !(clip.id === Number(req.params.id) && clip.userId === req.user.id);
  });

  writeClips(filteredClips);

  res.json({ message: "Clip deleted" });
}

module.exports = {
  getAllClips,
  getClipById,
  checkDuplicateClip,
  createClip,
  updateClip,
  deleteClip
};