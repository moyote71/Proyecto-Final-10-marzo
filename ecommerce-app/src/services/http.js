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

// REQUEST
http.interceptors.request.use((config) => {
  return config;
});

// RESPONSE (IMPORTANTE)
http.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn("🔒 No autenticado (token inválido o expirado)");
      // aquí luego puedes agregar refresh token automático
    }

    return Promise.reject(error);
  }
);