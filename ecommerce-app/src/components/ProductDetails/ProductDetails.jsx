import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../../context/CartContext";
import categoriesData from "../../data/categories.json";
import BreadCrumb from "../../layout/BreadCrumb/BreadCrumb";
import { getProductById } from "../../services/productService";
import Badge from "../common/Bagde";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage/ErrorMessage";
import Loading from "../common/Loading/Loading";

import styles from "./ProductDetailsStyles";

export default function ProductDetails({ productId }) {
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);
        getProductById(productId)
            .then((foundProduct) => {
                if (!foundProduct) setError("Producto no encontrado");
                else setProduct(foundProduct);
            })
            .catch(() => setError("Ocurrió un error al cargar el producto."))
            .finally(() => setLoading(false));
    }, [productId]);

    const resolvedCategory = useMemo(() => {
        if (!product?.category) return null;
        return (
            categoriesData.find((cat) => cat._id === product.category._id) ||
            categoriesData.find(
                (cat) =>
                    cat.name.toLowerCase() ===
                    product.category.name?.toLowerCase()
            ) ||
            null
        );
    }, [product]);

    const categorySlug =
        resolvedCategory?._id || product?.category?.name || null;

    const handleAddToCart = () => {
        if (product) addToCart(product, 1);
    };

    if (loading)
        return (
            <div className={styles.container()}>
                <Loading>Cargando producto...</Loading>
            </div>
        );

    if (error)
        return (
            <div className={styles.container()}>
                <ErrorMessage>
                    {error}
                    <p className="text-sm text-gray-500 mt-2">
                        Revisa nuestra <Link to="/">página principal</Link> o
                        explora otras categorías.
                    </p>
                </ErrorMessage>
            </div>
        );

    if (!product) return null;

    const { name, description, price, stock, imagesUrl, category } = product;

    const stockBadge = stock > 0 ? "success" : "error";
    const stockLabel = stock > 0 ? "En stock" : "Agotado";

    return (
        <div className={styles.container()}>
            <BreadCrumb
                items={[
                    { label: "Inicio", to: "/" },
                    categorySlug
                        ? {
                            label:
                                resolvedCategory?.name ||
                                category?.name ||
                                "Categoría",
                            to: `/category/${categorySlug}`,
                        }
                        : { label: "Categoría" },
                    { label: name },
                ]}
            />

            <div className={styles.main()}>
                <div className={styles.imageWrapper()}>
                    <img
                        src={
                            imagesUrl?.[0] ||
                            "/img/products/placeholder.svg"
                        }
                        alt={name}
                        onError={(e) =>
                            (e.target.src =
                                "/img/products/placeholder.svg")
                        }
                        className={styles.image()}
                    />
                </div>

                <div className={styles.info()}>
                    <div className={styles.title()}>
                        <h1 className="text-2xl font-bold text-gray-800">
                            {name}
                        </h1>
                        {(resolvedCategory?.name || category?.name) && (
                            <span className={styles.category()}>
                                {resolvedCategory?.name ||
                                    category?.name}
                            </span>
                        )}
                    </div>

                    <p className={styles.description()}>{description}</p>

                    <div className={styles.stock()}>
                        <Badge text={stockLabel} variant={stockBadge} />
                        {stock > 0 && (
                            <span className="text-gray-500 text-sm">
                                {stock} unidades disponibles
                            </span>
                        )}
                    </div>

                    <div className={styles.price()}>${price}</div>

                    <div className={styles.actions()}>
                        <Button
                            variant="primary"
                            size="lg"
                            disabled={stock === 0}
                            onClick={handleAddToCart}
                        >
                            Agregar al carrito
                        </Button>

                        <Link to="/cart" className={styles.viewCart()}>
                            Ver carrito
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
