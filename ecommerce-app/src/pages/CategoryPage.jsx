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
        setProducts(res.data?.products || []);

      } catch (err) {
        console.error("Error cargando categoría:", err);
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

  return (
    <div className="max-w-7xl mx-auto px-6 py-10 bg-white text-black">

      <h1 className="text-2xl font-bold mb-6">
        {category?.name || "Categoría"}
      </h1>

      {products.length === 0 ? (
        <p className="text-gray-500">No hay productos en esta categoría</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">

          {products.map((p) => (
            <div
              key={p._id}
              className="border rounded-lg p-4 shadow-sm bg-white"
            >
              <h2 className="font-semibold text-lg">{p.name}</h2>
              <p className="text-gray-600">${p.price}</p>
            </div>
          ))}

        </div>
      )}

    </div>
  );
}