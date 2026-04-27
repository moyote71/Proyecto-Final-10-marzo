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

    const queryClient = useQueryClient();

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

        fetchProduct(productId).then((foundProduct) => {
            if (!foundProduct) setError("Producto no encontrado");
        });
    }, [productId, fetchProduct, setError]);

    /* =========================
       CATEGORY SAFE
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
        resolvedCategory?.slug ||
        resolvedCategory?._id ||
        product?.category?.slug ||
        product?.category?._id ||
        null;

    /* =========================
       IMAGES FIX REAL
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
                <ErrorMessage>
                    {error}
                    <p className="text-sm text-gray-500 mt-2">
                        Revisa nuestra <Link to="/">página principal</Link>
                    </p>
                </ErrorMessage>
            </div>
        );
    }

    if (!product) return null;

    const {
        name,
        description,
        price,
        stock,
        category,
    } = product;

    const stockBadge = stock > 0 ? "success" : "error";
    const stockLabel = stock > 0 ? "En stock" : "Agotado";

    return (
        <div className={styles.container()}>

            {/* BREADCRUMB */}
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

            {/* PRODUCT MAIN */}
            <div className={styles.main()}>

                {/* IMAGE SECTION */}
                <div className={styles.imageWrapper()}>

                    <img
                        src={mainImage}
                        alt={name}
                        className={styles.image()}
                        onError={(e) => {
                            e.target.src =
                                "https://placehold.co/800x600?text=Producto";
                        }}
                    />

                    {/* THUMBNAILS */}
                    {images.length > 1 && (
                        <div className="flex gap-2 mt-3 flex-wrap">
                            {images.map((img, i) => (
                                <img
                                    key={i}
                                    src={img}
                                    alt={`thumb-${i}`}
                                    className={`w-16 h-16 object-cover rounded border cursor-pointer ${
                                        img === mainImage
                                            ? "border-teal-500"
                                            : ""
                                    }`}
                                    onClick={() => setActiveImage(img)}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* INFO */}
                <div className={styles.info()}>

                    <h1 className="text-2xl font-bold text-gray-800">
                        {name}
                    </h1>

                    {(resolvedCategory?.name || category?.name) && (
                        <span className={styles.category()}>
                            {resolvedCategory?.name || category?.name}
                        </span>
                    )}

                    <p className={styles.description()}>
                        {description}
                    </p>

                    <div className={styles.stock()}>
                        <Badge
                            text={stockLabel}
                            variant={stockBadge}
                        />
                        {stock > 0 && (
                            <span className="text-gray-500 text-sm">
                                {stock} unidades disponibles
                            </span>
                        )}
                    </div>

                    <div className={styles.price()}>
                        ${price}
                    </div>

                    <div className={styles.actions()}>
                        <Button
                            variant="primary"
                            size="lg"
                            disabled={stock === 0}
                            onClick={handleAddToCart}
                        >
                            Agregar al carrito
                        </Button>

                        <Link
                            to="/cart"
                            className={styles.viewCart()}
                        >
                            Ver carrito
                        </Link>
                    </div>
                </div>
            </div>

            {/* REVIEWS */}
            <div className="mt-12 border-t pt-8">

                <h2 className="text-2xl font-bold mb-6">
                    Reseñas del Producto
                </h2>

                {isAuthenticated ? (
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">

                        <h3 className="text-lg font-semibold mb-3">
                            Deja tu reseña
                        </h3>

                        <select
                            value={reviewScore}
                            onChange={(e) =>
                                setReviewScore(Number(e.target.value))
                            }
                        >
                            {[5, 4, 3, 2, 1].map((n) => (
                                <option key={n} value={n}>
                                    {n} ⭐️
                                </option>
                            ))}
                        </select>

                        <textarea
                            className="w-full border rounded p-2 mt-2"
                            rows="3"
                            value={reviewComment}
                            onChange={(e) =>
                                setReviewComment(e.target.value)
                            }
                        />

                        <Button
                            variant="primary"
                            onClick={() =>
                                addReviewMutation.mutate({
                                    comment: reviewComment,
                                    rating: reviewScore,
                                })
                            }
                            disabled={
                                addReviewMutation.isPending ||
                                !reviewComment.trim()
                            }
                        >
                            {addReviewMutation.isPending
                                ? "Enviando..."
                                : "Enviar Reseña"}
                        </Button>
                    </div>
                ) : (
                    <div className="p-4 text-center text-gray-600">
                        <Link
                            to="/login"
                            className="text-blue-600 font-bold"
                        >
                            Inicia sesión
                        </Link>{" "}
                        para dejar una reseña
                    </div>
                )}

                {/* REVIEWS LIST */}
                <div className="flex flex-col gap-4">
                    {loadingReviews ? (
                        <p>Cargando reseñas...</p>
                    ) : reviews.length === 0 ? (
                        <p>No hay reseñas aún</p>
                    ) : (
                        reviews.map((review) => (
                            <div
                                key={review._id}
                                className="border p-4 rounded"
                            >
                                <strong>
                                    {review.user?.displayName ||
                                        review.user?.email ||
                                        "Usuario"}
                                </strong>

                                <p>{review.comment}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}