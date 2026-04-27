import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 10000,
});

/* =========================
   REQUEST INTERCEPTOR 🔥 (FALTABA)
========================= */
http.interceptors.request.use(
  (config) => {
    // Si en algún punto usas token en localStorage
    const token = localStorage.getItem("token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.log("🔒 No autenticado");
    }

    if (status === 404) {
      console.log("⚠️ Endpoint no encontrado:", error.config?.url);
    }

    if (status >= 500) {
      console.log("💥 Error servidor:", error.config?.url);
    }

    return Promise.reject(error);
  }
);