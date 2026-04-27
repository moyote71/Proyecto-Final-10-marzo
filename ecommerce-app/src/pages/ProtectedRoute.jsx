import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({
    children,
    redirectTo = "/login",
    allowedRoles,
}) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="p-4 text-center">
                Cargando...
            </div>
        );
    }

    if (!user) {
        return <Navigate to={redirectTo} replace />;
    }

    if (
        allowedRoles &&
        !allowedRoles.includes(user.role)
    ) {
        return <Navigate to="/" replace />;
    }

    return children;
}