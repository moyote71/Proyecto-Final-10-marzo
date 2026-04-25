import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../../context/CartContext";
import Badge from "../common/Bagde";
import Button from "../common/Button";
import {
    getWishList,
    addToWishList,
    removeFromWishList,
} from "../../services/wishListService";
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

    const wishlist = Array.isArray(wishlistData) ? wishlistData : [];

    const inWishList = wishlist.some((item) => {
        const itemId = item?.product?._id || item?.product || item?._id;
        return itemId === product?._id;
    });

    const toggleMutation = useMutation({
        mutationFn: () =>
            inWishList
                ? removeFromWishList(product?._id)
                : addToWishList(product?._id),
        onSuccess: () => queryClient.invalidateQueries(["wishlist"]),
    });

    if (!product) return null;

    const { name, price, stock, description } = product;

    // Imagen segura
    const productImageUrl =
    Array.isArray(product?.imagesUrl) && product.imagesUrl.length > 0
        ? product.imagesUrl[0]
        : product?.image ||
          "https://placehold.co/800x600?text=Producto";

    // Categoría segura
    const categoryLink =
        product?.category?.slug ||
        product?.category?._id ||
        null;

    return (
        <div
            className={`rounded-xl p-4 flex shadow-md bg-white border relative ${
                orientation === "horizontal"
                    ? "md:flex-row flex-col gap-4"
                    : "flex-col gap-4"
            }`}
        >
            {/* Wishlist */}
            {isAuthenticated && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleMutation.mutate();
                    }}
                    className="absolute top-2 right-2 z-10 text-2xl bg-white/70 rounded-full w-8 h-8 flex items-center justify-center"
                >
                    {inWishList ? "❤️" : "🤍"}
                </button>
            )}

            {/* Imagen */}
            <Link to={`/product/${product?._id}`}>
                <img
                    src={productImageUrl}
                    alt={name}
                    className={`object-cover rounded-lg border ${
                        orientation === "horizontal"
                            ? "w-40 h-40"
                            : "w-full h-56"
                    }`}
                    onError={(e) => {
                        e.target.src =
                            "https://placehold.co/800x600?text=Producto";
                    }}
                />
            </Link>

            {/* Content */}
            <div className="flex flex-col flex-1">
                <h3 className="text-lg font-semibold">
                    <Link to={`/product/${product?._id}`}>{name}</Link>
                </h3>

                {/* Categoría */}
                {product?.category && categoryLink && (
                    <Link
                        to={`/categories/${categoryLink}`}
                        className="text-xs text-blue-500 mb-1"
                    >
                        {product.category.name}
                    </Link>
                )}

                <p className="text-sm text-gray-500 mb-2">
                    {description?.slice(0, 60)}
                </p>

                <div className="text-xl font-bold text-teal-500 mb-2">
                    ${price}
                </div>

                <div className="flex justify-between items-center mt-auto">
                    <Badge
                        text={stock > 0 ? "En stock" : "Agotado"}
                        variant={stock > 0 ? "success" : "error"}
                    />

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