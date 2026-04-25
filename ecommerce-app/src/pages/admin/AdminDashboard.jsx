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
        <div>

            <h1 className="text-2xl font-bold mb-6">
                Gestión de Usuarios
            </h1>

            {isLoading ? (
                <p>Cargando...</p>
            ) : error ? (
                <p className="text-red-500">Error al cargar usuarios</p>
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