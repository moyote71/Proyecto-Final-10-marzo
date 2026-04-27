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

export default function ProductCard({ product, orientation = "vertical" }) {
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const queryClient = useQueryClient();

    const productId = product?._id?.toString();

    /* =========================
       WISHLIST QUERY (OPTIMIZADO)
    ========================= */
    const { data: wishlistData } = useQuery({
        queryKey: ["wishlist"],
        queryFn: getWishList,
        enabled: isAuthenticated,
        retry: false,
    });

    /* =========================
       NORMALIZACIÓN ROBUSTA
    ========================= */
    const wishlist = Array.isArray(wishlistData)
        ? wishlistData
        : wishlistData?.products || [];

    const inWishList = wishlist.some((item) => {
        const id =
            item?.product?._id?.toString() ||
            item?.product?.toString() ||
            item?._id?.toString();

        return id === productId;
    });

    /* =========================
       TOGGLE WISHLIST
    ========================= */
    const toggleMutation = useMutation({
        mutationFn: async () => {
            if (!productId) return;

            return inWishList
                ? removeFromWishList(productId)
                : addToWishList(productId);
        },
        onSuccess: () => {
            queryClient.invalidateQueries(["wishlist"]);
        },
    });

    if (!product) return null;

    const { name, price, stock, description } = product;

    const productImageUrl =
        Array.isArray(product?.imagesUrl) && product.imagesUrl.length > 0
            ? product.imagesUrl[0]
            : "https://placehold.co/800x600?text=Producto";

    return (
        <div className="relative rounded-xl p-4 flex shadow-md bg-white border">

            {/* ❤️ WISHLIST BUTTON */}
            {isAuthenticated && (
                <button
                    onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        toggleMutation.mutate();
                    }}
                    className={`absolute top-2 right-2 z-10 text-2xl transition-transform hover:scale-110 ${
                        inWishList ? "text-red-500" : "text-gray-400"
                    }`}
                >
                    {inWishList ? "❤️" : "🤍"}
                </button>
            )}

            {/* IMAGE */}
            <Link to={`/product/${productId}`}>
                <img
                    src={productImageUrl}
                    alt={name}
                    className="w-40 h-40 object-cover rounded-lg"
                    onError={(e) => {
                        e.target.src =
                            "https://placehold.co/800x600?text=Producto";
                    }}
                />
            </Link>

            {/* CONTENT */}
            <div className="ml-4 flex flex-col flex-1">
                <h3 className="font-semibold">{name}</h3>

                <p className="text-sm text-gray-500">
                    {description?.slice(0, 60)}
                </p>

                <div className="text-teal-500 font-bold">${price}</div>

                <div className="mt-auto flex justify-between items-center">
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