import React, { createContext, useContext, useState, useEffect } from "react";
import { login as authLogin, logout as authLogout, register as authRegister, getCurrentUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        // Inicializar estado del usuario desde localStorage al montar
        const currentUser = getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const result = await authLogin(email, password);
        if (result.success) {
            setUser(result.user);
            navigate("/");
            return { success: true };
        }
        return result;
    };

    const register = async (name, email, password) => {
        const result = await authRegister(name, email, password);
        if (result.success) {
            setUser(result.user);
            navigate("/");
            return { success: true };
        }
        return result;
    };

    const logout = async () => {
        setUser(null);
        await authLogout(false); // Pasamos un flag para no forzar reload
        navigate("/login");
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
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
