import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductByCategory,
  getProductById,
  getProducts,
  searchProducts,
  updateProduct,
} from "../controllers/productController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";
import validate from "../middlewares/validation.js";

import {
  mongoIdValidation,
} from "../middlewares/validators.js";

const router = express.Router();

/* =========================
   GET ALL PRODUCTS
========================= */
router.get("/", getProducts);

/* =========================
   SEARCH
========================= */
router.get("/search", searchProducts);

/* =========================
   GET BY CATEGORY (🔥 FIX FINAL)
========================= */
router.get("/category/idCategory", getProductByCategory);

/* =========================
   GET BY ID
========================= */
router.get(
  "/:id",
  [mongoIdValidation("id", "Product ID")],
  validate,
  getProductById
);

/* =========================
   CREATE
========================= */
router.post("/", authMiddleware, isAdmin, createProduct);

/* =========================
   UPDATE
========================= */
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  updateProduct
);

/* =========================
   DELETE
========================= */
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  deleteProduct
);

export default router;