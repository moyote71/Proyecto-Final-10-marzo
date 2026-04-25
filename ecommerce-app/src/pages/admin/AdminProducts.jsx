import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
    getAllProductsAdmin,
    createProduct,
    updateProduct,
    deleteProduct
} from "../../services/adminProductService";
import { useAuth } from "../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function AdminProducts() {
    const { user, isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    const [form, setForm] = useState({
        name: "",
        price: 0,
        stock: 0,
        description: "",
        image: ""
    });

    const [editingId, setEditingId] = useState(null);

    /* =========================
       GUARD
    ========================= */
    if (!isAuthenticated || user?.role !== "admin") {
        return <Navigate to="/" replace />;
    }

    /* =========================
       GET PRODUCTS
    ========================= */
    const { data: products = [] } = useQuery({
        queryKey: ["admin_products"],
        queryFn: getAllProductsAdmin,
    });

    /* =========================
       CREATE / UPDATE
    ========================= */
    const mutation = useMutation({
        mutationFn: (data) =>
            editingId
                ? updateProduct(editingId, data)
                : createProduct(data),

        onSuccess: () => {
            queryClient.invalidateQueries(["admin_products"]);
            setForm({
                name: "",
                price: 0,
                stock: 0,
                description: "",
                image: ""
            });
            setEditingId(null);
        }
    });

    /* =========================
       DELETE
    ========================= */
    const deleteMutation = useMutation({
        mutationFn: deleteProduct,
        onSuccess: () => {
            queryClient.invalidateQueries(["admin_products"]);
        }
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        mutation.mutate(form);
    };

    const handleEdit = (product) => {
        setForm(product);
        setEditingId(product._id);
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Admin - Productos</h1>

            {/* FORM */}
            <form onSubmit={handleSubmit} className="grid gap-2 mb-6">
                <input
                    placeholder="Nombre"
                    value={form.name}
                    onChange={(e) =>
                        setForm({ ...form, name: e.target.value })
                    }
                />

                <input
                    type="number"
                    placeholder="Precio"
                    value={form.price}
                    onChange={(e) =>
                        setForm({ ...form, price: Number(e.target.value) })
                    }
                />

                <input
                    type="number"
                    placeholder="Stock"
                    value={form.stock}
                    onChange={(e) =>
                        setForm({ ...form, stock: Number(e.target.value) })
                    }
                />

                <input
                    placeholder="Imagen URL"
                    value={form.image}
                    onChange={(e) =>
                        setForm({ ...form, image: e.target.value })
                    }
                />

                <textarea
                    placeholder="Descripción"
                    value={form.description}
                    onChange={(e) =>
                        setForm({ ...form, description: e.target.value })
                    }
                />

                <button type="submit">
                    {editingId ? "Actualizar" : "Crear"}
                </button>
            </form>

            {/* LISTA */}
            <div className="grid gap-4">
                {products.map((p) => (
                    <div
                        key={p._id}
                        className="border p-3 rounded flex justify-between"
                    >
                        <div>
                            <p className="font-bold">{p.name}</p>
                            <p>${p.price}</p>
                            <p>Stock: {p.stock}</p>
                        </div>

                        <div className="flex gap-2">
                            <button onClick={() => handleEdit(p)}>
                                Editar
                            </button>

                            <button
                                onClick={() =>
                                    deleteMutation.mutate(p._id)
                                }
                            >
                                Eliminar
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}