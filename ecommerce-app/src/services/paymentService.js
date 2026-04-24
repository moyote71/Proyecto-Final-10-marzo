import { http } from "./http";

export const getPaymentMethods = async () => {
    try {
        const response = await http.get("/payment-methods/me");
        const raw = response.data;
        // Normalización consistente
        if (Array.isArray(raw)) return raw;
        if (Array.isArray(raw?.data)) return raw.data;
        return [];
    } catch (error) {
        console.error("Error fetching payment methods:", error);
        return [];
    }
};

export const getDefaultPaymentMethods = async () => {
    try {
        const response = await http.get("/payment-methods/default");
        return response.data?.data || response.data || null;
    } catch (error) {
        // 404 = no hay método por defecto
        if (error.response?.status !== 404) {
            console.error("Error fetching default payment method:", error);
        }
        return null;
    }
};

export const createPaymentMethod = async (paymentData) => {
    // El backend espera 'type', 'cardNumber', 'cardHolderName', 'expiryDate', 'cvv'
    const response = await http.post("/payment-methods", paymentData);
    return response.data?.data || response.data;
};

export const updatePaymentMethod = async (paymentId, paymentData) => {
    const response = await http.put(`/payment-methods/${paymentId}`, paymentData);
    return response.data?.data || response.data;
};

export const deletePaymentMethod = async (paymentId) => {
    const response = await http.delete(`/payment-methods/${paymentId}`);
    return response.data;
};
