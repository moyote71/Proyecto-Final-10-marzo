import { http } from "./http";

export const getShippingAddresses = async () => {
    try {
        const response = await http.get("/shipping-address");
        return response.data?.data || response.data || [];
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
        console.error("Error fetching default shipping address:", error);
        return null;
    }
};
