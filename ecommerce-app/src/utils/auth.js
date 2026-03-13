import { http } from "../services/http";

export async function login(email, password) {
    try {
        const response = await http.post('/auth/login', { email, password });
        const { token, user } = response.data;
        
        if (token && user) {
            const userWithLoginDate = { ...user, loginDate: new Date().toISOString() };
            localStorage.setItem("authToken", token);
            localStorage.setItem("userData", JSON.stringify(userWithLoginDate));
            return { success: true, user: userWithLoginDate };
        }
        return { success: false, error: "Respuesta inválida del servidor" };
    } catch (error) {
        return {
            success: false,
            error: error.message || "Error al iniciar sesión",
        };
    }
}

export function logout() {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userData");
}

export function getCurrentUser() {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
}

export function isAuthenticated() {
    const token = localStorage.getItem("authToken");
    return token !== null;
}
