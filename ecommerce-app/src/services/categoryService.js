import { http } from "./http";

/* =========================
   CATEGORIES
========================= */
export const fetchCategories = async () => {
    const res = await http.get("/categories");
    return res.data || [];
};

export const getCategoryBySlug = async (slug) => {
    const res = await http.get(`/categories/slug/${slug}`);
    return res.data;
};

/* =========================
   PRODUCTS BY CATEGORY (BACKEND POWERED)
========================= */
export const getProductsByCategory = async (categoryId) => {
    const res = await http.get(`/products/category/${categoryId}`);
    return res.data || [];
};

/* =========================
   CATEGORY + CHILDREN (FRONT LOGIC OPTIMIZED)
========================= */
export const getProductsByCategoryAndChildren = async (categoryId) => {
    const [products, categories] = await Promise.all([
        http.get(`/products/category/${categoryId}`).then(r => r.data || []),
        http.get("/categories").then(r => r.data || []),
    ]);

    const category = categories.find(c => c._id === categoryId);
    if (!category) return products;

    const isParent = !category.parentCategory;

    if (!isParent) return products;

    const children = categories
        .filter(c => {
            const parentId =
                typeof c.parentCategory === "object"
                    ? c.parentCategory?._id
                    : c.parentCategory;

            return parentId === categoryId;
        })
        .map(c => c._id);

    const allIds = [categoryId, ...children];

    return products.filter(p =>
        allIds.includes(
            typeof p.category === "object" ? p.category?._id : p.category
        )
    );
};

/* =========================
   OPTIONAL
========================= */
export const getParentCategories = async () => {
    const res = await http.get("/categories");
    return (res.data || []).filter(c => !c.parentCategory);
};