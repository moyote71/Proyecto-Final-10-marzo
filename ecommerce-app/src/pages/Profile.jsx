import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
    const { user, isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="max-w-2xl mx-auto mt-10 bg-white shadow rounded-lg p-6">

            <h1 className="text-2xl font-bold mb-6">Mi Cuenta</h1>

            {/* INFO */}
            <div className="space-y-3 mb-6">
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Nombre:</strong> {user?.displayName}</p>
                <p><strong>Estado:</strong> Activo</p>
                <p><strong>Última conexión:</strong> No disponible</p>
            </div>

            <h2 className="text-lg font-semibold mb-4">Acciones de la cuenta</h2>

            <div className="space-y-3">

                {/* EDITAR PERFIL */}
                <Link
                    to="/settings"
                    className="block text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg"
                >
                    Editar Perfil
                </Link>

                {/* CAMBIAR CONTRASEÑA */}
                <Link
                    to="/settings"
                    className="block text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg"
                >
                    Cambiar contraseña
                </Link>

                {/* PEDIDOS */}
                <Link
                    to="/orders"
                    className="block text-center bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 rounded-lg"
                >
                    Ver todos los pedidos
                </Link>

                {/* ADMIN (SOLO SI ES ADMIN) */}
                {user?.role === "admin" && (
                    <Link
                        to="/admin"
                        className="block text-center bg-gradient-to-r from-purple-700 to-purple-900 text-white py-3 rounded-lg"
                    >
                        Panel de administración
                    </Link>
                )}

            </div>
        </div>
    );
}