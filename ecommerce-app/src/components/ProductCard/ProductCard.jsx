import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import Badge from "../common/Bagde";
import Button from "../common/Button";
import ProductCardStyles from "./ProductCardStyles";

export default function ProductCard({ product, orientation = "vertical" }) {
    const { addToCart } = useCart();

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
        <div className={ProductCardStyles.card({ orientation })}>
            {/* Imagen */}
            <Link to={productLink} className="block">
                <img
                    src={imagesUrl ? imagesUrl[0] : "/img/products/placeholder.svg"}
                    alt={name}
                    className={ProductCardStyles.image({ orientation })}
                    onError={(event) => {
                        event.target.src = "/img/products/placeholder.svg";
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
