import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { http } from "../services/http";
import ProductCard from "../components/common/ProductCard/ProductCard.jsx";


export default function CategoryPage() {
    const { slug } = useParams();

    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!slug) return;

        const fetchCategory = async () => {
            try {
                setLoading(true);

                const res = await http.get(`/categories/${slug}`);

                setCategory(res.data);
                setProducts(res.data.products || []);
            } catch (err) {
                console.error("Error cargando categoría:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchCategory();
    }, [slug]);

    if (loading) return <div className="p-4 text-white">Cargando...</div>;

    return (
        <div className="p-6 text-white">
            <h1 className="text-2xl font-bold mb-6">
                {category?.name}
            </h1>

            {products.length === 0 ? (
                <p>No hay productos en esta categoría</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {products.map((p) => (
                        <ProductCard key={p._id} product={p} />
                    ))}
                </div>
            )}
        </div>
    );
}