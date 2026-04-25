import { useEffect, useState } from "react";
import { http } from "../../services/http";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminProducts() {
    const { user, isAuthenticated } = useAuth();

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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
       LOAD PRODUCTS
    ========================= */
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await http.get("/products");
            setProducts(res.data?.products || []);
        } catch (err) {
            console.error("Error loading products:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    /* =========================
       CREATE / UPDATE
    ========================= */
    const handleSubmit = async (e) => {
    e.preventDefault();

    try {
        const payload = {
            ...form,
            price: Number(form.price),
            stock: Number(form.stock),
            category: form.category?.trim(),
            imagesUrl: Array.isArray(form.imagesUrl)
                ? form.imagesUrl.filter(url => url.trim() !== "")
                : [],
        };

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
            imagesUrl: [],
        });

        setEditingId(null);
        fetchProducts();

    } catch (err) {
        console.error("Error saving product:", err.response?.data || err);
    }
};

    /* =========================
       DELETE PRODUCT
    ========================= */
    const handleDelete = async (id) => {
        try {
            await http.delete(`/products/${id}`);
            fetchProducts();
        } catch (err) {
            console.error("Error deleting product:", err);
        }
    };

    /* =========================
       EDIT PRODUCT
    ========================= */
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

    /* =========================
       AUTH GUARD
    ========================= */
    if (!isAuthenticated || user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin - Products</h1>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-2 mb-8">
                <input
                    placeholder="Name"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border p-2 w-full"
                />

                <input
                    placeholder="Description"
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="border p-2 w-full"
                />

                <input
                    placeholder="Price"
                    type="number"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    className="border p-2 w-full"
                />

                <input
                    placeholder="Stock"
                    type="number"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                    className="border p-2 w-full"
                />

                <input
                    placeholder="Category ID"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="border p-2 w-full"
                />

                <button className="bg-blue-600 text-white px-4 py-2">
                    {editingId ? "Update Product" : "Create Product"}
                </button>
            </form>

            {/* LIST */}
            {loading ? (
                <p>Cargando...</p>
            ) : (
                <table className="w-full border">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Price</th>
                            <th>Stock</th>
                            <th>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {products.map((p) => (
                            <tr key={p._id} className="border-t">
                                <td>{p.name}</td>
                                <td>${p.price}</td>
                                <td>{p.stock}</td>
                                <td className="space-x-2">
                                    <button
                                        onClick={() => handleEdit(p)}
                                        className="bg-yellow-500 px-2"
                                    >
                                        Edit
                                    </button>

                                    <button
                                        onClick={() => handleDelete(p._id)}
                                        className="bg-red-600 text-white px-2"
                                    >
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