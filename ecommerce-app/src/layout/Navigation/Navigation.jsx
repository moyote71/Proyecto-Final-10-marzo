import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/common/Icon/Icon";
import { http } from "../../services/http";
import { navStyles } from "./NavigationStyles";

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

    const getCategoryUrl = (cat) => cat?._id;

    const handleClick = () => {
        setIsDropdownOpen(false); // 🔥 CERRAR AL CLICK
        onLinkClick?.();
    };

    /* ========================= MOBILE ========================= */
    if (isMobile) {
        return (
            <div className={navStyles.mobileWrapper}>
                {categories.map((category) => (
                    <Link
                        key={category._id}
                        to={`/categories/${getCategoryUrl(category)}`}
                        onClick={handleClick}
                        className={navStyles.mobileLink}
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

                {/* BACKDROP (mejora UX) */}
                {isDropdownOpen && (
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsDropdownOpen(false)}
                    />
                )}

                <div className="relative z-50">

                    <button
                        className={`${navStyles.dropdownButton} text-white`}
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                    >
                        <Icon name="menu" size={16} />
                        Categorías
                        <Icon name="chevronDown" size={14} />
                    </button>

                    {isDropdownOpen && (
                        <div className={navStyles.dropdownMenu}>
                            {categories.map((category) => {
                                const subcategories = getSubcategories(category._id);

                                return (
                                    <div key={category._id} className={navStyles.categoryGroup}>

                                        <Link
                                            to={`/categories/${getCategoryUrl(category)}`}
                                            className={navStyles.mainCategoryLink}
                                            onClick={handleClick}
                                        >
                                            {category.name}
                                        </Link>

                                        {subcategories.length > 0 && (
                                            <div className={navStyles.subcategoryList}>
                                                {subcategories.map((sub) => (
                                                    <Link
                                                        key={sub._id}
                                                        to={`/categories/${getCategoryUrl(sub)}`}
                                                        className={navStyles.subCategoryLink}
                                                        onClick={handleClick}
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
                    )}
                </div>

            </div>
        </div>
    );
};

export default Navigation;