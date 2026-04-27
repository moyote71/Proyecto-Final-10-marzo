import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/common/Icon/Icon";
import { http } from "../../services/http";
import { navStyles, navContrastFix } from "./NavigationStyles";

const Navigation = ({ isMobile = false, onLinkClick }) => {
  const [categories, setCategories] = useState([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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

  /* ========================= MOBILE ========================= */
  if (isMobile) {
    return (
      <div className={navStyles.mobileWrapper}>
        {categories.map((category) => (
          <Link
            key={category._id}
            to={`/categories/${category.slug || category._id}`}
            onClick={onLinkClick}
            className={navStyles.mainCategoryLink}
          >
            {category.name}
          </Link>
        ))}
      </div>
    );
  }

  /* ========================= DESKTOP ========================= */
  return (
    <div className={navStyles.wrapper}>
      <div className={navStyles.inner}>

        <div className="relative">
          <button
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            Categorías
          </button>

          {isDropdownOpen && (
            <div>
              {categories.map((category) => {
                const subcategories = getSubcategories(category._id);

                return (
                  <div key={category._id}>

                    {/* CATEGORÍA PRINCIPAL */}
                    <Link to={`/categories/${category.slug || category._id}`}>
                      {category.name}
                    </Link>

                    {/* SUBCATEGORÍAS */}
                    {subcategories.map((sub) => (
                      <Link
                        key={sub._id}
                        to={`/categories/${sub.slug || sub._id}`}
                      >
                        {sub.name}
                      </Link>
                    ))}

                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default Navigation;