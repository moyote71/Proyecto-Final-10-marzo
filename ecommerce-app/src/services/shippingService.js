import { http } from "./http";

/* =========================
   GET SHIPPING ADDRESSES
========================= */
export const getShippingAddresses = async () => {
    try {
        const res = await http.get("/shipping-addresses/me");
        return res.data?.data || res.data || [];
    } catch (error) {
        console.error("Error fetching addresses:", error);
        return [];
    }
};

/* =========================
   DEFAULT SHIPPING ADDRESS
========================= */
export const getDefaultShippingAddress = async () => {
    try {
        const res = await http.get("/shipping-addresses/default");
        return res.data?.data || res.data || null;
    } catch (error) {
        if (error.response?.status !== 404) {
            console.error("Error fetching default address:", error);
        }
        return null;
    }
};

/* =========================
   CREATE
========================= */
export const createShippingAddress = async (data) => {
    const res = await http.post("/shipping-addresses", data);
    return res.data?.data || res.data;
};

/* =========================
   UPDATE
========================= */
export const updateShippingAddress = async (id, data) => {
    const res = await http.put(`/shipping-addresses/${id}`, data);
    return res.data?.data || res.data;
};

/* =========================
   DELETE
========================= */
export const deleteShippingAddress = async (id) => {
    const res = await http.delete(`/shipping-addresses/${id}`);
    return res.data;
};