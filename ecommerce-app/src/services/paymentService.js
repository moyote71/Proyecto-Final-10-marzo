import { http } from "./http";

export const getPaymentMethods = async () => {
    try {
        const response = await http.get("/payment-methods/me");
        return response.data?.data || response.data || [];
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
        console.error("Error fetching default payment method:", error);
        return null;
    }
};
