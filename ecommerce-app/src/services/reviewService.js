import { http } from "./http";

/* =========================
   GET REVIEWS BY PRODUCT
========================= */
export const getProductReviews = async (productId) => {
    const response = await http.get(`/reviews/product/${productId}`);
    return response.data?.reviews || response.data?.data || response.data || [];
};

/* =========================
   ADD REVIEW (FIXED)
========================= */
export const addReview = async (productId, reviewData) => {
    const payload = {
        product: productId,
        rating: Number(reviewData.rating),
        comment: reviewData.comment?.trim(),
    };

    console.log("SEND REVIEW:", payload);

    const response = await http.post("/reviews/review", payload);

    return response.data;
};

/* =========================
   DELETE REVIEW
========================= */
export const deleteReview = async (reviewId) => {
    const response = await http.delete(`/reviews/${reviewId}`);
    return response.data;
};