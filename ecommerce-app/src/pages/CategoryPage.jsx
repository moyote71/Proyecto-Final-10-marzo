import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { http } from "../services/http";

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

        const res = await http.get(`/categories/slug/${slug}`);

        setCategory(res.data);

        // SAFE CHECK
        if (Array.isArray(res.data?.products)) {
          setProducts(res.data.products);
        } else {
          setProducts([]);
        }

      } catch (err) {
        console.error("Error cargando categoría:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  if (loading) return <p>Cargando...</p>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 text-white">
      <h1 className="text-2xl font-bold mb-6">
        {category?.name || "Categoría"}
      </h1>

      {products.length === 0 ? (
        <p>No hay productos</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <div key={p._id} className="bg-white text-black p-4 rounded">
              <p className="font-semibold">{p.name}</p>
              <p>${p.price}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}