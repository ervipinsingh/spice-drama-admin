import axios from "axios";

const BASE_URL =
  import.meta.env.VITE_USER_API || "http://localhost:5000";

const userApi = axios.create({
  baseURL: `${BASE_URL}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// ATTACH TOKEN
userApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default userApi;
