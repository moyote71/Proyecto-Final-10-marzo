import { Link, Outlet, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function AdminLayout() {
    const { user, isAuthenticated } = useAuth();
    const location = useLocation();

    if (!isAuthenticated || user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    const isActive = (path) =>
        location.pathname === path
            ? "bg-blue-600 text-white"
            : "bg-gray-100 hover:bg-gray-200";

    return (
        <div className="min-h-screen bg-gray-50">

            {/* HEADER */}
            <header className="bg-white shadow p-4 flex justify-between">
                <h1 className="font-bold text-lg">Admin Panel</h1>

                <Link to="/" className="text-red-600 font-semibold">
                    Salir
                </Link>
            </header>

            <div className="flex">

                {/* SIDEBAR */}
                <aside className="w-64 bg-white border-r p-4 space-y-2">

                    <Link
                        to="/admin"
                        className={`block px-4 py-2 rounded ${isActive("/admin")}`}
                    >
                        👤 Usuarios
                    </Link>

                    <Link
                        to="/admin/products"
                        className={`block px-4 py-2 rounded ${isActive("/admin/products")}`}
                    >
                        📦 Productos
                    </Link>

                </aside>

                {/* CONTENIDO DINÁMICO */}
                <main className="flex-1 p-6">
                    <Outlet />
                </main>

            </div>
        </div>
    );
}