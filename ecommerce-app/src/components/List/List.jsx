import ProductCard from "../ProductCard/ProductCard";
import { ListStyles } from "./ListStyles";
import Loading from "../common/Loading/Loading";
import ErrorMessage from "../common/ErrorMessage/ErrorMessage";

export default function List({
    products = [],
    title = "Nuestros Productos",
    layout = "grid",
    loading,
    error
}) {
    if (loading) return <Loading message="Cargando productos..." />;
    if (error) return <ErrorMessage message={error} />;
    const safeProducts = Array.isArray(products) ? products : [];
    if (!safeProducts.length) return <p>No hay productos</p>;

    return (
        <div className={ListStyles.container()}>
            <div className={ListStyles.header()}>
                <h1 className={ListStyles.title()}>{title}</h1>
            </div>

            <div className={ListStyles.layout({ layout })}>
                {safeProducts.map((product) => (
                    <ProductCard
                        key={product._id}
                        product={product}
                        orientation={layout === "grid" ? "vertical" : "horizontal"}
                        className={ListStyles.item()}
                    />
                ))}
            </div>
        </div>
    );
}
