import React, { createContext, useContext, useState, useEffect } from "react";
import { login as authLogin, register as authRegister } from "../utils/auth";
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
                const res = await http.get("/users/profile", {
                    withCredentials: true,
                });

                setUser(res?.data?.user || null);
            } catch (err) {
                // 🔥 IMPORTANTE: NO CRASH NI REDIRECCIÓN
                setUser(null);
                console.warn("No autenticado");
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
                const res = await http.get("/users/profile", {
                    withCredentials: true,
                });

                setUser(res?.data?.user || null);
            } catch {
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

                setUser(res?.data?.user || null);
            } catch {
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
        } catch {}

        setUser(null);
        navigate("/login");
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user, // 🔥 OK
    };

    if (loading) return <div className="p-4 text-center">Cargando...</div>;

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error("useAuth debe estar dentro de AuthProvider");
    return context;
}