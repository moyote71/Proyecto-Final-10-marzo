import { http } from "./http";

/**
 * Los servicios ahora son funciones asíncronas puras sin estado.
 * El caché y la invalidación están manejados por TanStack/React-Query,
 * previniendo stale data y sobrecarga de estado local / sessionStorage.
 */

export const fetchProducts = async () => {
    const data = await http.get("/products");
    // Extraer del body de axios (data.data) la propiedad .products si existe (paginación)
    const body = data?.data;
    return body?.products || body?.data || body || [];
};

export const searchProducts = async (query) => {
    const data = await http.get("/products/search?q=" + query);
    const body = data?.data;
    return body?.products || body?.data || body || [];
};

export const getProductsByCategory = async (categoryId) => {
    const products = await fetchProducts();
    // Alternativamente, se podría usar la ruta de API nativa: 
    // const data = await http.get(`/products/category/${categoryId}`);
    return products.filter((product) => product.category?._id === categoryId || product.category === categoryId);
};

export async function getProductById(id) {
    const data = await http.get(`/products/${id}`);
    const product = data?.data?.data || data?.data || data || null;
    return product;
}