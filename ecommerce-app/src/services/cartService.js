import { http } from "./http";

/* =========================
   GET CART (CORRECTO)
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
export const addToCartAPI = async (productId, quantity = 1) => {
    const res = await http.post("/cart/add-product", {
        productId,
        quantity,
    });

    return res.data;
};

/* =========================
   UPDATE
========================= */
export const updateCartItemAPI = async (productId, quantity) => {
    const res = await http.put("/cart/update-item", {
        productId,
        quantity,
    });

    return res.data;
};

/* =========================
   REMOVE
========================= */
export const removeFromCartAPI = async (productId) => {
    const res = await http.delete(`/cart/remove-item/${productId}`);

    return res.data;
};

/* =========================
   CLEAR
========================= */
export const clearCartAPI = async () => {
    const res = await http.post("/cart/clear");

    return res.data;
};