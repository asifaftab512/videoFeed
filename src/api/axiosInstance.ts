// axiosInstance.ts
import axios from "axios";

const BASE_URL = "https://videoshare-bdducrcvaxapa5gg.southeastasia-01.azurewebsites.net/api"; // Backend base URL

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Attach token from localStorage
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // always get from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
