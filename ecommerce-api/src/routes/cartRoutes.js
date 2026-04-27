import express from "express";

import {
  addProductToCart,
  deleteCart,
  getCartById,
  getCartByUser,
  getCarts,
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
   GET MY CART (CLEAN FIX)
========================= */
router.get("/me", authMiddleware, getCartByUser);

/* =========================
   ADD PRODUCT
========================= */
router.post(
  "/add-product",
  authMiddleware,
  [
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
  [mongoIdValidation("productId", "Product ID")],
  validate,
  removeCartItem
);

/* =========================
   CLEAR CART
========================= */
router.post("/clear", authMiddleware, clearCartItems);

/* =========================
   ADMIN EXTRA
========================= */
router.get(
  "/:id",
  authMiddleware,
  isAdmin,
  [mongoIdValidation("id", "Cart ID")],
  validate,
  getCartById
);

router.delete("/:id", authMiddleware, isAdmin, deleteCart);

export default router;