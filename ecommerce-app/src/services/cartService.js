import { http } from "./http";

// Obtener o crear carrito para el usuario
export const fetchCart = async (userId) => {
    try {
        if (!userId) return { products: [] };
        
        const response = await http.get(`/cart/user/${userId}`);
        const data = response.data?.data || response.data;
        return data || { products: [] };
    } catch (error) {
        console.error("Error fetching cart from API", error);
        return { products: [] };
    }
};

export const addToCartAPI = async (userId, productId, quantity) => {
    if (!userId) throw new Error("User not authenticated");
    const response = await http.post("/cart/add-product", {
        userId,
        productId,
        quantity,
    });
    return response.data;
};

export const updateCartItemAPI = async (userId, productId, quantity) => {
    if (!userId) throw new Error("User not authenticated");
    const response = await http.put("/cart/update-item", {
        userId,
        productId,
        quantity,
    });
    return response.data;
};

export const removeFromCartAPI = async (userId, productId) => {
    if (!userId) throw new Error("User not authenticated");
    const response = await http.delete(`/cart/remove-item/${productId}`, {
        data: { userId }
    });
    return response.data;
};

export const clearCartAPI = async (userId) => {
    if (!userId) throw new Error("User not authenticated");
    const response = await http.post("/cart/clear", { userId });
    return response.data;
};
