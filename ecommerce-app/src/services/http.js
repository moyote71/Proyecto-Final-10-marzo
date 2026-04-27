import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

if (!API_BASE) {
  throw new Error("REACT_APP_API_BASE_URL no está definido");
}

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // 🔥 CLAVE para cookies en producción
  timeout: 10000,
});

/* =========================
   RESPONSE INTERCEPTOR
========================= */
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("🔒 No autenticado (sin sesión o cookie no enviada)");
    }

    if (status === 404) {
      console.warn("⚠️ Endpoint no encontrado:", error.config?.url);
    }

    return Promise.reject(error);
  }
);