import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { http } from "../services/http";

export default function CategoryPage() {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    const fetchCategory = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await http.get(`/categories/slug/${slug}`);

        console.log("🔥 RESPUESTA BACKEND:", res.data);

        // 🔥 FIX ROBUSTO: soporta varios formatos
        const data = res.data?.category || res.data;

        setCategory(data);

        setProducts(
          data?.products ||
          res.data?.products ||
          []
        );

      } catch (err) {
        console.error("❌ ERROR CATEGORY:", err);
        setError("Error cargando categoría");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [slug]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh] text-black">
        Cargando...
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-600 text-center mt-10">
        {error}
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 bg-white text-black">

      <h1 className="text-2xl font-bold mb-6">
        {category?.name || "Categoría"}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500">
          Esta categoría no tiene productos o no están llegando del backend
        </p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {products.map((p) => (
            <div
              key={p._id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <h2 className="font-semibold">{p.name}</h2>
              <p className="text-gray-600">${p.price}</p>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}