import express from "express";
import {
  createReview,
  deleteReview,
  getProductReviews,
  getUserReviews,
  updateReview,
} from "../controllers/reviewController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validation.js";
import {
  mongoIdValidation,
  bodyMongoIdValidation,
  ratingValidation,
  commentValidation,
} from "../middlewares/validators.js";

const router = express.Router();

/* =========================
   CREATE REVIEW
========================= */
router.post(
  "/",
  authMiddleware,
  [
    bodyMongoIdValidation("product", "Product ID"),
    ratingValidation(),
    commentValidation(),
  ],
  validate,
  createReview
);

/* =========================
   GET REVIEWS BY PRODUCT
========================= */
router.get(
  "/product/:productId",
  [mongoIdValidation("productId", "Product ID")],
  validate,
  getProductReviews
);

/* =========================
   USER REVIEWS
========================= */
router.get("/my-reviews", authMiddleware, getUserReviews);

/* =========================
   UPDATE REVIEW
========================= */
router.put(
  "/:reviewId",
  authMiddleware,
  [
    mongoIdValidation("reviewId", "Review ID"),
    ratingValidation(true),
    commentValidation(),
  ],
  validate,
  updateReview
);

/* =========================
   DELETE REVIEW
========================= */
router.delete(
  "/:reviewId",
  authMiddleware,
  [mongoIdValidation("reviewId", "Review ID")],
  validate,
  deleteReview
);

export default router;