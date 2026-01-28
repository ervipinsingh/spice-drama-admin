import axios from "axios";

const userApi = axios.create({
  baseURL: `${import.meta.env.VITE_USER_API}/api`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 🔑 ATTACH TOKEN TO EVERY REQUEST
userApi.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default userApi;
