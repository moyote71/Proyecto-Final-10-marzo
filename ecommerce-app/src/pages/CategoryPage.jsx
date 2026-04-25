import { useParams } from "react-router-dom";
import CategoryProducts from "../components/CategoryProducts/CategoryProducts";

export default function CategoryPage() {
    const { slug } = useParams();

    if (!slug) {
        return <div>Categoría inválida</div>;
    }

    return <CategoryProducts slug={slug} />;
}