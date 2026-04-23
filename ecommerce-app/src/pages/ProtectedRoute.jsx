import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, redirectTo = "/login", allowedRoles }) {
    const { user, loading } = useAuth();

    // 🛑 ESPERAR a que termine la validación
    if (loading) return null;

    // 🚫 No autenticado
    if (!user) {
        return <Navigate to={redirectTo} replace />;
    }

    // 🔐 Validar roles (si aplica)
    if (allowedRoles && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}