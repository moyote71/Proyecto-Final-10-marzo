import { http } from "./http";
import { fetchProducts } from "./productService";

/* =========================
   GET ALL CATEGORIES
========================= */
export const fetchCategories = async () => {
    const response = await http.get("/categories");
    return response.data?.data || response.data || [];
};

/* =========================
   SEARCH
========================= */
export const searchCategories = async (query) => {
    const response = await http.get(`/categories/search?q=${query}`);
    return response.data?.data || response.data || [];
};

/* =========================
   GET BY ID (LEGACY)
========================= */
export const getCategoryById = async (categoryId) => {
    const response = await http.get(`/categories/${categoryId}`);
    return response.data?.data || response.data || null;
};

/* =========================
   GET BY SLUG (NUEVO)
========================= */
export const getCategoryBySlug = async (slug) => {
    const response = await http.get(`/categories/slug/${slug}`);
    return response.data?.data || response.data || null;
};

/* =========================
   CHILD CATEGORIES
========================= */
export const getChildCategories = async (parentCategoryId) => {
    const categories = await fetchCategories();

    return categories.filter((cat) => {
        const parentId =
            typeof cat.parentCategory === "object"
                ? cat.parentCategory?._id
                : cat.parentCategory;

        return parentId === parentCategoryId;
    });
};

/* =========================
   PRODUCTS BY CATEGORY
========================= */
export const getProductsByCategory = async (categoryId) => {
    const allProducts = await fetchProducts();

    return allProducts.filter((product) => {
        const prodCatId =
            typeof product.category === "object"
                ? product.category?._id
                : product.category;

        return prodCatId === categoryId;
    });
};

/* =========================
   PRODUCTS BY CATEGORY + CHILDREN
========================= */
export const getProductsByCategoryAndChildren = async (categoryId) => {
    const allProducts = await fetchProducts();
    const allCategories = await fetchCategories();

    const category = allCategories.find(
        (cat) => cat._id === categoryId
    );

    if (!category) return [];

    const isParent = !category.parentCategory;

    if (isParent) {
        const childCategoryIds = allCategories
            .filter((cat) => {
                const parentId =
                    typeof cat.parentCategory === "object"
                        ? cat.parentCategory?._id
                        : cat.parentCategory;

                return parentId === categoryId;
            })
            .map((cat) => cat._id);

        const allCategoryIds = [categoryId, ...childCategoryIds];

        return allProducts.filter((product) => {
            const prodCatId =
                typeof product.category === "object"
                    ? product.category?._id
                    : product.category;

            return allCategoryIds.includes(prodCatId);
        });
    }

    return allProducts.filter((product) => {
        const prodCatId =
            typeof product.category === "object"
                ? product.category?._id
                : product.category;

        return prodCatId === categoryId;
    });
};

/* =========================
   PARENT CATEGORIES
========================= */
export const getParentCategories = async () => {
    const categories = await fetchCategories();
    return categories.filter((cat) => !cat.parentCategory);
};