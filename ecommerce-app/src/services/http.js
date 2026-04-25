import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

if (!API_BASE) {
  throw new Error("REACT_APP_API_BASE_URL NO está definido");
}

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // 🔥 clave para cookies
  timeout: 10000,
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
http.interceptors.request.use((config) => {
  // 🔥 NO usar token manual
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
      console.warn("🔒 No autenticado (modo invitado)");
      // 🔥 NO redirigir
    }

    if (status === 404) {
      console.warn("⚠️ Endpoint no encontrado:", error.config?.url);
    }

    return Promise.reject(error);
  }
);