import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Icon from "../../components/common/Icon/Icon";
import categoriesData from "../../data/categories.json";
import { navStyles, navContrastFix } from "./NavigationStyles";

const Navigation = ({ isMobile = false, onLinkClick }) => {
    const [categories, setCategories] = useState([]);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    useEffect(() => {
        const allParentIds = new Set(
            categoriesData
                .filter((cat) => cat.parentCategory)
                .map((cat) => cat.parentCategory._id)
        );

        const mainCategories = categoriesData.filter(
            (cat) => !cat.parentCategory || allParentIds.has(cat._id)
        );

        setCategories(mainCategories);
    }, []);

    const getSubcategories = (parentId) => {
        const subcategories = categoriesData.filter(
            (cat) => cat.parentCategory && cat.parentCategory._id === parentId
        );
        return subcategories.sort((a, b) => a.name.localeCompare(b.name));
    };

    /*  MOBILE VERSION */
    if (isMobile) {
        return (
            <div className={`${navStyles.mobileWrapper} ${navContrastFix.mobileWrapperFix()}`}>
                <Link
                    to="/new"
                    className={navStyles.mobileLinkSpecial}
                    onClick={onLinkClick}
                >
                    <Icon name="sparkles" size={20} />
                    Novedades
                </Link>

                <Link
                    to="/bestsellers"
                    className={navStyles.mobileLinkSpecial}
                    onClick={onLinkClick}
                >
                    <Icon name="star" size={20} />
                    Más vendidos
                </Link>

                {categories.map((category) => (
                    <Link
                        key={category._id}
                        to={`/category/${category._id}`}
                        className={navStyles.mobileLink}
                        onClick={onLinkClick}
                    >
                        <Icon name="chevronRight" size={16} />
                        {category.name}
                    </Link>
                ))}
            </div>
        );
    }

    /*  DESKTOP VERSION */
    return (
        <div className={`${navStyles.wrapper} ${navContrastFix.allWhite()}`}>
            <div className={navStyles.inner}>
                {/* CATEGORIES DROPDOWN */}
                <div className="relative">
                    <button
                        className={`${navStyles.dropdownButton} ${navContrastFix.dropdownButtonFix()}`}
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        onBlur={() => setTimeout(() => setIsDropdownOpen(false), 200)}
                    >
                        <Icon name="menu" size={16} />
                        <span>Todas las categorías</span>
                        <Icon name="chevronDown" size={14} />
                    </button>

                    {isDropdownOpen && (
                        <div className={`${navStyles.dropdownMenu} ${navContrastFix.dropdownStrong()}`}>
                            {categories.map((category) => {
                                const subcategories = getSubcategories(category._id);
                                return (
                                    <div
                                        key={category._id}
                                        className={navStyles.categoryGroup}
                                    >
                                        <Link
                                            to={`/category/${category._id}`}
                                            className={navStyles.mainCategoryLink}
                                        >
                                            {category.name}
                                            {subcategories.length > 0 && (
                                                <Icon name="chevronRight" size={12} />
                                            )}
                                        </Link>

                                        {subcategories.length > 0 && (
                                            <div className={navStyles.subcategoryList}>
                                                {subcategories.map((subcat) => (
                                                    <Link
                                                        key={subcat._id}
                                                        to={`/category/${subcat._id}`}
                                                        className={navStyles.subCategoryLink}
                                                    >
                                                        {subcat.name}
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

                {/* HORIZONTAL NAV */}
                <nav className={`${navStyles.navHorizontal} ${navContrastFix.navHorizontalFix()}`}>
                    <Link to="/new" className={navStyles.navLinkSpecial}>
                        Servicios
                    </Link>

                    <Link to="/bestsellers" className={navStyles.navLinkSpecial}>
                        Reparaciones
                    </Link>

                    <Link to="/bestsellers" className={navStyles.navLinkSpecial}>
                        Soporte
                    </Link>

                    <Link to="/bestsellers" className={navStyles.navLinkSpecial}>
                        Venta de Equipo
                    </Link>
                </nav>
            </div>
        </div>
    );
};

export default Navigation;
