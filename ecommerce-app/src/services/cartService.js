import { http } from "./http";

/* =========================
   GET CART (FIXED)
========================= */
export const fetchCart = async (userId) => {
    try {
        if (!userId) return { products: [] };

        const res = await http.get(`/cart/user/${userId}`);

        return {
            products: res.data?.products || [],
        };
    } catch (err) {
        console.error("Cart fetch error:", err);
        return { products: [] };
    }
};

/* =========================
   ADD
========================= */
export const addToCartAPI = async (userId, productId, quantity = 1) => {
    const res = await http.post("/cart/add-product", {
        userId,
        productId,
        quantity,
    });

    return res.data;
};

/* =========================
   UPDATE
========================= */
export const updateCartItemAPI = async (userId, productId, quantity) => {
    const res = await http.put("/cart/update-item", {
        userId,
        productId,
        quantity,
    });

    return res.data;
};

/* =========================
   REMOVE
========================= */
export const removeFromCartAPI = async (userId, productId) => {
    const res = await http.delete(
        `/cart/remove-item/${productId}`,
        {
            data: { userId },
        }
    );

    return res.data;
};

/* =========================
   CLEAR
========================= */
export const clearCartAPI = async (userId) => {
    const res = await http.post("/cart/clear", { userId });

    return res.data;
};