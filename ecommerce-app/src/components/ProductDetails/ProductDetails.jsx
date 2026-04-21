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
import formatImageUrl from "../../utils/formatImageUrl";

import styles from "./ProductDetailsStyles";

export default function ProductDetails({ productId }) {
    const { isAuthenticated } = useAuth();
    const { addToCart } = useCart();
    
    // Custom Hook for decoupled async data fetching
    const { execute: fetchProduct, data: product, loading, error, setError } = useAsync(getProductById);

    const [reviewComment, setReviewComment] = useState("");
    const [reviewScore, setReviewScore] = useState(5);
    const queryClient = useQueryClient();

    const { data: reviews = [], isLoading: loadingReviews } = useQuery({
        queryKey: ["reviews", productId],
        queryFn: () => getProductReviews(productId),
    });

    const addReviewMutation = useMutation({
        mutationFn: (newReview) => addReview(productId, newReview),
        onSuccess: () => {
            setReviewComment("");
            setReviewScore(5);
            queryClient.invalidateQueries(["reviews", productId]);
        }
    });

    useEffect(() => {
        fetchProduct(productId).then(foundProduct => {
             if (!foundProduct) setError("Producto no encontrado");
        });
    }, [productId, fetchProduct, setError]);

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

    const { name, description, price, stock, image, imagesUrl, category } = product;

    const productImageUrl = formatImageUrl(image || imagesUrl?.[0]);

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
                        src={productImageUrl}
                        alt={name}
                        onError={(e) => {
                            e.target.src = "https://placehold.co/800x600?text=Producto";
                        }}
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

            {/* Reviews Section */}
            <div className="mt-12 border-t pt-8">
                <h2 className="text-2xl font-bold mb-6">Reseñas del Producto</h2>
                
                {isAuthenticated() ? (
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-3">Deja tu reseña</h3>
                        <div className="flex flex-col gap-3">
                            <div className="flex items-center gap-2">
                                <label className="font-medium text-gray-700">Puntuación:</label>
                                <select 
                                    className="border rounded p-1"
                                    value={reviewScore} 
                                    onChange={(e) => setReviewScore(Number(e.target.value))}
                                >
                                    {[5,4,3,2,1].map(n => <option key={n} value={n}>{n} ⭐️</option>)}
                                </select>
                            </div>
                            <textarea 
                                className="w-full border rounded p-2" 
                                rows="3" 
                                placeholder="Escribe tu opinión sobre el producto..."
                                value={reviewComment}
                                onChange={(e) => setReviewComment(e.target.value)}
                            ></textarea>
                            <Button 
                                variant="primary" 
                                onClick={() => addReviewMutation.mutate({ comment: reviewComment, score: reviewScore })}
                                disabled={addReviewMutation.isPending || !reviewComment.trim()}
                            >
                                {addReviewMutation.isPending ? "Enviando..." : "Enviar Reseña"}
                            </Button>
                        </div>
                    </div>
                ) : (
                    <div className="mb-8 p-4 bg-gray-50 rounded-lg text-gray-600 text-center">
                        <Link to="/login" className="text-strongblue font-bold hover:underline">Inicia sesión</Link> para dejar una reseña.
                    </div>
                )}

                <div className="flex flex-col gap-4">
                    {loadingReviews ? (
                        <p className="text-gray-500">Cargando reseñas...</p>
                    ) : reviews.length === 0 ? (
                        <p className="text-gray-500">Aún no hay reseñas para este producto. ¡Sé el primero!</p>
                    ) : (
                        reviews.map((review) => (
                            <div key={review._id} className="border p-4 rounded bg-white shadow-sm">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="font-semibold">{review.user?.displayName || review.user?.email || "Usuario"}</span>
                                    <span className="text-yellow-500 text-lg">{"★".repeat(review.score)}{"☆".repeat(5 - review.score)}</span>
                                </div>
                                <p className="text-gray-700">{review.comment}</p>
                                <span className="text-xs text-gray-400 mt-2 block">{new Date(review.createdAt).toLocaleDateString()}</span>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
