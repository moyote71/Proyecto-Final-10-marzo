import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { http } from "../services/http";
import ProductCard from "../components/common/ProductCard/ProductCard";

export default function CategoryPage() {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // 1. categoría (solo info visual)
        const categoryRes = await http.get(`/categories/slug/${slug}`);
        setCategory(categoryRes.data);

        // 2. productos reales
        const productsRes = await http.get(`/products/category/${slug}`);

        // 🔥 FIX IMPORTANTE: backend devuelve ARRAY directo
        setProducts(Array.isArray(productsRes.data)
          ? productsRes.data
          : productsRes.data.products || []
        );

      } catch (err) {
        console.error("Error cargando categoría:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) return <p>Cargando...</p>;

  return (
    <div>
      <h1>{category?.name}</h1>

      {products.length === 0 ? (
        <p>No hay productos</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}