import { useParams } from "react-router-dom";
import CategoryProducts from "../components/CategoryProducts/CategoryProducts";

export default function CategoryPage() {
    const { slug } = useParams();

    return <CategoryProducts slug={slug} />;
}