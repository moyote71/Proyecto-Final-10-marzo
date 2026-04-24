import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BreadCrumb from "../../layout/BreadCrumb/BreadCrumb";
import { getCategoryBySlug, getProductsByCategoryAndChildren } from "../../services/categoryService";
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
        if (!slug || slug === "undefined") {
            setError("Slug inválido");
            setLoading(false);
            return;
        }

        const load = async () => {
            try {
                setLoading(true);

                const categoryData = await getCategoryBySlug(slug);

                if (!categoryData) {
                    setError("Categoría no encontrada");
                    return;
                }

                const productsData = await getProductsByCategoryAndChildren(
                    categoryData._id
                );

                setCategory(categoryData);
                setProducts(productsData || []);
            } catch (err) {
                setError("Error cargando categoría");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [slug]);

    if (loading) return <Loading message="Cargando..." />;

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
                    { label: category.name },
                ]}
            />

            <h1>{category.name}</h1>

            <div className={S.grid}>
                {products.length > 0 ? (
                    products.map((p) => (
                        <ProductCard key={p._id} product={p} />
                    ))
                ) : (
                    <p>No hay productos en esta categoría</p>
                )}
            </div>
        </div>
    );
}