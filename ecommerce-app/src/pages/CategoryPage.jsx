import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { http } from "../services/http";

export default function CategoryPage() {
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

        const res = await http.get(`/products/category/${slug}`);

        const data = res.data?.products || res.data || [];

        setProducts(data);
      } catch (err) {
        console.error(err);
        setError("No se pudieron cargar los productos");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [slug]);

  if (loading) return <p>Cargando...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Productos</h2>

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