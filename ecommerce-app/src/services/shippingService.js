import { http } from "./http";

const extractData = (response) => response?.data?.data ?? response?.data ?? null;

export const getShippingAddresses = async () => {
    try {
        const response = await http.get("/shipping-address");
        const raw = extractData(response);

        if (Array.isArray(raw)) return raw;
        return [];
    } catch (error) {
        console.error("Error fetching shipping addresses:", error?.message);
        return [];
    }
};

export const getDefaultShippingAddress = async () => {
    try {
        const response = await http.get("/shipping-address/default");
        return extractData(response);
    } catch (error) {
        // 404 = no default address (caso normal)
        if (error.response?.status !== 404) {
            console.error("Error fetching default shipping address:", error?.message);
        }
        return null;
    }
};

export const createShippingAddress = async (addressData) => {
    try {
        const response = await http.post("/shipping-address", addressData);
        return extractData(response);
    } catch (error) {
        console.error("Error creating shipping address:", error?.response?.data || error.message);
        throw error;
    }
};

export const updateShippingAddress = async (addressId, addressData) => {
    try {
        const response = await http.put(`/shipping-address/${addressId}`, addressData);
        return extractData(response);
    } catch (error) {
        console.error("Error updating shipping address:", error?.response?.data || error.message);
        throw error;
    }
};

export const deleteShippingAddress = async (addressId) => {
    try {
        const response = await http.delete(`/shipping-address/${addressId}`);
        return extractData(response);
    } catch (error) {
        console.error("Error deleting shipping address:", error?.response?.data || error.message);
        throw error;
    }
};