import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { http } from "../http.js";

export default function CategoryPage() {
  const { slug } = useParams(); // 🔥 CAMBIO CLAVE (ANTES era id)

  const [category, setCategory] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (!slug) return;

    const fetchCategory = async () => {
      try {
        const res = await http.get(`/api/categories/slug/${slug}`);

        setCategory(res.data);
        setProducts(res.data.products || []);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCategory();
  }, [slug]);

  return (
    <div>
      <h1>{category?.name}</h1>

      <div>
        {products.length === 0 ? (
          <p>No hay productos en esta categoría</p>
        ) : (
          products.map((p) => (
            <div key={p._id}>
              {p.name} - ${p.price}
            </div>
          ))
        )}
      </div>
    </div>
  );
}