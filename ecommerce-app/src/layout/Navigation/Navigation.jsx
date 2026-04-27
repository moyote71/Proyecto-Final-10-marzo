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
    return categories
      .filter((cat) => cat.parentCategory?._id === parentId)
      .sort((a, b) => a.name.localeCompare(b.name));
  };

  if (isMobile) {
    return (
      <div>
        {categories.map((category) => (
          category?.slug && (
            <Link
              key={category._id}
              to={`/categories/${category.slug || category._id}`}
              onClick={onLinkClick}
            >
              {category.name}
            </Link>
          )
        ))}
      </div>
    );
  }

  return (
    <div>
      {categories.map((category) => {
        const subcategories = getSubcategories(category._id);

        return (
          <div key={category._id}>
            {category.slug && (
              <Link to={`/categories/${category.slug}`}>
                {category.name}
              </Link>
            )}

            {subcategories.map((sub) => (
              sub.slug && (
                <Link
                  key={sub._id}
                  to={`/categories/${sub.slug}`}
                >
                  {sub.name}
                </Link>
              )
            ))}
          </div>
        );
      })}
    </div>
  );
};

export default Navigation;