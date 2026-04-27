import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { http } from "../services/http";
import ProductCard from "../components/ProductCard/ProductCard";

export default function CategoryPage() {
  const { id } = useParams(); // 🔥 FIX AQUÍ

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        setLoading(true);

        // categoría
        const { data: cat } = await http.get(`/categories/slug/${id}`);
        setCategory(cat);

        if (!cat?._id) {
          setProducts([]);
          return;
        }

        // productos
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
  }, [id]);

  if (loading) return <p className="p-6">Cargando...</p>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">
        {category?.name}
      </h1>

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