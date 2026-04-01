import { http } from "./http";

export const getProductReviews = async (productId) => {
    const response = await http.get(`/review/${productId}`);
    return response.data?.data || response.data || [];
};

export const addReview = async (productId, reviewData) => {
    // reviewData shape: { comment, score }
    const response = await http.post(`/review/${productId}`, reviewData);
    return response.data;
};

export const deleteReview = async (reviewId) => {
    const response = await http.delete(`/review/${reviewId}`);
    return response.data;
};
