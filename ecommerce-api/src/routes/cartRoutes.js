import express from "express";
import { body } from "express-validator";
import {
  addProductToCart,
  createCart,
  deleteCart,
  getCartById,
  getCartByUser,
  getCarts,
  updateCart,
  updateCartItem,
  removeCartItem,
  clearCartItems,
} from "../controllers/cartController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";
import validate from "../middlewares/validation.js";
import {
  mongoIdValidation,
  bodyMongoIdValidation,
  quantityValidation,
} from "../middlewares/validators.js";

const router = express.Router();

/* =========================
   ADMIN
========================= */
router.get("/", authMiddleware, isAdmin, getCarts);

/* =========================
   GET BY USER
========================= */
router.get(
  "/user/:id",
  authMiddleware,
  [mongoIdValidation("id", "User ID")],
  validate,
  getCartByUser
);

/* =========================
   ADD PRODUCT
========================= */
router.post(
  "/add-product",
  authMiddleware,
  [
    bodyMongoIdValidation("userId", "User ID"),
    bodyMongoIdValidation("productId", "Product ID"),
    quantityValidation("quantity", true),
  ],
  validate,
  addProductToCart
);

/* =========================
   UPDATE ITEM
========================= */
router.put(
  "/update-item",
  authMiddleware,
  [
    bodyMongoIdValidation("userId", "User ID"),
    bodyMongoIdValidation("productId", "Product ID"),
    quantityValidation("quantity", true),
  ],
  validate,
  updateCartItem
);

/* =========================
   REMOVE ITEM
========================= */
router.delete(
  "/remove-item/:productId",
  authMiddleware,
  [
    mongoIdValidation("productId", "Product ID"),
    bodyMongoIdValidation("userId", "User ID"),
  ],
  validate,
  removeCartItem
);

/* =========================
   CLEAR
========================= */
router.post(
  "/clear",
  authMiddleware,
  [bodyMongoIdValidation("userId", "User ID")],
  validate,
  clearCartItems
);

export default router;