import { http } from "../services/http";

/* =========================
   LOGIN
========================= */
export async function login(email, password) {
    try {
        const response = await http.post(
            "/auth/login",
            { email, password },
            { withCredentials: true }
        );

        return {
            success: true,
            user: response.data.user,
        };
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

/* =========================
   REGISTER
========================= */
export async function register(name, email, password) {
    try {
        const response = await http.post(
            "/auth/register",
            { displayName: name, email, password },
            { withCredentials: true }
        );

        return {
            success: true,
            user: response.data.user,
        };
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

/* =========================
   LOGOUT
========================= */
export async function logout() {
    try {
        await http.post("/auth/logout", {}, { withCredentials: true });
    } catch (error) {
        console.error("Logout error:", error);
    }
}