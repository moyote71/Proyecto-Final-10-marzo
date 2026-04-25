import { http } from "./http";

/* =========================
   GET REVIEWS
========================= */
export const getProductReviews = async (productId) => {
    const response = await http.get(`/reviews/product/${productId}`);
    return response.data?.reviews || [];
};

export const addReview = async (productId, reviewData) => {
    const payload = {
        product: productId,
        rating: Number(reviewData.rating), // asegura número
        comment: reviewData.comment?.trim(),
    };

    console.log("SEND REVIEW FIXED:", payload);

    const response = await http.post("/reviews", payload);

    return response.data;
};

/* =========================
   DELETE REVIEW
========================= */
export const deleteReview = async (reviewId) => {
    return await http.delete(`/reviews/${reviewId}`);
};