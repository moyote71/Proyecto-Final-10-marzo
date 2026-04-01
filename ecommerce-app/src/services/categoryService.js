import { http } from "./http";
import { fetchProducts } from "./productService";

export const fetchCategories = async () => {
    const response = await http.get("/categories");
    return response.data?.data || response.data || [];
};

export const searchCategories = async (query) => {
    const response = await http.get(`/categories/search?q=${query}`);
    return response.data?.data || response.data || [];
};

export const getCategoryById = async (categoryId) => {
    const response = await http.get(`/categories/${categoryId}`);
    return response.data?.data || response.data || null;
};

// Obtener todas las categorías hijas de una categoría padre
export const getChildCategories = async (parentCategoryId) => {
    const categories = await fetchCategories();
    return categories.filter((cat) => cat.parentCategory?._id === parentCategoryId || cat.parentCategory === parentCategoryId);
};

// Obtener productos por categoría específica
export const getProductsByCategory = async (categoryId) => {
    const allProducts = await fetchProducts();
    return allProducts.filter((product) => product.category?._id === categoryId || product.category === categoryId);
};

// Obtener productos de una categoría incluyendo sus subcategorías
export const getProductsByCategoryAndChildren = async (categoryId) => {
    const allProducts = await fetchProducts();
    const allCategories = await fetchCategories();

    // Encontrar la categoría
    const category = allCategories.find((cat) => cat._id === categoryId);
    if (!category) return [];

    // Si es una categoría padre (parentCategory is null o no tiene)
    if (!category.parentCategory) {
        // Obtener IDs de todas las categorías hijas
        const childCategoryIds = allCategories
            .filter((cat) => cat.parentCategory?._id === categoryId || cat.parentCategory === categoryId)
            .map((cat) => cat._id);

        // Incluir el ID de la categoría padre también
        const allCategoryIds = [categoryId, ...childCategoryIds];

        // Retornar productos de la categoría padre y sus hijas
        return allProducts.filter((product) => {
            const prodCatId = product.category?._id || product.category;
            return allCategoryIds.includes(prodCatId);
        });
    }

    // Si es una categoría hija, solo retornar sus productos
    return allProducts.filter((product) => {
         const prodCatId = product.category?._id || product.category;
         return prodCatId === categoryId;
    });
};

// Obtener categorías principales (sin padre)
export const getParentCategories = async () => {
    const categories = await fetchCategories();
    return categories.filter((cat) => !cat.parentCategory);
};
