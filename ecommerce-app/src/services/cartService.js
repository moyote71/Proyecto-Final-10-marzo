import { http } from "./http";

/* =========================
   GET CART
========================= */
export const fetchCart = async (userId) => {
    try {
        if (!userId) return { products: [] };

        const response = await http.get(`/cart/user/${userId}`);

        const data = response.data?.cart || response.data;

        return data || { products: [] };
    } catch (error) {
        console.error("Cart fetch error:", error);

        // 🔥 NUNCA ROMPER UI
        return { products: [] };
    }
};

/* =========================
   ADD PRODUCT
========================= */
export const addToCartAPI = async (userId, productId, quantity = 1) => {
    if (!userId) throw new Error("User not authenticated");

    const res = await http.post("/cart/add-product", {
        userId,
        productId,
        quantity,
    });

    return res.data;
};

/* =========================
   UPDATE ITEM
========================= */
export const updateCartItemAPI = async (userId, productId, quantity) => {
    if (!userId) throw new Error("User not authenticated");

    const res = await http.put("/cart/update-item", {
        userId,
        productId,
        quantity,
    });

    return res.data;
};

/* =========================
   REMOVE ITEM
========================= */
export const removeFromCartAPI = async (userId, productId) => {
    if (!userId) throw new Error("User not authenticated");

    const res = await http.delete(`/cart/remove-item/${productId}`, {
        data: { userId },
    });

    return res.data;
};

/* =========================
   CLEAR CART
========================= */
export const clearCartAPI = async (userId) => {
    if (!userId) throw new Error("User not authenticated");

    const res = await http.post("/cart/clear", { userId });

    return res.data;
};  