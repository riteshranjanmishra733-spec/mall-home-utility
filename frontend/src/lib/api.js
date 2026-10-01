const API_URL = import.meta.env.VITE_API_URL || "";

function getToken() {
  return localStorage.getItem("mh_token");
}

export function setToken(token) {
  localStorage.setItem("mh_token", token);
}

export function clearToken() {
  localStorage.removeItem("mh_token");
}

async function request(path, options = {}) {
  const headers = { "Content-Type": "application/json", ...options.headers };

  const token = getToken();
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = API_URL ? `${API_URL}${path}` : path;
  const res = await fetch(url, { ...options, headers });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Request failed");
  }

  return data;
}

export const api = {
  register: (body) => request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/api/auth/me"),
  health: () => request("/api/health"),
};
