import { useQuery } from "@tanstack/react-query";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { http } from "../../services/http";

/* =========================
   FETCH USERS
========================= */
const fetchUsers = async () => {
    const res = await http.get("/users");
    return res.data?.users || [];
};

export default function AdminDashboard() {

    const { user, isAuthenticated } = useAuth();

    const { data: users = [], isLoading, error } = useQuery({
        queryKey: ["admin_users"],
        queryFn: fetchUsers,
        enabled: user?.role === "admin",
    });

    /* =========================
       AUTH GUARD
    ========================= */
    if (!isAuthenticated || user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return (
        <div>

            <h1 className="text-2xl font-bold mb-6">
                Panel de Usuarios
            </h1>

            {isLoading ? (
                <p>Cargando...</p>
            ) : error ? (
                <p className="text-red-500">
                    Error al cargar usuarios
                </p>
            ) : (
                <table className="w-full border">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Email</th>
                            <th>Rol</th>
                        </tr>
                    </thead>

                    <tbody>
                        {users.map(u => (
                            <tr key={u._id}>
                                <td>{u.displayName}</td>
                                <td>{u.email}</td>
                                <td>{u.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}