import { http } from "../services/http";

export async function login(email, password) {
    try {
        const response = await http.post('/auth/login', { email, password });
        const { user } = response.data;
        
        if (user) {
            const userWithLoginDate = { ...user, loginDate: new Date().toISOString() };
            // El token ya fue guardado en las cookies HttpOnly por el backend
            localStorage.setItem("userData", JSON.stringify(userWithLoginDate));
            return { success: true, user: userWithLoginDate };
        }
        return { success: false, error: "Respuesta inválida del servidor" };
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
        const response = await http.post('/auth/register', { name, email, password });
        const { user } = response.data;

        if (user) {
            // Guardar en localStorage para mantener sesión frontend 
            // (El JWT se manejará con cookies HttpOnly como en login)
            const userWithLoginDate = { ...user, loginDate: new Date().toISOString() };
            localStorage.setItem("userData", JSON.stringify(userWithLoginDate));
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
        localStorage.removeItem("userData");
        // Forzar recarga completa para limpiar memoria si es necesario
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
