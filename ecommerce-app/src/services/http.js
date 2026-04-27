import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
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
      console.log("🔒 No autenticado");

      // 🔥 OPCIONAL PERO RECOMENDADO:
      // limpiar estado si quieres evitar loops de 401
      // localStorage.removeItem("user"); (si usas persistencia)
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