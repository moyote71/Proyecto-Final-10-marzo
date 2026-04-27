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

        // 1. traer categoría por slug
        const { data: cat } = await http.get(`/categories/slug/${slug}`);
        setCategory(cat);

        // 🚨 FIX IMPORTANTE: validar id antes de pedir productos
        if (!cat?._id) {
          setProducts([]);
          return;
        }

        // 2. productos por category ID real
        const { data: prod } = await http.get(
          `/products/category/${cat._id}`
        );

        setProducts(Array.isArray(prod) ? prod : []);
      } catch (err) {
        console.error("Error cargando categoría:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [slug]);

  if (loading)
    return (
      <p className="text-black p-6 font-medium">Cargando...</p>
    );

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