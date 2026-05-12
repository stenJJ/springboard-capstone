import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");

  return {
    Authorization: `Bearer ${token}`
  };
}

export async function registerUser(userData) {
  const response = await axios.post(`${API_BASE}/auth/register`, userData);
  return response.data;
}

export async function loginUser(loginData) {
  const response = await axios.post(`${API_BASE}/auth/login`, loginData);
  return response.data;
}

export async function getCurrentUser() {
  const response = await axios.get(`${API_BASE}/auth/me`, {
    headers: getAuthHeaders()
  });

  return response.data.user;
}

export async function getClips({ search = "", status = "all" } = {}) {
  const params = new URLSearchParams();

  if (search) params.append("search", search);
  if (status !== "all") params.append("status", status);

  const response = await axios.get(`${API_BASE}/clips?${params.toString()}`, {
    headers: getAuthHeaders()
  });

  return response.data.clips;
}

export async function checkDuplicateClip(url) {
  const response = await axios.post(
    `${API_BASE}/clips/check-duplicate`,
    { url },
    { headers: getAuthHeaders() }
  );

  return response.data;
}

export async function createClip(clipData) {
  const response = await axios.post(`${API_BASE}/clips`, clipData, {
    headers: getAuthHeaders()
  });

  return response.data.clip;
}

export async function updateClip(id, clipData) {
  const response = await axios.patch(`${API_BASE}/clips/${id}`, clipData, {
    headers: getAuthHeaders()
  });

  return response.data.clip;
}

export async function deleteClip(id) {
  const response = await axios.delete(`${API_BASE}/clips/${id}`, {
    headers: getAuthHeaders()
  });

  return response.data;
}