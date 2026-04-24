import { http } from "./http";

const extract = (res) => res?.data?.data ?? res?.data ?? null;

export const getPaymentMethods = async () => {
    try {
        const res = await http.get("/payment-methods/me");
        const data = extract(res);
        return Array.isArray(data) ? data : [];
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const getDefaultPaymentMethod = async () => {
    try {
        const res = await http.get("/payment-methods/default");
        return extract(res);
    } catch (err) {
        if (err.response?.status !== 404) {
            console.error(err);
        }
        return null;
    }
};

export const createPaymentMethod = async (data) => {
    const res = await http.post("/payment-methods", data);
    return extract(res);
};

export const updatePaymentMethod = async (id, data) => {
    const res = await http.put(`/payment-methods/${id}`, data);
    return extract(res);
};

export const deletePaymentMethod = async (id) => {
    const res = await http.delete(`/payment-methods/${id}`);
    return extract(res);
};