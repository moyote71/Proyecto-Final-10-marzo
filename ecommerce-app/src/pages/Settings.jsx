import { useAuth } from "../context/AuthContext";

export default function Settings() {
    const { user } = useAuth();

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6 text-gray-800">Configuración</h1>

            <section className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Cuenta</h2>
                <div className="space-y-3 text-gray-600">
                    <p>
                        <strong>Nombre:</strong>{" "}
                        {user?.displayName || user?.name || "No disponible"}
                    </p>
                    <p>
                        <strong>Email:</strong>{" "}
                        {user?.email || "No disponible"}
                    </p>
                    <p>
                        <strong>Rol:</strong>{" "}
                        <span className="px-2 py-1 rounded text-xs font-bold bg-blue-100 text-blue-700">
                            {user?.role?.toUpperCase() || "USUARIO"}
                        </span>
                    </p>
                </div>
            </section>

            <section className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-700">Preferencias</h2>
                <p className="text-gray-500 text-sm">
                    Las preferencias adicionales estarán disponibles próximamente.
                </p>
            </section>
        </div>
    );
}
