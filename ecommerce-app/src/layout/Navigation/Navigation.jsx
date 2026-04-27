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

    const getCategoryUrl = (cat) => {
        // 🔥 FIX CLAVE: usa slug si existe, si no usa id
        return cat.slug ? cat.slug : cat._id;
    };

    /* ========================= MOBILE ========================= */
    if (isMobile) {
        return (
            <div className={navStyles.mobileWrapper}>
                {categories.map((category) => (
                    <Link
                        key={category._id}
                        to={`/categories/${getCategoryUrl(category)}`}
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
                    <button onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        Categorías
                    </button>

                    {isDropdownOpen && (
                        <div>
                            {categories.map((category) => {
                                const subcategories = getSubcategories(category._id);

                                return (
                                    <div key={category._id}>
                                        <Link to={`/categories/${getCategoryUrl(category)}`}>
                                            {category.name}
                                        </Link>

                                        {subcategories.map((sub) => (
                                            <Link
                                                key={sub._id}
                                                to={`/categories/${getCategoryUrl(sub)}`}
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