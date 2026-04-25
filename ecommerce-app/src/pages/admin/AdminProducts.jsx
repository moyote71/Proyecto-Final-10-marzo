import { useEffect, useState } from "react";
import { http } from "../../services/http";
import { useAuth } from "../../context/AuthContext";
import { Navigate, Link } from "react-router-dom";

export default function AdminProducts() {
    const { user, isAuthenticated } = useAuth();

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        imagesUrl: [""],
    });

    const [editingId, setEditingId] = useState(null);

    /* =========================
       LOAD DATA
    ========================= */
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await http.get("/products");
            setProducts(res.data?.products || []);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await http.get("/categories");
            setCategories(res.data || []);
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    /* =========================
       SUBMIT
    ========================= */
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!form.name || !form.description || !form.price || !form.stock) {
            alert("Completa todos los campos");
            return;
        }

        if (!form.category) {
            alert("Selecciona una categoría");
            return;
        }

        const payload = {
            name: form.name.trim(),
            description: form.description.trim(),
            price: Number(form.price),
            stock: Number(form.stock),
            category: form.category,
            imagesUrl:
                form.imagesUrl?.filter(img => img.trim()).length > 0
                    ? form.imagesUrl.filter(img => img.trim())
                    : ["https://placehold.co/600x400.png"],
        };

        try {
            setSaving(true);

            if (editingId) {
                await http.put(`/products/${editingId}`, payload);
            } else {
                await http.post("/products", payload);
            }

            setForm({
                name: "",
                description: "",
                price: "",
                stock: "",
                category: "",
                imagesUrl: [""],
            });

            setEditingId(null);
            fetchProducts();

        } catch (err) {
            console.error("ERROR BACKEND:", err.response?.data || err);
            alert("Error al guardar producto");
        } finally {
            setSaving(false);
        }
    };

    /* ========================= */
    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar producto?")) return;

        try {
            await http.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) {
            console.error(err);
        }
    };

    /* ========================= */
    const handleEdit = (p) => {
        setEditingId(p._id);
        setForm({
            name: p.name,
            description: p.description,
            price: p.price,
            stock: p.stock,
            category: p.category?._id || p.category,
            imagesUrl: p.imagesUrl || [""],
        });
    };

    /* ========================= */
    if (!isAuthenticated || user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="p-6">

            {/* NAV */}
            <nav className="mb-6 flex gap-4">
                <Link to="/admin" className="text-blue-600 font-semibold">
                    Usuarios
                </Link>
                <Link to="/admin/products" className="text-blue-600 font-semibold">
                    Productos
                </Link>
            </nav>

            <h1 className="text-2xl font-bold mb-4">
                Gestión de Productos
            </h1>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-2 mb-8">

                <input placeholder="Nombre"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border p-2 w-full"
                />

                <input placeholder="Descripción"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="border p-2 w-full"
                />

                <input type="number" placeholder="Precio"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="border p-2 w-full"
                />

                <input type="number" placeholder="Stock"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="border p-2 w-full"
                />

                <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="border p-2 w-full"
                >
                    <option value="">Selecciona categoría</option>
                    {categories.map(c => (
                        <option key={c._id} value={c._id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                <button
                    disabled={saving}
                    className="bg-blue-600 text-white px-4 py-2"
                >
                    {saving
                        ? "Guardando..."
                        : editingId
                            ? "Actualizar"
                            : "Crear Producto"}
                </button>
            </form>

            {/* LIST */}
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table className="w-full border">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Precio</th>
                            <th>Stock</th>
                            <th>Categoría</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p._id}>
                                <td>{p.name}</td>
                                <td>${p.price}</td>
                                <td>{p.stock}</td>
                                <td>{p.category?.name || "N/A"}</td>
                                <td className="space-x-2">
                                    <button onClick={() => handleEdit(p)}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDelete(p._id)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}