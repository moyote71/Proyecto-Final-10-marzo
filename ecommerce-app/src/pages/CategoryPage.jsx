import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { http } from "../services/http";

export default function CategoryPage() {
  // 🔥 FIX: debe ser "slug", no categoryId
  const { slug } = useParams();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!slug) return;

    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError("");

        // 🔥 FIX: endpoint correcto (slug o id, backend ya lo soporta)
        const res = await http.get(`/products/category/${slug}`);

        setProducts(res.data || []);
      } catch (err) {
        console.error("Error loading category products:", err);
        setProducts([]);
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  if (loading) {
    return <p>Cargando productos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h2>Productos de categoría</h2>

      {products.length === 0 ? (
        <p>No hay productos en esta categoría</p>
      ) : (
        products.map((p) => (
          <div key={p._id}>
            <h3>{p.name}</h3>
            <p>${p.price}</p>
          </div>
        ))
      )}
    </div>
  );
}