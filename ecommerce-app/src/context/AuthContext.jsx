import React, { createContext, useContext, useState, useEffect } from "react";
import { login as authLogin, logout as authLogout, register as authRegister } from "../utils/auth";
import { http } from "../services/http";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // ✅ SOLO intentar si hay cookies (sesión previa)
                const res = await http.get("/users/profile", {
                     withCredentials: true,
                });
                setUser(res.data.user);
            } catch (error) {
                // ✅ NO logs innecesarios ni romper flujo
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (email, password) => {
    const result = await authLogin(email, password);

    if (result.success) {
        try {
            // 🔥 pedir usuario REAL ya autenticado con cookie
            const res = await http.get("/users/profile", {
                withCredentials: true,
            });

            setUser(res.data.user);
        } catch (error) {
            console.error("Error obteniendo perfil:", error);
            setUser(null);
        }

        navigate("/");
        return { success: true };
    }

    return result;
};

        const register = async (name, email, password) => {
        const result = await authRegister(name, email, password);

        if (result.success) {
            try {
                const res = await http.get("/users/profile", {
                    withCredentials: true,
                });

                setUser(res.data.user);
            } catch (error) {
                console.error("Error obteniendo perfil:", error);
                setUser(null);
            }

            navigate("/");
            return { success: true };
        }

        return result;
    };

    const logout = async () => {
        try {
                await http.post("/auth/logout", {}, { withCredentials: true });
        } catch (e) {
            console.error(e);
        }
        setUser(null);
        navigate("/login"); // ✅ opcional pero recomendable
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user, // ✅ boolean correcto
    };

    // ✅ IMPORTANTE: evita pantalla en blanco total
    if (loading) {
        return <div className="p-4 text-center">Cargando...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe estar dentro del proveedor AuthProvider");
    }

    return context;
}