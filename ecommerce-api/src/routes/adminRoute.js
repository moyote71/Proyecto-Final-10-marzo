import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function AdminRoute({ children }) {
    const { user, loading, isAdmin } = useAuth();

    if (!isAdmin) return <Navigate to="/" />;

    if (!user || user.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return children;
}