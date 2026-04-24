import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

// 🔴 Validación fuerte (evita bugs silenciosos en producción)
if (!API_BASE) {
  throw new Error("❌ REACT_APP_API_BASE_URL NO está definido");
}

console.log("🚀 API_BASE FINAL:", API_BASE);

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 10000, // 🔥 evita requests colgados
});

// 🔥 REQUEST INTERCEPTOR (por si luego agregas headers)
http.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);

// 🔥 RESPONSE INTERCEPTOR PRO
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    // ✅ 401 → controlado (NO ruido en consola)
    if (status === 401) {
      console.warn("No autenticado");
    } 
    // 🔥 otros errores reales
    else {
      console.error("HTTP ERROR:", error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);