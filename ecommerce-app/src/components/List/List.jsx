import ProductCard from "../ProductCard/ProductCard";
import { ListStyles } from "./ListStyles";

export default function List({
    products = [],
    title = "Nuestros Productos",
    layout = "grid",
}) {
    return (
        <div className={ListStyles.container()}>
            <div className={ListStyles.header()}>
                <h1 className={ListStyles.title()}>{title}</h1>
            </div>

            <div className={ListStyles.layout({ layout })}>
                {products.map((product) => (
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
