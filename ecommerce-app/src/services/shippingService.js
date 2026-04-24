import { http } from "./http";

const extract = (res) => res?.data?.data ?? res?.data ?? null;

export const getShippingAddresses = async () => {
    try {
        const res = await http.get("/shipping-address");
        return extract(res) || [];
    } catch (err) {
        console.error(err);
        return [];
    }
};

export const getDefaultShippingAddress = async () => {
    try {
        const res = await http.get("/shipping-address/default");
        return extract(res);
    } catch (err) {
        if (err.response?.status !== 404) {
            console.error(err);
        }
        return null;
    }
};

export const createShippingAddress = async (data) => {
    const res = await http.post("/shipping-address", data);
    return extract(res);
};

export const updateShippingAddress = async (id, data) => {
    const res = await http.put(`/shipping-address/${id}`, data);
    return extract(res);
};

export const deleteShippingAddress = async (id) => {
    const res = await http.delete(`/shipping-address/${id}`);
    return extract(res);
};