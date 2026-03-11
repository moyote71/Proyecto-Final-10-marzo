import products from '../data/products.json';
import { http } from './http';

export const fetchProducts = async () => {
    const data = await http.get("products");
    return data?.data || data || [];
};

export const searchProducts = async (query) => {
    const data = await http.get("products/search?q=" + query);
    return data?.data || data || [];
};

export const getProductsByCategory = async (categoryId) => {
    return fetchProducts().then((data) =>
        data.filter((product) => product.category?._id === categoryId)
    );
};

export async function getProductById(id) {
    // Simulación de delay y búsqueda en mock data
    await new Promise((res) => setTimeout(res, 300));
    const products = await fetchProducts();
    return products.find((p) => p._id === id);
}