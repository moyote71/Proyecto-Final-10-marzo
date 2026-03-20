import products from '../data/products.json';
import { http } from './http';

let productsCache = null;
let cacheTimestamp = 0;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutos

export const fetchProducts = async () => {
    const now = Date.now();
    
    // 1. Intentar Caché en Memoria
    if (productsCache && (now - cacheTimestamp < CACHE_TTL)) {
        return productsCache;
    }

    // 2. Intentar Caché en SessionStorage
    try {
        const storedStr = sessionStorage.getItem("productsCache");
        const storedTime = sessionStorage.getItem("productsCacheTime");
        
        if (storedStr && storedTime && (now - Number(storedTime) < CACHE_TTL)) {
            productsCache = JSON.parse(storedStr);
            cacheTimestamp = Number(storedTime);
            return productsCache;
        }
    } catch(e) { /* ignore sessionStorage errors */ }

    // 3. Fetch real a la API
    const data = await http.get("products");
    const responseArray = data?.data || data || [];

    // Guardar Caché
    productsCache = responseArray;
    cacheTimestamp = now;
    try {
        sessionStorage.setItem("productsCache", JSON.stringify(responseArray));
        sessionStorage.setItem("productsCacheTime", now.toString());
    } catch(e) { /* ignore StorageQuotas */ }

    return responseArray;
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