import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../../context/CartContext";
import Badge from "../common/Bagde";
import Button from "../common/Button";
import { getWishList, addToWishList, removeFromWishList } from "../../services/wishListService";
import { useAuth } from "../../context/AuthContext";
import formatImageUrl from "../../utils/formatImageUrl";

export default function ProductCard({ product, orientation = "vertical" }) {
    const { addToCart } = useCart();
    const { isAuthenticated, loading } = useAuth();
    const queryClient = useQueryClient();

    const { data: wishlistData } = useQuery({
        queryKey: ["wishlist"],
        queryFn: getWishList,
        enabled: isAuthenticated && !loading,
    });

    // 🔥 DEFENSA EXTREMA: Asegurar que wishlist sea SIEMPRE un array
    const wishlist = Array.isArray(wishlistData) ? wishlistData : [];

    // Ahora es 100% seguro llamar a .some()
    const inWishList = wishlist.some(
        item => {
            const itemId = item?.product?._id || item?.product || item?._id;
            return itemId === product?._id;
        }
    );

    const toggleMutation = useMutation({
        mutationFn: () =>
            inWishList
                ? removeFromWishList(product?._id)
                : addToWishList(product?._id),
        onSuccess: () => queryClient.invalidateQueries(["wishlist"]),
    });

    if (loading) return null;

    if (!product) {
        return (
            <div className="p-6 text-center border rounded-lg bg-white shadow-md">
                <p className="text-gray-500">Producto no disponible</p>
            </div>
        );
    }

    const { name, price, stock, imagesUrl, description } = product;
    const productImageUrl = formatImageUrl(
         product.image || product.imagesUrl?.[0] || "https://placehold.co/800x600?text=Producto"
    );
    return (
        <div className={`rounded-xl p-4 flex shadow-md bg-white border relative ${
            orientation === "horizontal" ? "md:flex-row flex-col gap-4" : "flex-col gap-4"
        }`}>

            {/* ❤️ Wishlist */}
            {isAuthenticated && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleMutation.mutate();
                    }}
                    className="absolute top-2 right-2 z-10 text-2xl hover:scale-110 transition-transform bg-white/70 rounded-full w-8 h-8 flex items-center justify-center"
                    disabled={toggleMutation.isPending}
                >
                    {inWishList ? "❤️" : "🤍"}
                </button>
            )}

            {/* Imagen */}
            <Link to={`/product/${product._id}`} className="block">
                <img
                    src={productImageUrl}
                    alt={name}
                    className={`object-cover rounded-lg border ${
                        orientation === "horizontal" ? "w-40 h-40" : "w-full h-56"
                    }`}
                    onError={(e) => {
                        e.target.src = "https://placehold.co/800x600?text=Producto";
                    }}
                />
            </Link>

            {/* Contenido */}
            <div className="flex flex-col flex-1">
                <h3 className="text-lg font-semibold mb-1 text-gray-900">
                    <Link to={`/product/${product._id}`} className="hover:text-blue-600">
                        {name}
                    </Link>
                </h3>

                {description && (
                    <p className="text-sm text-gray-500 mb-2">
                        {description.length > 60
                            ? `${description.substring(0, 60)}...`
                            : description}
                    </p>
                )}

                <div className="text-xl font-bold text-teal-500 mb-3">
                    ${price}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between mt-auto">
                    <div className="flex gap-2">
                        <Badge
                            text={stock > 0 ? "En stock" : "Agotado"}
                            variant={stock > 0 ? "success" : "error"}
                        />
                        {product.discount > 0 && (
                            <Badge text={`-${product.discount}%`} variant="warning" />
                        )}
                    </div>

                    <Button
                        variant="primary"
                        size="sm"
                        disabled={stock === 0}
                        onClick={() => addToCart(product, 1)}
                    >
                        Agregar
                    </Button>
                </div>
            </div>
        </div>
    );
}