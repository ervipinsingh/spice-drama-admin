import axios from "axios";

const adminApi = axios.create({
  baseURL: `${import.meta.env.VITE_ADMIN_API}/api`,
});

adminApi.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // ✅ single token
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default adminApi;
