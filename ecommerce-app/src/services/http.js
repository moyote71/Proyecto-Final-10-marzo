import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

// 🔴 Validación fuerte
if (!API_BASE) {
  throw new Error("❌ REACT_APP_API_BASE_URL NO está definido");
}

console.log("🚀 API_BASE FINAL:", API_BASE);

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
  timeout: 10000,
});

// ✅ REQUEST INTERCEPTOR
http.interceptors.request.use(
  (config) => config,
  (error) => Promise.reject(error)
);

// ✅ RESPONSE INTERCEPTOR SEGURO
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      // 🔒 NO romper UI
      console.warn("No autenticado");
    } else {
      console.error("HTTP ERROR:", error.response?.data || error.message);
    }

    return Promise.reject(error);
  }
);