import { useEffect, useState } from "react";
import { http } from "../../services/http";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

const CLOUDINARY_URL =
    "https://api.cloudinary.com/v1_1/dgi0wu8bl/image/upload";
const CLOUDINARY_PRESET = "ecommerce_upload";

export default function AdminProducts() {
    const { user, isAuthenticated } = useAuth();

    const [categories, setCategories] = useState([]);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploading, setUploading] = useState(false);

    const initialForm = {
        name: "",
        description: "",
        price: "",
        stock: "",
        category: "",
        imagesUrl: [],
    };

    const [form, setForm] = useState(initialForm);
    const [editingId, setEditingId] = useState(null);

    /* =========================
       LOAD DATA
    ========================= */
    const fetchProducts = async () => {
        try {
            setLoading(true);
            const res = await http.get("/products");

            const data = res.data?.products || res.data;
            setProducts(Array.isArray(data) ? data : []);
        } catch (err) {
            console.error("Error loading products:", err);
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const res = await http.get("/categories");
            setCategories(Array.isArray(res.data) ? res.data : []);
        } catch (err) {
            console.error("Error loading categories:", err);
        }
    };

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);

    /* =========================
       CLOUDINARY UPLOAD
    ========================= */
    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        // 🔥 seguridad básica
        if (file.size > 2 * 1024 * 1024) {
            alert("La imagen es muy grande (máx 2MB)");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", CLOUDINARY_PRESET);

        try {
            setUploading(true);

            const res = await fetch(CLOUDINARY_URL, {
                method: "POST",
                body: formData,
            });

            const data = await res.json();

            if (!data.secure_url) {
                throw new Error("Upload failed");
            }

            setForm((prev) => ({
                ...prev,
                imagesUrl: [...(prev.imagesUrl || []), data.secure_url],
            }));
        } catch (err) {
            console.error("Cloudinary upload error:", err);
            alert("Error subiendo imagen");
        } finally {
            setUploading(false);
        }
    };

    /* =========================
       RESET FORM
    ========================= */
    const resetForm = () => {
        setForm(initialForm);
        setEditingId(null);
    };

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
            imagesUrl: form.imagesUrl?.filter(Boolean)?.length
                ? form.imagesUrl.filter(Boolean)
                : ["https://placehold.co/600x400.png"],
        };

        try {
            setSaving(true);

            if (editingId) {
                await http.put(`/products/${editingId}`, payload);
            } else {
                await http.post("/products", payload);
            }

            resetForm();
            await fetchProducts();
        } catch (err) {
            console.error("ERROR BACKEND:", err.response?.data || err);
            alert("Error al guardar producto");
        } finally {
            setSaving(false);
        }
    };

    /* =========================
       DELETE
    ========================= */
    const handleDelete = async (id) => {
        if (!window.confirm("¿Eliminar producto?")) return;

        try {
            await http.delete(`/products/${id}`);
            if (editingId === id) resetForm();
            await fetchProducts();
        } catch (err) {
            console.error("Error deleting product:", err);
        }
    };

    /* =========================
       EDIT
    ========================= */
    const handleEdit = (p) => {
        setEditingId(p._id);

        setForm({
            name: p.name || "",
            description: p.description || "",
            price: p.price || "",
            stock: p.stock || "",
            category: p.category?._id || p.category || "",
            imagesUrl: p.imagesUrl || [],
        });
    };

    /* =========================
       AUTH
    ========================= */
    if (!isAuthenticated || user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">
                Gestión de Productos
            </h1>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="space-y-2 mb-8">

                <input
                    placeholder="Nombre"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                    className="border p-2 w-full"
                />

                <input
                    placeholder="Descripción"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                    className="border p-2 w-full"
                />

                <input
                    type="number"
                    placeholder="Precio"
                    value={form.price}
                    onChange={(e) =>
                        setForm({ ...form, price: e.target.value })
                    }
                    className="border p-2 w-full"
                />

                <input
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={(e) =>
                        setForm({ ...form, stock: e.target.value })
                    }
                    className="border p-2 w-full"
                />

                <select
                    value={form.category}
                    onChange={(e) =>
                        setForm({ ...form, category: e.target.value })
                    }
                    className="border p-2 w-full"
                >
                    <option value="">Selecciona categoría</option>
                    {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                            {c.name}
                        </option>
                    ))}
                </select>

                {/* UPLOAD IMAGE */}
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="border p-2 w-full"
                />

                {uploading && (
                    <p className="text-sm text-blue-500">
                        Subiendo imagen...
                    </p>
                )}

                {/* PREVIEW */}
                <div className="flex gap-2 flex-wrap">
                    {form.imagesUrl?.map((img, i) => (
                        <img
                            key={i}
                            src={img}
                            alt="preview"
                            className="w-16 h-16 object-cover rounded"
                        />
                    ))}
                </div>

                <div className="flex gap-2">
                    <button
                        disabled={saving}
                        className="bg-blue-600 text-white px-4 py-2"
                    >
                        {saving
                            ? "Guardando..."
                            : editingId
                            ? "Actualizar"
                            : "Crear"}
                    </button>

                    {editingId && (
                        <button
                            type="button"
                            onClick={resetForm}
                            className="bg-gray-500 text-white px-4 py-2"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>

            {/* LIST */}
            {loading ? (
                <p>Cargando...</p>
            ) : products.length === 0 ? (
                <p>No hay productos</p>
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
                        {products.map((p) => (
                            <tr key={p._id} className="border-t">
                                <td>{p.name}</td>
                                <td>${p.price}</td>
                                <td>{p.stock}</td>
                                <td>{p.category?.name || "N/A"}</td>

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