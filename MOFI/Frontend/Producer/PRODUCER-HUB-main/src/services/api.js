import axios from "axios";

let accessToken = null;
export const setApiAccessToken = (t) => (accessToken = t);

const api = axios.create({
  baseURL: "http://localhost:8001/auth",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // Token expired, try refresh
    if (
      err.response?.status === 401 &&
      !original._retry &&
      !original.url.includes("/refresh")
    ) {
      original._retry = true;
      try {
        const r = await api.post("/refresh");
        const newAccess = r.data.access;
        setApiAccessToken(newAccess);
        original.headers.Authorization = `Bearer ${newAccess}`;
        return api(original);
      } catch {
        setApiAccessToken(null);
        window.location.replace("/login");
      }
    }

    return Promise.reject(err);
  }
);

export default api;
