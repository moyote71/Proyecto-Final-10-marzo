import { http } from "./http";

export const getShippingAddresses = async () => {
    try {
        const response = await http.get("/shipping-address");
        const raw = response.data;
        // Normalización consistente
        if (Array.isArray(raw)) return raw;
        if (Array.isArray(raw?.data)) return raw.data;
        return [];
    } catch (error) {
        console.error("Error fetching shipping addresses:", error);
        return [];
    }
};

export const getDefaultShippingAddress = async () => {
    try {
        const response = await http.get("/shipping-address/default");
        return response.data?.data || response.data || null;
    } catch (error) {
        // 404 significa que no hay dirección por defecto, no es un error crítico
        if (error.response?.status !== 404) {
            console.error("Error fetching default shipping address:", error);
        }
        return null;
    }
};

export const createShippingAddress = async (addressData) => {
    // El backend espera 'address', 'city', 'state', 'postalCode', 'country', 'phone'
    const response = await http.post("/shipping-address", addressData);
    return response.data?.data || response.data;
};

export const updateShippingAddress = async (addressId, addressData) => {
    const response = await http.put(`/shipping-address/${addressId}`, addressData);
    return response.data?.data || response.data;
};

export const deleteShippingAddress = async (addressId) => {
    const response = await http.delete(`/shipping-address/${addressId}`);
    return response.data;
};
