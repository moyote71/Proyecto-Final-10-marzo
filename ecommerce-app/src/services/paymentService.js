import { http } from "./http";

/* =========================
   GET PAYMENT METHODS
========================= */
export const getPaymentMethods = async () => {
    try {
        const res = await http.get("/payment-methods/me");
        return res.data?.data || res.data || [];
    } catch (error) {
        console.error("Error fetching payment methods:", error);
        return [];
    }
};

/* =========================
   DEFAULT PAYMENT METHOD
========================= */
export const getDefaultPaymentMethod = async () => {
    try {
        const res = await http.get("/payment-methods/default");
        return res.data?.data || res.data || null;
    } catch (error) {
        if (error.response?.status !== 404) {
            console.error("Error fetching default payment:", error);
        }
        return null;
    }
};

/* =========================
   CREATE
========================= */
export const createPaymentMethod = async (data) => {
    const res = await http.post("/payment-methods", data);
    return res.data?.data || res.data;
};

/* =========================
   UPDATE
========================= */
export const updatePaymentMethod = async (id, data) => {
    const res = await http.put(`/payment-methods/${id}`, data);
    return res.data?.data || res.data;
};

/* =========================
   DELETE
========================= */
export const deletePaymentMethod = async (id) => {
    const res = await http.delete(`/payment-methods/${id}`);
    return res.data;
};