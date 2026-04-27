import React, { createContext, useContext, useState, useEffect } from "react";
import { login as authLogin, register as authRegister } from "../utils/auth";
import { http } from "../services/http";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const isAuthenticated = !!user;
    const isAdmin = user?.role === "admin";

    /* =========================
       CHECK AUTH (COOKIE SESSION)
    ========================= */
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await http.get("/users/profile");

                setUser(res?.data?.user || null);
            } catch (error) {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    /* =========================
       LOGIN
    ========================= */
    const login = async (email, password) => {
        const result = await authLogin(email, password);

        if (result.success) {
            try {
                const res = await http.get("/users/profile");
                setUser(res?.data?.user || null);
            } catch {
                setUser(null);
            }

            navigate("/");
        }

        return result;
    };

    /* =========================
       REGISTER
    ========================= */
    const register = async (name, email, password) => {
        const result = await authRegister(name, email, password);

        if (result.success) {
            try {
                const res = await http.get("/users/profile");
                setUser(res?.data?.user || null);
            } catch {
                setUser(null);
            }

            navigate("/");
        }

        return result;
    };

    /* =========================
       LOGOUT
    ========================= */
    const logout = async () => {
        try {
            await http.post("/auth/logout");
        } catch (e) {
            console.error("Logout error:", e);
        } finally {
            setUser(null);
            navigate("/login");
        }
    };

    if (loading) {
        return <div className="p-4 text-center">Cargando...</div>;
    }

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                login,
                register,
                logout,
                isAuthenticated,
                isAdmin,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth debe estar dentro de AuthProvider");
    }

    return context;
}