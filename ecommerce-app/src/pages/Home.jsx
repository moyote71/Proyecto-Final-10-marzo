import { useEffect, useState } from "react";
import BannerCarousel from "../components/BannerCarousel";
import List from "../components/List/List";
import ErrorMessage from "../components/common/ErrorMessage/ErrorMessage";
import Loading from "../components/common/Loading/Loading";
import homeImages from "../data/homeImages.json";
import { fetchProducts } from "../services/productService";
import { homeWrapper, section } from "./HomeStyles";

export default function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const productsData = await fetchProducts();
                console.log(productsData);
                setProducts(productsData.products);
            } catch (err) {
                setError("No se pudieron cargar los productos. Intenta más tarde.");
                console.error(err)
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        loadProducts();
    }, []);

    return (
        <div className={homeWrapper()}>
            {/* Banners */}
            <section className={section()}>
                <BannerCarousel banners={homeImages} />
            </section>

            {/* Productos */}
            <section className={section()}>
                {loading ? (
                    <Loading>Cargando productos...</Loading>
                ) : error ? (
                    <ErrorMessage>{error}</ErrorMessage>
                ) : products.length > 0 ? (
                    <List
                        title="Productos recomendados"
                        products={products}
                        layout="grid"
                    />
                ) : (
                    <ErrorMessage>No hay productos en el catálogo</ErrorMessage>
                )}
            </section>
        </div>
    );
}
