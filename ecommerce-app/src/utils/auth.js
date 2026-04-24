import { http } from "../services/http";

// ✅ LOGIN CORREGIDO
export async function login(email, password) {
    try {
        console.log("LOGIN URL:", http.defaults.baseURL + "/auth/login");

        const response = await http.post(
            "/auth/login",
            { email, password },
            { withCredentials: true } // 🔥 CLAVE
        );

        if (!response.data || !response.data.user) {
            throw new Error("Respuesta inválida del servidor");
        }

        const userWithLoginDate = {
            ...response.data.user,
            loginDate: new Date().toISOString(),
        };

        // ✅ Guardar en localStorage (para persistencia)
        localStorage.setItem("userData", JSON.stringify(userWithLoginDate));

        return { success: true, user: userWithLoginDate };

    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Error al iniciar sesión",
        };
    }
}

// ✅ REGISTER CORREGIDO
export async function register(name, email, password) {
    try {
        const response = await http.post(
            "/auth/register",
            { displayName: name, email, password },
            { withCredentials: true } // 🔥 IMPORTANTE
        );

        const { user } = response.data;

        if (user) {
            const userWithLoginDate = {
                ...user,
                loginDate: new Date().toISOString(),
            };

            // ✅ guardar usuario
            localStorage.setItem("userData", JSON.stringify(userWithLoginDate));

            return { success: true, user: userWithLoginDate };
        }

        return { success: false, error: "Respuesta inválida del servidor" };

    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Error al registrarse",
        };
    }
}

// ✅ LOGOUT CORREGIDO
export async function logout(forceReload = true) {
    try {
        await http.post("/auth/logout", {}, { withCredentials: true });
    } catch (e) {
        console.error("Logout error", e);
    } finally {
        // 🔥 limpiar sesión local SIEMPRE
        localStorage.removeItem("userData");

        if (forceReload) {
            window.location.href = "/login";
        }
    }
}

// ✅ OBTENER USUARIO
export function getCurrentUser() {
    try {
        const userData = localStorage.getItem("userData");
        return userData ? JSON.parse(userData) : null;
    } catch {
        return null;
    }
}

// ✅ VALIDACIÓN SIMPLE (frontend)
export function isAuthenticated() {
    return !!localStorage.getItem("userData");
}