import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { http } from "../services/http";

export default function CategoryPage() {
    const { id } = useParams();

    const [category, setCategory] = useState(null);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        if (!id) return;

        const fetchCategory = async () => {
            try {
                const res = await http.get(`/categories/${id}`);

                setCategory(res.data);
                setProducts(res.data.products || []);
            } catch (err) {
                console.error("Error cargando categoría:", err);
            }
        };

        fetchCategory();
    }, [id]);

    return (
        <div>
            <h1>{category?.name}</h1>

            {products.length === 0 ? (
                <p>No hay productos</p>
            ) : (
                products.map((p) => (
                    <div key={p._id}>
                        {p.name} - ${p.price}
                    </div>
                ))
            )}
        </div>
    );
}