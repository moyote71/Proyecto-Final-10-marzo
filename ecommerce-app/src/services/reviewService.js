import { http } from "./http";

/* =========================
   GET REVIEWS BY PRODUCT
========================= */
export const getProductReviews = async (productId) => {
    const response = await http.get(`/review/product/${productId}`);
    return response.data?.reviews || response.data?.data || response.data || [];
};

/* =========================
   ADD REVIEW
========================= */
export const addReview = async (productId, reviewData) => {
    const response = await http.post("/review", {
        product: productId,
        rating: reviewData.rating,
        comment: reviewData.comment,
    });

    return response.data;
};

/* =========================
   DELETE REVIEW
========================= */
export const deleteReview = async (reviewId) => {
    const response = await http.delete(`/review/${reviewId}`);
    return response.data;
};