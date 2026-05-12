import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export async function getClips({ search = "", status = "all" } = {}) {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (status !== "all") params.append("status", status);

  const response = await axios.get(`${API_BASE}/clips?${params.toString()}`);
  return response.data.clips;
}

export async function checkDuplicateClip(url) {
  const response = await axios.post(`${API_BASE}/clips/check-duplicate`, {
    url
  });

  return response.data;
}

export async function createClip(clipData) {
  const response = await axios.post(`${API_BASE}/clips`, clipData);
  return response.data.clip;
}

export async function updateClip(id, clipData) {
  const response = await axios.patch(`${API_BASE}/clips/${id}`, clipData);
  return response.data.clip;
}

export async function deleteClip(id) {
  const response = await axios.delete(`${API_BASE}/clips/${id}`);
  return response.data;
}