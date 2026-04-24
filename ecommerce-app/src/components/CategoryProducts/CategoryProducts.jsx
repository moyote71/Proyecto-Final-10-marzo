import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import BreadCrumb from "../../layout/BreadCrumb/BreadCrumb";
import {
    getCategoryBySlug,
    getProductsByCategoryAndChildren,
} from "../../services/categoryService";
import ProductCard from "../ProductCard/ProductCard";
import ErrorMessage from "../common/ErrorMessage/ErrorMessage";
import Loading from "../common/Loading/Loading";
import { categoryProductsStyles as S } from "./CategoryProductsStyles";

export default function CategoryProducts() {
    const { slug } = useParams(); // 🔥 AHORA ES SLUG

    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const loadCategoryAndProducts = async () => {
            try {
                const categoryData = await getCategoryBySlug(slug);

                if (!categoryData) {
                    setError("Categoría no encontrada");
                    return;
                }

                const productsData = await getProductsByCategoryAndChildren(
                    categoryData._id
                );

                setCategory(categoryData);
                setProducts(productsData);
            } catch (err) {
                setError("Error al cargar la categoría o productos");
            } finally {
                setLoading(false);
            }
        };

        loadCategoryAndProducts();
    }, [slug]);

    if (loading) {
        return (
            <div className={S.root}>
                <Loading message="Cargando categoría y productos..." />
            </div>
        );
    }

    if (error || !category) {
        return (
            <div className={S.root}>
                <ErrorMessage message={error || "Categoría no encontrada"}>
                    <p className={S.muted}>
                        Vuelve al <Link to="/" className="text-blue-600 underline">inicio</Link>
                    </p>
                </ErrorMessage>
            </div>
        );
    }

    return (
        <div className={S.root}>
            <BreadCrumb items={[{ label: "Inicio", to: "/" }, { label: category.name }]} />

            <div className={S.container}>
                <div className={S.header}>
                    <h1 className={S.title}>
                        {category.name}
                    </h1>

                    {category.description && (
                        <p className={S.muted}>{category.description}</p>
                    )}
                </div>

                {(products || []).length > 0 ? (
                    <div className={S.grid}>
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                            />
                        ))}
                    </div>
                ) : (
                    <ErrorMessage message="No se encontraron productos" />
                )}
            </div>
        </div>
    );
}