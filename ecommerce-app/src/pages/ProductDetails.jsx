import { useParams } from "react-router-dom";
import ProductDetailsCard from "../components/ProductDetails/ProductDetailsCard";
import * as ProductDetailsStyles from "./ProductDetailsStyles";

export default function ProductDetails() {
    const { productId } = useParams();

    const isValidId = /^[a-f\d]{24}$/i.test(productId);
    if (!isValidId) {
        return (
            <div className={ProductDetailsStyles.invalidId()}>
                ID de producto inválido.
            </div>
        );
    }

    return (
        <div className={ProductDetailsStyles.page()}>
            <ProductDetailsCard productId={productId} />
        </div>
    );
}
