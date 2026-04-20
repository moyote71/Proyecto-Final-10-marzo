import { useEffect } from "react";
import { useAsync } from "../hooks/useAsync";
import BannerCarousel from "../components/BannerCarousel";
import List from "../components/List/List";
import ErrorMessage from "../components/common/ErrorMessage/ErrorMessage";
import Loading from "../components/common/Loading/Loading";
import homeImages from "../data/homeImages.json";
import { fetchProducts } from "../services/productService";
import { homeWrapper, section } from "./HomeStyles";

export default function Home() {
    const { data: products, loading, error, execute } = useAsync(fetchProducts);

    useEffect(() => {
        execute();
    }, [execute]);

    // 🔧 3. FIX DE RENDER CONDICIONAL
    if (loading) return <Loading>Cargando productos...</Loading>;
    if (error) return <ErrorMessage>{error}</ErrorMessage>;

    // 🔧 2. ASEGURAR QUE useAsync DEVUELVA ARRAY (Fallback seguro)
    const safeProducts = Array.isArray(products) ? products : [];

    if (!safeProducts.length) {
        return (
            <div className={homeWrapper()}>
                <section className={section()}>
                    <BannerCarousel banners={homeImages} />
                </section>
                <section className={section()}>
                    <ErrorMessage>No hay productos en el catálogo</ErrorMessage>
                </section>
            </div>
        );
    }

    return (
        <div className={homeWrapper()}>
            {/* Banners */}
            <section className={section()}>
                <BannerCarousel banners={homeImages} />
            </section>

            {/* Productos — 🔧 1. FIX CRÍTICO: Usar safeProducts (que garantiza .length y .map) */}
            <section className={section()}>
                <List
                    title="Productos recomendados"
                    products={safeProducts}
                    layout="grid"
                />
            </section>
        </div>
    );
}
