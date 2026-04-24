import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

if (!API_BASE) {
  throw new Error("REACT_APP_API_BASE_URL NO está definido");
}

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 10000,
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
http.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

/* =========================
   RESPONSE INTERCEPTOR
========================= */
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("🔒 No autenticado (token inválido o expirado)");

      // 🔥 FIX IMPORTANTE
      localStorage.removeItem("token");

      // opcional: redirección automática
      window.location.href = "/login";
    }

    if (status === 404) {
      console.warn("⚠️ Endpoint no encontrado:", error.config?.url);
    }

    return Promise.reject(error);
  }
);