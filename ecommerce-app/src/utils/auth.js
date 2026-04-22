import { http } from "../services/http";

export async function login(email, password) {
    try {
        console.log("LOGIN URL:", http.defaults.baseURL + "/auth/login");
        const response = await http.post('/auth/login', { email, password });
        
        if (!response.data || !response.data.user) {
            throw new Error("Respuesta inválida del servidor");
        }

        const userWithLoginDate = { ...response.data.user, loginDate: new Date().toISOString() };
        return { success: true, user: userWithLoginDate };
    } catch (error) {
        return {
            success: false,
            error: error.response?.data?.message || error.message || "Error al iniciar sesión",
        };
    }
}

export async function register(name, email, password) {
    try {
        // Enviar petición POST al endpoint de registro
        const response = await http.post('/auth/register', { displayName: name, email, password });
        const { user } = response.data;

        if (user) {
            const userWithLoginDate = { ...user, loginDate: new Date().toISOString() };
            return { success: true, user: userWithLoginDate };
        }
        return { success: false, error: "Respuesta inválida del servidor" };
    } catch (error) {
        // Retornar error específico del backend si existe (ej. email duplicado)
        return {
            success: false,
            error: error.response?.data?.message || error.message || "Error al registrarse",
        };
    }
}

export async function logout(forceReload = true) {
    try {
        await http.post("/auth/logout");
    } catch (e) {
        console.error("Logout error", e);
    } finally {
        if (forceReload) {
            window.location.href = "/login";
        }
    }
}

export function getCurrentUser() {
    const userData = localStorage.getItem("userData");
    return userData ? JSON.parse(userData) : null;
}

export function isAuthenticated() {
    // Al no tener acceso al JWT (httpOnly), determinamos sesión por data de perfil
    // Las llamadas fallarán localmente si la cookie expiró (serán 401 que deberán ser atrapados)
    const userData = localStorage.getItem("userData");
    return userData !== null;
}
