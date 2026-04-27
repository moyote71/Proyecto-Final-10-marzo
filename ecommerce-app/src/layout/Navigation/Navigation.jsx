import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { http } from "../../services/http";

const Navigation = ({ isMobile = false, onLinkClick }) => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await http.get("/categories");
        setCategories(res.data);
      } catch (err) {
        console.error("Error cargando categorías", err);
      }
    };

    fetchCategories();
  }, []);

  const getSubcategories = (parentId) => {
    return categories.filter(
      (cat) => cat.parentCategory?._id === parentId
    );
  };

  /* =========================
     MOBILE
  ========================= */
  if (isMobile) {
    return (
      <div>
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/categories/${category.slug || category._id}`}
            onClick={onLinkClick}
          >
            {category.name}
          </Link>
        ))}
      </div>
    );
  }

  /* =========================
     DESKTOP
  ========================= */
  return (
    <div>
      {categories.map((category) => {
        const subcategories = getSubcategories(category._id);

        return (
          <div key={category._id}>
            {/* CATEGORÍA PRINCIPAL (SIEMPRE SE MUESTRA) */}
            <Link to={`/categories/${category.slug || category._id}`}>
              {category.name}
            </Link>

            {/* SUBCATEGORÍAS */}
            {subcategories.length > 0 && (
              <div>
                {subcategories.map((sub) => (
                  <Link
                    key={sub._id}
                    to={`/categories/${sub.slug || sub._id}`}
                  >
                    {sub.name}
                  </Link>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Navigation;