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

        // 1. categoría
        const categoryRes = await http.get(`/categories/slug/${slug}`);
        setCategory(categoryRes.data);

        // 2. productos (IMPORTANTE: backend ya soporta slug)
        const productsRes = await http.get(`/products/category/${slug}`);

        const data = productsRes.data;

        setProducts(
          Array.isArray(data)
            ? data
            : data.products || []
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

  if (loading) return <p className="text-black">Cargando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        {category?.name || "Categoría"}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No hay productos</p>
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