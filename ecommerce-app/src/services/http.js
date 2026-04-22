import axios from "axios";

const API_BASE = import.meta.env.VITE_API_URL 
  || "https://proyecto-final-10-marzo-qv08.onrender.com/api";

console.log("🚀 API_BASE FINAL:", API_BASE);

export const http = axios.create({
  baseURL: API_BASE,
  withCredentials: true,
});

// ❌ SIN interceptor que modifique la URL
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