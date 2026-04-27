import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useCart } from "../../context/CartContext";
import { useAsync } from "../../hooks/useAsync";
import categoriesData from "../../data/categories.json";
import BreadCrumb from "../../layout/BreadCrumb/BreadCrumb";
import { getProductById } from "../../services/productService";
import { getProductReviews, addReview } from "../../services/reviewService";
import { useAuth } from "../../context/AuthContext";
import Badge from "../common/Bagde";
import Button from "../common/Button";
import ErrorMessage from "../common/ErrorMessage/ErrorMessage";
import Loading from "../common/Loading/Loading";
import styles from "./ProductDetailsStyles";

export default function ProductDetails({ productId }) {
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    const queryClient = useQueryClient();

    const {
        execute: fetchProduct,
        data: product,
        loading,
        error,
        setError,
    } = useAsync(getProductById);

    const [reviewComment, setReviewComment] = useState("");
    const [reviewScore, setReviewScore] = useState(5);
    const [activeImage, setActiveImage] = useState(null);

    /* =========================
       REVIEWS
    ========================= */
    const { data: reviews = [], isLoading: loadingReviews } = useQuery({
        queryKey: ["reviews", productId],
        queryFn: () => getProductReviews(productId),
        enabled: !!productId,
    });

    const addReviewMutation = useMutation({
        mutationFn: (newReview) =>
            addReview(productId, newReview),
        onSuccess: () => {
            setReviewComment("");
            setReviewScore(5);
            queryClient.invalidateQueries(["reviews", productId]);
        },
    });

    /* =========================
       LOAD PRODUCT
    ========================= */
    useEffect(() => {
        if (!productId) return;

        fetchProduct(productId).then((found) => {
            if (!found) setError("Producto no encontrado");
        });
    }, [productId]);

    /* =========================
       CATEGORY SAFE FIX (IMPORTANTE)
    ========================= */
    const resolvedCategory = useMemo(() => {
        if (!product?.category) return null;

        return (
            categoriesData.find(
                (cat) => cat._id === product.category._id
            ) ||
            categoriesData.find(
                (cat) =>
                    cat.name?.toLowerCase() ===
                    product.category.name?.toLowerCase()
            ) ||
            null
        );
    }, [product]);

    const categorySlug =
        resolvedCategory?.slug || product?.category?.slug;

    /* =========================
       IMAGES FIX
    ========================= */
    const images = Array.isArray(product?.imagesUrl)
        ? product.imagesUrl.filter(Boolean)
        : [];

    const mainImage =
        activeImage ||
        images[0] ||
        product?.image ||
        "https://placehold.co/800x600?text=Sin+Imagen";

    const handleAddToCart = () => {
        if (product) addToCart(product, 1);
    };

    /* =========================
       STATES
    ========================= */
    if (loading) {
        return (
            <div className={styles.container()}>
                <Loading>Cargando producto...</Loading>
            </div>
        );
    }

    if (error) {
        return (
            <div className={styles.container()}>
                <ErrorMessage>{error}</ErrorMessage>
            </div>
        );
    }

    if (!product) return null;

    const { name, description, price, stock, category } = product;

    const stockBadge = stock > 0 ? "success" : "error";
    const stockLabel = stock > 0 ? "En stock" : "Agotado";

    return (
        <div className={styles.container()}>

            {/* =========================
                BREADCRUMB FIX IMPORTANTE
            ========================= */}
            <BreadCrumb
                categories={category ? [category] : []}
            />

            {/* PRODUCT */}
            <div className={styles.main()}>

                <div className={styles.imageWrapper()}>
                    <img
                        src={mainImage}
                        alt={name}
                        className={styles.image()}
                    />
                </div>

                <div className={styles.info()}>

                    <h1>{name}</h1>

                    {category?.name && (
                        <Link
                            to={`/categories/${category.slug}`}
                            className="text-sm text-blue-600"
                        >
                            {category.name}
                        </Link>
                    )}

                    <p>{description}</p>

                    <Badge
                        text={stockLabel}
                        variant={stockBadge}
                    />

                    <div className={styles.price()}>
                        ${price}
                    </div>

                    <Button
                        onClick={handleAddToCart}
                        disabled={stock === 0}
                    >
                        Agregar al carrito
                    </Button>

                    <Link to="/cart">Ver carrito</Link>
                </div>
            </div>

            {/* REVIEWS */}
            <div className="mt-10">

                <h2>Reseñas</h2>

                {isAuthenticated ? (
                    <div>
                        <select
                            value={reviewScore}
                            onChange={(e) =>
                                setReviewScore(Number(e.target.value))
                            }
                        >
                            {[5,4,3,2,1].map(n => (
                                <option key={n} value={n}>{n} ⭐</option>
                            ))}
                        </select>

                        <textarea
                            value={reviewComment}
                            onChange={(e) =>
                                setReviewComment(e.target.value)
                            }
                        />

                        <Button
                            onClick={() =>
                                addReviewMutation.mutate({
                                    comment: reviewComment,
                                    rating: reviewScore,
                                })
                            }
                        >
                            Enviar
                        </Button>
                    </div>
                ) : (
                    <Link to="/login">Inicia sesión para reseñar</Link>
                )}

                <div>
                    {loadingReviews ? (
                        <p>Cargando...</p>
                    ) : reviews.length === 0 ? (
                        <p>No hay reseñas</p>
                    ) : (
                        reviews.map(r => (
                            <div key={r._id}>
                                <strong>{r.user?.displayName}</strong>
                                <p>{r.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}