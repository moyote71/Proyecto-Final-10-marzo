import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

if (!API_BASE) {
  console.error("❌ REACT_APP_API_BASE_URL NO está definido");
}

console.log("🚀 API_BASE FINAL:", API_BASE);

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // ✅ necesario para cookies
});

// ✅ interceptor limpio
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // ⚠️ normal si no hay sesión
      console.warn("No autenticado");
    } else {
      console.error("HTTP ERROR:", err.response?.data || err.message);
    }

    return Promise.reject(err);
  }
);