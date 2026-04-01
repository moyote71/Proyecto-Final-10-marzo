import { http } from "./http";
import { getCurrentUser } from "../utils/auth";

// Asumimos que podemos recuperar al userId localmente de la sesión
const getUserId = () => {
    const user = getCurrentUser();
    return user ? user._id : null;
};

// Obtener o crear carrito para el usuario
export const fetchCart = async () => {
    try {
        const userId = getUserId();
        if (!userId) return { products: [] };
        
        const response = await http.get(`/cart/user/${userId}`);
        const data = response.data?.data || response.data;
        return data || { products: [] };
    } catch (error) {
        console.error("Error fetching cart from API", error);
        return { products: [] };
    }
};

export const addToCartAPI = async (productId, quantity) => {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    const userId = user._id;
    const response = await http.post("/cart/add-product", {
        userId,
        productId,
        quantity,
    });
    return response.data;
};

export const updateCartItemAPI = async (productId, quantity) => {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    const userId = user._id;
    const response = await http.put("/cart/update-item", {
        userId,
        productId,
        quantity,
    });
    return response.data;
};

export const removeFromCartAPI = async (productId) => {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    const userId = user._id;
    const response = await http.delete(`/cart/remove-item/${productId}`, {
        data: { userId }
    });
    return response.data;
};

export const clearCartAPI = async () => {
    const user = getCurrentUser();
    if (!user) throw new Error("User not authenticated");
    const userId = user._id;
    const response = await http.post("/cart/clear", { userId });
    return response.data;
};
