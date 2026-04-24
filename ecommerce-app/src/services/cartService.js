import { http } from "./http";

/* =========================
   GET CART
========================= */
export const fetchCart = async (userId) => {
    try {
        if (!userId) return { products: [] };

        const res = await http.get(`/cart/user/${userId}`);

        // backend devuelve { message, cart }
        const data = res.data?.cart || res.data?.data || res.data;

        if (!data || !data.products) return { products: [] };

        return data;
    } catch (error) {
        console.error("fetchCart error:", error);
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