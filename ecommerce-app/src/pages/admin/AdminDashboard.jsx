import { useQuery } from "@tanstack/react-query";
import { Navigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { http } from "../../services/http";

const fetchUsers = async () => {
    const res = await http.get("/users");
    return res.data?.users || [];
};

export default function AdminDashboard() {

    const { user, isAuthenticated, isAdmin } = useAuth();

    const { data: users = [], isLoading, error } = useQuery({
        queryKey: ["admin_users"],
        queryFn: fetchUsers,
        enabled: user?.role === "admin"
    });

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="container mx-auto px-4 py-8">

            <h1 className="text-3xl font-bold mb-8">
                Panel de Administración
            </h1>

            <nav className="mb-6 flex gap-4">
                <Link to="/admin" className="text-blue-600 font-semibold">
                    Usuarios
                </Link>
                <Link to="/admin/products" className="text-blue-600 font-semibold">
                    Productos
                </Link>
            </nav>

            <section className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4">
                    Usuarios
                </h2>

                {isLoading ? (
                    <p>Cargando...</p>
                ) : error ? (
                    <p className="text-red-500">Error al cargar</p>
                ) : (
                    <table className="w-full">
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
            </section>
        </div>
    );
}