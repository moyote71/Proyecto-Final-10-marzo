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
   GET MY CART (🔥 FIX)
========================= */
router.get(
  "/me",
  authMiddleware,
  (req, res, next) => {
    req.params.id = req.user.userId; // 🔥 FORZAR desde token
    next();
  },
  getCartByUser
);

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
  (req, res, next) => {
    req.body.userId = req.user.userId;
    next();
  },
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
  (req, res, next) => {
    req.body.userId = req.user.userId;
    next();
  },
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
  (req, res, next) => {
    req.body.userId = req.user.userId;
    next();
  },
  removeCartItem
);

/* =========================
   GET MY CART (TOKEN)
========================= */
router.get(
  "/me",
  authMiddleware,
  async (req, res, next) => {
    req.params.id = req.user.userId;
    next();
  },
  getCartByUser
);

/* =========================
   CLEAR CART
========================= */
router.post(
  "/clear",
  authMiddleware,
  (req, res, next) => {
    req.body.userId = req.user.userId;
    next();
  },
  clearCartItems
);

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

router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  [mongoIdValidation("id", "Cart ID")],
  validate,
  deleteCart
);

export default router;