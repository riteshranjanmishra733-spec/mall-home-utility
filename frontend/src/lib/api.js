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
  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  const token = getToken();

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const url = API_URL ? `${API_URL}${path}` : path;

  const res = await fetch(url, {
    ...options,
    headers,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.error || "Request failed");
    error.status = res.status;
    throw error;
  }

  return data;
}

export const api = {
  // =========================
  // Auth
  // =========================

  register: (body) =>
    request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  login: (body) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  me: () => request("/api/auth/me"),

  health: () => request("/api/health"),

  // =========================
  // Categories
  // =========================

  getCategories: () =>
    request("/api/categories"),

  getCategory: (id) =>
    request(`/api/categories/${id}`),

  // =========================
  // Services
  // =========================

  getServices: (categoryId) =>
    request(
      `/api/services${categoryId ? `?categoryId=${categoryId}` : ""}`
    ),

  getService: (id) =>
    request(`/api/services/${id}`),

  // =========================
  // Providers - Public
  // =========================

  getProvidersForService: (serviceId, params = {}) => {
    const query = new URLSearchParams(params).toString();

    return request(
      `/api/providers/service/${serviceId}${query ? `?${query}` : ""}`
    );
  },

  getProvider: (id) =>
    request(`/api/providers/${id}`),

  searchProviders: (params = {}) => {
    const query = new URLSearchParams(params).toString();

    return request(
      `/api/providers/search${query ? `?${query}` : ""}`
    );
  },

  // =========================
  // Provider - Own Services
  // =========================

  getProviderServices: () =>
    request("/api/provider/services"),

  updateProviderServicePrice: (serviceId, price) =>
    request(`/api/provider/services/${serviceId}/price`, {
      method: "PATCH",
      body: JSON.stringify({ price }),
    }),

  // =========================
  // Bookings - Customer
  // =========================

  createBooking: (body) =>
    request("/api/bookings", {
      method: "POST",
      body: JSON.stringify(body),
    }),

  getBookings: () =>
    request("/api/bookings"),

  getBooking: (id) =>
    request(`/api/bookings/${id}`),

  cancelBooking: (id) =>
    request(`/api/bookings/${id}/cancel`, {
      method: "PATCH",
    }),

  // =========================
  // Bookings - Provider
  // =========================

  getProviderBookings: () =>
    request("/api/provider/bookings"),

  updateProviderBookingStatus: (id, status) =>
    request(`/api/provider/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  // =========================
  // Admin
  // =========================

  getAdminOverview: () =>
    request("/api/admin/overview"),

  getAdminUsers: () =>
    request("/api/admin/users"),

  getAdminProviders: () =>
    request("/api/admin/providers"),

  getAdminServices: () =>
    request("/api/admin/services"),

  getAdminCategories: () =>
    request("/api/admin/categories"),

  getAdminBookings: () =>
    request("/api/admin/bookings"),

  setAdminProviderVerificationStatus: (id, status) =>
    request(`/api/admin/providers/${id}/verification`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),

  setAdminProviderAvailability: (id, isAvailable) =>
    request(`/api/admin/providers/${id}/availability`, {
      method: "PATCH",
      body: JSON.stringify({ isAvailable }),
    }),

  setAdminProviderServiceAvailability: (
    providerId,
    serviceId,
    isAvailable
  ) =>
    request(
      `/api/admin/providers/${providerId}/services/${serviceId}/status`,
      {
        method: "PATCH",
        body: JSON.stringify({ isAvailable }),
      }
    ),

  setAdminServiceStatus: (id, isActive) =>
    request(`/api/admin/services/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ isActive }),
    }),

  setAdminBookingStatus: (id, status) =>
    request(`/api/admin/bookings/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};