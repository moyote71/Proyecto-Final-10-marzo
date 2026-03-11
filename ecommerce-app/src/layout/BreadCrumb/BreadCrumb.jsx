import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import Icon from "../../components/common/Icon/Icon";
import styles from "./BreadCrumbStyles";

const Breadcrumb = ({ categories = [] }) => {
    if (!categories || categories.length === 0) return null;

    const buildCategoryHierarchy = (category) => {
        const hierarchy = [];
        let current = category;

        while (current) {
            hierarchy.unshift(current);
            current = current.parentCategory;
        }
        return hierarchy;
    };

    const currentCategory = Array.isArray(categories)
        ? categories[categories.length - 1]
        : categories;

    const categoryHierarchy = buildCategoryHierarchy(currentCategory);

    return (
        <nav className={styles.nav()} aria-label="Navegación de categorías">
            <div className={styles.container()}>
                <ol className={styles.list()}>
                    {/* Inicio */}
                    <li className={styles.item()}>
                        <Link to="/" className={styles.link()}>
                            <Icon name="home" size={16} />
                            <span className={styles.text()}>Inicio</span>
                        </Link>
                    </li>

                    {/* Categorías */}
                    {categoryHierarchy.map((category, index) => {
                        const isLast = index === categoryHierarchy.length - 1;

                        return (
                            <li key={category._id} className={styles.item()}>
                                <Icon
                                    name="chevronRight"
                                    size={14}
                                    className={styles.separator()}
                                />

                                {isLast ? (
                                    <span
                                        className={styles.current()}
                                        aria-current="page"
                                    >
                                        {category.name}
                                    </span>
                                ) : (
                                    <Link
                                        to={`/category/${category._id}`}
                                        className={styles.link()}
                                    >
                                        {category.name}
                                    </Link>
                                )}
                            </li>
                        );
                    })}
                </ol>
            </div>
        </nav>
    );
};

Breadcrumb.propTypes = {
    categories: PropTypes.oneOfType([
        PropTypes.object,
        PropTypes.arrayOf(
            PropTypes.shape({
                _id: PropTypes.string.isRequired,
                name: PropTypes.string.isRequired,
                description: PropTypes.string,
                imageURL: PropTypes.string,
                parentCategory: PropTypes.object,
            })
        ),
    ]),
};

Breadcrumb.defaultProps = {
    categories: [],
};

export default Breadcrumb;
