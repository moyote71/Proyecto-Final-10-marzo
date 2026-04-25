import { http } from "./http";

/* =========================
   GET REVIEWS
========================= */
export const getProductReviews = async (productId) => {
    const response = await http.get(`/reviews/product/${productId}`);
    return response.data?.reviews || [];
};

/* =========================
   ADD REVIEW (FIX VALIDACIÓN)
========================= */
export const addReview = async (productId, reviewData) => {
    const payload = {
        product: String(productId).trim(),
        rating: Number(reviewData.rating),
        comment: String(reviewData.comment || "").trim(),
    };

    console.log("SEND REVIEW FIXED:", payload);

    if (!payload.product || !payload.rating || !payload.comment) {
        throw new Error("Faltan datos en la reseña");
    }

    const response = await http.post("/reviews", payload);

    return response.data;
};

/* =========================
   DELETE REVIEW
========================= */
export const deleteReview = async (reviewId) => {
    return await http.delete(`/reviews/${reviewId}`);
};