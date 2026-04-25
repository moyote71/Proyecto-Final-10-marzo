import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BreadCrumb from "../../layout/BreadCrumb/BreadCrumb";
import {
    getCategoryBySlug,
    getProductsByCategoryAndChildren,
} from "../../services/categoryService";
import ProductCard from "../ProductCard/ProductCard";
import ErrorMessage from "../common/ErrorMessage/ErrorMessage";
import Loading from "../common/Loading/Loading";
import { categoryProductsStyles as S } from "./CategoryProductsStyles";

export default function CategoryProducts({ slug }) {
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 🧨 FIX: proteger undefined / string basura
        if (!slug || slug === "undefined" || slug === "null") {
            setError("Slug inválido");
            setLoading(false);
            setCategory(null);
            setProducts([]);
            return;
        }

        const load = async () => {
            try {
                setLoading(true);
                setError(null);

                const categoryData = await getCategoryBySlug(slug);

                // 🧨 FIX: si backend falla o no existe
                if (!categoryData || !categoryData._id) {
                    setError("Categoría no encontrada");
                    setCategory(null);
                    setProducts([]);
                    return;
                }

                const productsData =
                    await getProductsByCategoryAndChildren(categoryData._id);

                setCategory(categoryData);
                setProducts(Array.isArray(productsData) ? productsData : []);
            } catch (err) {
                console.error("Error cargando categoría:", err);
                setError("Error cargando categoría");
                setCategory(null);
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [slug]);

    if (loading) {
        return <Loading message="Cargando..." />;
    }

    if (error || !category) {
        return (
            <ErrorMessage message={error || "Categoría no encontrada"}>
                <Link to="/">Volver al inicio</Link>
            </ErrorMessage>
        );
    }

    return (
        <div className={S.root}>
            <BreadCrumb
                items={[
                    { label: "Inicio", to: "/" },
                    { label: category.name || "Categoría" },
                ]}
            />

            <h1>{category.name}</h1>

            <div className={S.grid}>
                {products.length > 0 ? (
                    products.map((p) => (
                        <ProductCard key={p._id} product={p} />
                    ))
                ) : (
                    <p className="text-gray-500">
                        No hay productos en esta categoría
                    </p>
                )}
            </div>
        </div>
    );
}