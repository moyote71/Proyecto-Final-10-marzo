import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL;

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // 🔥 CRÍTICO
});

http.interceptors.request.use(config => {
    return config;
});

http.interceptors.response.use(
    (res) => res,
    (err) => {
        console.error("HTTP ERROR:", err.response?.data);

        if (err.response?.status === 401) {
            console.log("Sesión expirada");
            window.location.href = "/login";
        }
        const message = err.response?.data?.message || err.message || 'Error de red';
        return Promise.reject(new Error(message));
    }
);
