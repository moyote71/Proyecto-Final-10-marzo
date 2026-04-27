import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

  export const http = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL,
    withCredentials: true, // 🔥 obligatorio
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
        }

        if (status === 404) {
            console.log("⚠️ Endpoint no encontrado:", error.config?.url);
        }

        return Promise.reject(error);
    }
);