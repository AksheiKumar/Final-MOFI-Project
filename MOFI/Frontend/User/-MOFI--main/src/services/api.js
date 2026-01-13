import axios from "axios";

let accessToken = null;

export const setApiAccessToken = (token) => {
  accessToken = token;
};

const api = axios.create({
  baseURL: "http://localhost:8000/auth",
  withCredentials: true, // REQUIRED for refresh cookie
});

/* ================= REQUEST ================= */
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

/* ================= RESPONSE ================= */
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((p) => {
    error ? p.reject(error) : p.resolve(token);
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    if (
      err.response?.status === 401 &&
      !original._retry &&
      !original.url.includes("/refresh")
    ) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          original.headers.Authorization = `Bearer ${token}`;
          return api(original);
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const r = await api.post("/refresh");
        setApiAccessToken(r.data.access);
        processQueue(null, r.data.access);

        original.headers.Authorization = `Bearer ${r.data.access}`;
        return api(original);
      } catch (e) {
        processQueue(e, null);
        setApiAccessToken(null);
        window.location.replace("/login");
        return Promise.reject(e);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(err);
  }
);

export default api;
