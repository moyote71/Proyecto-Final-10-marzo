import { http } from "./http";

export const getWishList = async () => {
    const response = await http.get("/wishlist");
    return response.data?.data || response.data || [];
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
