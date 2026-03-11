import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import BreadCrumb from "../../layout/BreadCrumb/BreadCrumb";
import {
    getCategoryById,
    getProductsByCategoryAndChildren,
} from "../../services/categoryService";
import ProductCard from "../ProductCard/ProductCard";
import ErrorMessage from "../common/ErrorMessage/ErrorMessage";
import Loading from "../common/Loading/Loading";
import { categoryProductsStyles as S } from "./CategoryProductsStyles";

export default function CategoryProducts({ categoryId }) {
    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        setLoading(true);
        setError(null);

        const loadCategoryAndProducts = async () => {
            try {
                const [categoryData, productsData] = await Promise.all([
                    getCategoryById(categoryId),
                    getProductsByCategoryAndChildren(categoryId),
                ]);

                if (!categoryData) {
                    setError("Categoría no encontrada");
                    return;
                }

                setCategory(categoryData);
                setProducts(productsData);
            } catch (err) {
                setError("Error al cargar la categoría o productos");
            } finally {
                setLoading(false);
            }
        };

        loadCategoryAndProducts();
    }, [categoryId]);

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
                        Vuelve al <Link to="/" className="text-blue-600 underline">inicio</Link> o explora nuestras categorías destacadas.
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
                    <div>
                        <h1 className={S.title}>
                            {category.parentCategory
                                ? `${category.parentCategory.name}: ${category.name}`
                                : category.name}
                        </h1>

                        {category.description && (
                            <p className={S.muted}>{category.description}</p>
                        )}
                    </div>
                </div>

                {products.length > 0 ? (
                    <div className={S.grid}>
                        {products.map((product) => (
                            <ProductCard
                                key={product._id}
                                product={product}
                                orientation="vertical"
                                className="shadow-sm hover:shadow-md transition-all"
                            />
                        ))}
                    </div>
                ) : (
                    <ErrorMessage message="No se encontraron productos">
                        <p className={S.muted}>
                            No hay productos disponibles en esta categoría por el momento.
                        </p>
                    </ErrorMessage>
                )}
            </div>
        </div>
    );
}
