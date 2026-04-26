import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import ProductDetailsCard from "../components/ProductDetails/ProductDetailsCard";
import * as ProductDetailsStyles from "./ProductDetailsStyles";

import { http } from "../services/http";
import { addToWishList } from "../services/wishListService";

/* =========================
   FETCH PRODUCT
========================= */
const fetchProduct = async (id) => {
    const res = await http.get(`/products/${id}`);
    return res.data;
};

export default function ProductDetails() {
    const { productId } = useParams();
    const queryClient = useQueryClient();

    /* =========================
       VALIDATE ID
    ========================= */
    const isValidId = /^[a-f\d]{24}$/i.test(productId);

    /* =========================
       PRODUCT QUERY
    ========================= */
    const {
        data: product,
        isLoading,
        error,
    } = useQuery({
        queryKey: ["product", productId],
        queryFn: () => fetchProduct(productId),
        enabled: isValidId,
    });

    /* =========================
       WISHLIST MUTATION
    ========================= */
    const wishlistMutation = useMutation({
        mutationFn: addToWishList,
        onSuccess: () => {
            queryClient.invalidateQueries(["wishlist"]);
            alert("❤️ Producto agregado a wishlist");
        },
        onError: (err) => {
            console.error(err);
            alert(err.response?.data?.message || "Error al agregar a wishlist");
        },
    });

    /* =========================
       UI STATES
    ========================= */
    if (!isValidId) {
        return (
            <div className={ProductDetailsStyles.invalidId()}>
                ID de producto inválido.
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className={ProductDetailsStyles.page()}>
                <p>Cargando producto...</p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className={ProductDetailsStyles.page()}>
                <p>Error cargando producto</p>
            </div>
        );
    }

    /* =========================
       RENDER
    ========================= */
    return (
        <div className={ProductDetailsStyles.page()}>

            {/* CARD ORIGINAL */}
            <ProductDetailsCard productId={productId} />

            {/* 🔥 WISHLIST BUTTON */}
            <div className="mt-4">
                <button
                    onClick={() => wishlistMutation.mutate(product._id)}
                    disabled={wishlistMutation.isPending}
                    className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded"
                >
                    {wishlistMutation.isPending
                        ? "Agregando..."
                        : "❤️ Agregar a Wishlist"}
                </button>
            </div>

        </div>
    );
}