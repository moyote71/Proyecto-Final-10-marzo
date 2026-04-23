import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

if (!API_BASE) {
  console.error("❌ VITE_API_URL NO está definido en producción");
}

console.log("🚀 API_BASE FINAL:", API_BASE);

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("HTTP ERROR:", err.response?.data || err.message);

    if (err.response?.status === 401) {
      window.location.href = "/login";
    }

    return Promise.reject(err);
  }
);