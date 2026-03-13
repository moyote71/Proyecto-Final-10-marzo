import axios from "axios";

const API_BASE = "http://localhost:4000/api/";

export const http = axios.create({ baseURL: API_BASE, timeout: 8000 });

http.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

http.interceptors.response.use(
    (res) => res,
    (err) => {
        const message = err.response?.data?.message || err.message || 'Error de red';
        return Promise.reject(new Error(message));
    }
);
