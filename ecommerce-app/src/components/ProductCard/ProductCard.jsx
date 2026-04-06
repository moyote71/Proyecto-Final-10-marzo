import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../../context/CartContext";
import Badge from "../common/Bagde";
import Button from "../common/Button";
import ProductCardStyles from "./ProductCardStyles";
import { getWishList, addToWishList, removeFromWishList } from "../../services/wishListService";
import { isAuthenticated } from "../../utils/auth";

export default function ProductCard({ product, orientation = "vertical" }) {
    const { addToCart } = useCart();

    // ✅ Todos los hooks DEBEN llamarse antes de cualquier return condicional
    const queryClient = useQueryClient();
    const { data: wishlist = [] } = useQuery({
        queryKey: ["wishlist"],
        queryFn: getWishList,
        enabled: isAuthenticated(),
    });

    const inWishList = wishlist.some(item => (item.product?._id || item._id) === product?._id);
    const toggleMutation = useMutation({
        mutationFn: () => inWishList ? removeFromWishList(product?._id) : addToWishList(product?._id),
        onSuccess: () => queryClient.invalidateQueries(["wishlist"])
    });

    if (!product) {
        return (
            <div className="p-6 text-center border rounded-lg bg-white shadow-md">
                <p className="text-gray-500">Producto no disponible</p>
            </div>
        );
    }

    const { name, price, stock, imagesUrl, description } = product;

    const stockBadge =
        stock > 0
            ? { text: "En stock", variant: "success" }
            : { text: "Agotado", variant: "error" };

    const hasDiscount = product.discount && product.discount > 0;
    const handleAddToCart = () => addToCart(product, 1);
    const productLink = `/product/${product._id}`;

    return (
        <div className={ProductCardStyles.card({ orientation }) + " relative group"}>
            { isAuthenticated() && (
                <button 
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleMutation.mutate(); }} 
                  className="absolute top-2 right-2 z-10 text-2xl hover:scale-110 transition-transform bg-white/50 rounded-full w-8 h-8 flex items-center justify-center p-0 cursor-pointer"
                  title={inWishList ? "Quitar de favoritos" : "Añadir a favoritos"}
                  disabled={toggleMutation.isPending}
                >
                    {inWishList ? "❤️" : "🤍"}
                </button>
            )}
            {/* Imagen */}
            <Link to={productLink} className="block">
                <img
                    src={product.image || (imagesUrl && imagesUrl[0]) || "https://via.placeholder.com/800x600"}
                    alt={name}
                    className={ProductCardStyles.image({ orientation })}
                    loading="lazy"
                    decoding="async"
                    onError={(event) => {
                        event.target.src = "https://via.placeholder.com/800x600";
                    }}
                />
            </Link>

            {/* Contenido */}
            <div className={ProductCardStyles.content()}>
                <h3 className={ProductCardStyles.title()}>
                    <Link to={productLink} className="hover:text-strongblue">
                        {name}
                    </Link>
                </h3>

                {description && (
                    <p className={ProductCardStyles.description()}>
                        {description.length > 60
                            ? `${description.substring(0, 60)}...`
                            : description}
                    </p>
                )}

                <div className={ProductCardStyles.price()}>
                    ${price}
                </div>

                {/* Badges + Botón */}
                <div className={ProductCardStyles.footer()}>
                    <div className="flex gap-2">
                        <Badge text={stockBadge.text} variant={stockBadge.variant} />
                        {hasDiscount && (
                            <Badge
                                text={`-${product.discount}%`}
                                variant="warning"
                            />
                        )}
                    </div>

                    <Button
                        variant="primary"
                        size="sm"
                        disabled={stock === 0}
                        onClick={handleAddToCart}
                    >
                        Agregar al carrito
                    </Button>
                </div>
            </div>
        </div>
    );
}
