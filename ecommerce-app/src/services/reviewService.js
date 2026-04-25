import { http } from "./http";

export const getProductReviews = async (productId) => {
    const response = await http.get(`/reviews/product/${productId}`);
    return response.data?.reviews || response.data?.data || response.data || [];
};

export const addReview = async (productId, reviewData) => {
    return await http.post("/reviews", {
        product: productId,
        rating: reviewData.rating,
        comment: reviewData.comment,
    });
};

export const deleteReview = async (reviewId) => {
    return await http.delete(`/reviews/${reviewId}`);
};