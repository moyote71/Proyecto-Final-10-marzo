import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { http } from "../services/http";
import ProductCard from "../components/ProductCard/ProductCard";

export default function CategoryPage() {
  const { id } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const res = await http.get(`/categories/${id}`);

        const data = res.data;

        // 🔥 soporta múltiples respuestas del backend
        const categoryData = data.category || data;
        const productsData =
          data.products ||
          data.category?.products ||
          [];

        setCategory(categoryData);
        setProducts(Array.isArray(productsData) ? productsData : []);

      } catch (err) {
        console.error("Error cargando categoría:", err);
        setError("No se pudo cargar la categoría");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (loading) return <p className="p-6">Cargando...</p>;

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

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