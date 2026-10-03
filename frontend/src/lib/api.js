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
  // Auth
  register: (body) => request("/api/auth/register", { method: "POST", body: JSON.stringify(body) }),
  login: (body) => request("/api/auth/login", { method: "POST", body: JSON.stringify(body) }),
  me: () => request("/api/auth/me"),
  health: () => request("/api/health"),

  // Categories
  getCategories: () => request("/api/categories"),
  getCategory: (id) => request(`/api/categories/${id}`),

  // Services
  getServices: (categoryId) =>
    request(`/api/services${categoryId ? `?categoryId=${categoryId}` : ""}`),
  getService: (id) => request(`/api/services/${id}`),

  // Providers
  getProvidersForService: (serviceId, params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/providers/service/${serviceId}${query ? `?${query}` : ""}`);
  },
  getProvider: (id) => request(`/api/providers/${id}`),
  searchProviders: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return request(`/api/providers/search${query ? `?${query}` : ""}`);
  },

  // Bookings
  createBooking: (body) => request("/api/bookings", { method: "POST", body: JSON.stringify(body) }),
  getBookings: () => request("/api/bookings"),
  getBooking: (id) => request(`/api/bookings/${id}`),
  cancelBooking: (id) => request(`/api/bookings/${id}/cancel`, { method: "PATCH" }),
  getProviderBookings: () => request("/api/provider/bookings"),
  updateProviderBookingStatus: (id, status) =>
    request(`/api/provider/bookings/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }) }),
};
