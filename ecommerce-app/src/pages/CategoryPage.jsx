import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { http } from "../services/http";
import ProductCard from "../components/ProductCard/ProductCard";

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

        // 1. Obtener categoría por slug
        const categoryRes = await http.get(`/categories/slug/${slug}`);
        const categoryData = categoryRes.data;

        setCategory(categoryData);

        // 🔥 2. IMPORTANTE: usar ID real de Mongo, no slug
        const productsRes = await http.get(
          `/products/category/${categoryData._id}`
        );

        const data = productsRes.data;

        setProducts(Array.isArray(data) ? data : data.products || []);

      } catch (err) {
        console.error("Error cargando categoría:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading) {
    return (
      <p className="text-black p-6 font-medium">
        Cargando...
      </p>
    );
  }

  return (
    <div className="p-6 bg-white min-h-screen">
      <h1 className="text-2xl font-bold mb-6 text-black">
        {category?.name || "Categoría"}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500">
          No hay productos en esta categoría
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
}