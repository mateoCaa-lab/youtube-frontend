const API_URL = "http://localhost:8000";

// Guardamos el token en memoria (se pierde al recargar, lo manejamos abajo)
let authToken = localStorage.getItem("token");

export function setToken(token) {
  authToken = token;
  localStorage.setItem("token", token);
}

export function getToken() {
  return authToken;
}
// Headers con el token para cada request
function headers() {
  return {
    "Content-Type": "application/json",
    "Authorization": `Bearer ${authToken}`,
  };
}

export async function getUser() {
  const res = await fetch(`${API_URL}/api/user`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error("No autenticado");
  return res.json();
}

export async function getMyChannels() {
  const res = await fetch(`${API_URL}/api/my-channels`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error("Error al obtener canales");
  return res.json();
}

export async function createChannel(data) {
  const res = await fetch(`${API_URL}/api/channels`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al crear canal");
  return res.json();
}

export async function updateChannel(id, data) {
  const res = await fetch(`${API_URL}/api/channels/${id}`, {
    method: "PUT",
    headers: headers(),
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Error al actualizar canal");
  return res.json();
}

export async function deleteChannel(id) {
  const res = await fetch(`${API_URL}/api/channels/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Error al eliminar canal");
  return res.json();
}

export async function updateAvatar(id, file) {
  const form = new FormData();
  form.append("avatar", file);
  const res = await fetch(`${API_URL}/api/channels/${id}/avatar`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${authToken}` },
    body: form,
  });
  if (!res.ok) throw new Error("Error al actualizar avatar");
  return res.json();
}

export async function updateBanner(id, file) {
  const form = new FormData();
  form.append("banner", file);
  const res = await fetch(`${API_URL}/api/channels/${id}/banner`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${authToken}` },
    body: form,
  });
  if (!res.ok) throw new Error("Error al actualizar banner");
  return res.json();
}

export async function addMember(channelId, email, role = "admin") {
  const res = await fetch(`${API_URL}/api/channels/${channelId}/members`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ email, role }),
  });
  if (!res.ok) throw new Error("Error al agregar miembro");
  return res.json();
}

export async function removeMember(channelId, userId) {
  const res = await fetch(`${API_URL}/api/channels/${channelId}/members/${userId}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Error al eliminar miembro");
  return res.json();
}

export async function transferOwnership(channelId, userId) {
  const res = await fetch(`${API_URL}/api/channels/${channelId}/transfer`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ user_id: userId }),
  });
  if (!res.ok) throw new Error("Error al transferir ownership");
  return res.json();
}

// ── Videos ────────────────────────────────────────
export async function getVideos() {
  const res = await fetch(`${API_URL}/api/videos`);
  if (!res.ok) throw new Error("Error al obtener videos");
  return res.json();
}

export async function getVideo(id) {
  const res = await fetch(`${API_URL}/api/videos/${id}`, {
    headers: { "Authorization": `Bearer ${authToken}` },
  });
  if (!res.ok) throw new Error("Error al obtener video");
  return res.json();
}

export async function uploadVideo(channelId, formData) {
  const res = await fetch(`${API_URL}/api/channels/${channelId}/videos`, {
    method: "POST",
    headers: { "Authorization": `Bearer ${authToken}` },
    body: formData,
  });
  if (!res.ok) throw new Error("Error al subir video");
  return res.json();
}

export async function deleteVideo(id) {
  const res = await fetch(`${API_URL}/api/videos/${id}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Error al eliminar video");
  return res.json();
}

export async function getChannelVideos(channelId) {
  const res = await fetch(`${API_URL}/api/channels/${channelId}/videos`);
  if (!res.ok) throw new Error("Error al obtener videos del canal");
  return res.json();
}

// ── Likes ─────────────────────────────────────────
export async function toggleLike(videoId) {
  const res = await fetch(`${API_URL}/api/videos/${videoId}/like`, {
    method: "POST",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Error al dar like");
  return res.json();
}

// ── Comentarios ───────────────────────────────────
export async function addComment(videoId, content) {
  const res = await fetch(`${API_URL}/api/videos/${videoId}/comments`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify({ content }),
  });
  if (!res.ok) throw new Error("Error al comentar");
  return res.json();
}

export async function deleteComment(commentId) {
  const res = await fetch(`${API_URL}/api/comments/${commentId}`, {
    method: "DELETE",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Error al eliminar comentario");
  return res.json();
}

// ── Suscripciones ─────────────────────────────────
export async function toggleSubscription(channelId) {
  const res = await fetch(`${API_URL}/api/channels/${channelId}/subscribe`, {
    method: "POST",
    headers: headers(),
  });
  if (!res.ok) throw new Error("Error al suscribirse");
  return res.json();
}

export async function getFeed() {
  const res = await fetch(`${API_URL}/api/feed`, {
    headers: headers(),
  });
  if (!res.ok) throw new Error("Error al obtener feed");
  return res.json();
}

export async function getChannel(id) {
  const res = await fetch(`${API_URL}/api/channels/${id}`, {
    headers: { "Authorization": `Bearer ${authToken}` },
  });
  if (!res.ok) throw new Error("Error al obtener canal");
  return res.json();
}

export async function searchVideos(query) {
  const res = await fetch(`${API_URL}/api/search?q=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("Error al buscar");
  return res.json();
}