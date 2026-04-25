    import { useQuery } from "@tanstack/react-query";
    import { Navigate } from "react-router-dom";
    import { useAuth } from "../../context/AuthContext";
    import { http } from "../../services/http";
    import { Link } from "react-router-dom";

    const fetchUsers = async () => {
        const res = await http.get("/users");
        return res.data?.users || [];
    };

    <nav className="mb-6 flex gap-4">
        <Link to="/admin" className="text-blue-600">Usuarios</Link>
        <Link to="/admin/products" className="text-blue-600">Productos</Link>
    </nav>

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
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Panel de Control: Administrador</h1>
                
                <section className="bg-white rounded-lg shadow-sm border p-6">
                    <h2 className="text-xl font-semibold mb-4 text-gray-700">Gestión de Usuarios</h2>
                    
                    {isLoading ? (
                        <p className="text-gray-500">Cargando base de clientes...</p>
                    ) : error ? (
                        <p className="text-red-500">Error al cargar listado. (Valida tus permisos de administrador)</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left border-collapse">
                                <thead>
                                    <tr className="border-b-2">
                                        <th className="p-3 text-gray-600">Nombre</th>
                                        <th className="p-3 text-gray-600">Email</th>
                                        <th className="p-3 text-gray-600">Rol</th>
                                        <th className="p-3 text-gray-600">Registro</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {users.map(u => (
                                        <tr key={u._id} className="border-b hover:bg-gray-50">
                                            <td className="p-3 font-medium">{u.displayName}</td>
                                            <td className="p-3 text-gray-600">{u.email}</td>
                                            <td className="p-3">
                                                <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 'bg-green-100 text-green-700'}`}>
                                                    {u.role.toUpperCase()}
                                                </span>
                                            </td>
                                            <td className="p-3 text-sm text-gray-500">{new Date(u.createdAt).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </section>
            </div>
        );
    }
