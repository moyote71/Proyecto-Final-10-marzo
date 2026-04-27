import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { http } from "../services/http";
import ProductCard from "../components/common/ProductCard/ProductCard";

export default function CategoryPage() {
  const { slug } = useParams();

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!slug) return;

    const fetchCategory = async () => {
      try {
        const res = await http.get(`/categories/slug/${slug}`);
        setCategory(res.data);

        // 🔥 FIX IMPORTANTE:
        // si backend no manda products, hacemos fetch aparte
        if (res.data.products) {
          setProducts(res.data.products);
        } else {
          const prodRes = await http.get(`/products?category=${res.data._id}`);
          setProducts(prodRes.data);
        }

      } catch (err) {
        console.error("Error cargando categoría:", err);
      }
    };

    fetchCategory();
  }, [slug]);

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">

      <h1 className="text-2xl font-bold mb-6">
        {category?.name}
      </h1>

      {/* GRID DE PRODUCTOS */}
      {products.length === 0 ? (
        <p className="text-gray-500">No hay productos en esta categoría</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p._id} product={p} />
          ))}
        </div>
      )}

    </div>
  );
}