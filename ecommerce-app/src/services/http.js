import axios from "axios";

const API_BASE = process.env.REACT_APP_API_BASE_URL;

export const http = axios.create({ baseURL: API_BASE, timeout: 8000, withCredentials: true });

http.interceptors.request.use(config => {
    return config;
});

http.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            console.log("Sesión expirada");
            window.location.href = "/login";
        }
        const message = err.response?.data?.message || err.message || 'Error de red';
        return Promise.reject(new Error(message));
    }
);
