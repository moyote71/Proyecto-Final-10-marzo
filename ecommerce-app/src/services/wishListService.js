import { http } from "./http";

/**
 * TODAS las funciones normalizan la respuesta del backend.
 * getWishList() SIEMPRE retorna un array limpio [].
 */

export const getWishList = async () => {
    const response = await http.get("/wishlist");
    const raw = response.data;

    // Normalizar: el backend puede responder como:
    //   { wishlist: [...] }  |  { data: [...] }  |  [...]  |  { items: [...] }
    if (Array.isArray(raw)) return raw;
    if (Array.isArray(raw?.wishlist)) return raw.wishlist;
    if (Array.isArray(raw?.data)) return raw.data;
    if (Array.isArray(raw?.items)) return raw.items;
    return [];
};

export const checkProductInWishList = async (productId) => {
    const response = await http.get(`/wishlist/check/${productId}`);
    return response.data?.inWishList || false;
};

export const addToWishList = async (productId) => {
    const response = await http.post("/wishlist/add", { productId });
    return response.data;
};

export const removeFromWishList = async (productId) => {
    const response = await http.delete(`/wishlist/remove/${productId}`);
    return response.data;
};

export const moveToCart = async (productId) => {
    const response = await http.post("/wishlist/move-to-cart", { productId });
    return response.data;
};

export const clearWishList = async () => {
    const response = await http.delete("/wishlist/clear");
    return response.data;
};
