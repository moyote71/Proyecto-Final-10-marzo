import { http } from "./http";

/* =========================
   CREATE ORDER
========================= */
export const createOrder = async (orderData) => {
    try {
        const response = await http.post("/orders", orderData);
        return response.data;
    } catch (error) {
        console.error("Error creating order:", error?.response?.data || error.message);
        throw error;
    }
};

/* =========================
   GET MY ORDERS
========================= */
export const getMyOrders = async () => {
    try {
        const response = await http.get("/orders/me");
        return response.data || [];
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return [];
    }
};

/* =========================
   GET ORDER BY ID
========================= */
export const getOrderById = async (id) => {
    try {
        const response = await http.get(`/orders/${id}`);
        return response.data || null;
    } catch (error) {
        console.error("Error fetching order:", error);
        return null;
    }
};

/* =========================
   ADMIN - GET ALL ORDERS
========================= */
export const getAllOrders = async () => {
    try {
        const response = await http.get("/orders");
        return response.data || [];
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return [];
    }
};

/* =========================
   UPDATE STATUS
========================= */
export const updateOrderStatus = async (id, status) => {
    try {
        const response = await http.patch(`/orders/${id}/status`, { status });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/* =========================
   UPDATE PAYMENT STATUS
========================= */
export const updatePaymentStatus = async (id, paymentStatus) => {
    try {
        const response = await http.patch(`/orders/${id}/payment-status`, { paymentStatus });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/* =========================
   CANCEL ORDER
========================= */
export const cancelOrder = async (id) => {
    try {
        const response = await http.patch(`/orders/${id}/cancel`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/* =========================
   DELETE ORDER
========================= */
export const deleteOrder = async (id) => {
    try {
        const response = await http.delete(`/orders/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};