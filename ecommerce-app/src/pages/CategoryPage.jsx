import { useParams } from "react-router-dom";
import CategoryProducts from "../components/CategoryProducts/CategoryProducts";
import { CategoryPageStyles } from "./CategoryPageStyles";

export default function CategoryPage() {
    const { categoryId } = useParams();

    return (
        <div className={CategoryPageStyles.wrapper()}>
            <CategoryProducts categoryId={categoryId} />
        </div>
    );
}
