import express from "express";

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
   GET CART BY USER (TOKEN SAFE)
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
    bodyMongoIdValidation("productId", "Product ID"),
    quantityValidation("quantity", true),
  ],
  validate,
  (req, res, next) => {
    req.body.userId = req.user.userId; // 🔥 inyectar desde token
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
    req.body.userId = req.user.userId; // 🔥 token
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
  [
    mongoIdValidation("productId", "Product ID"),
  ],
  validate,
  (req, res, next) => {
    req.body.userId = req.user.userId; // 🔥 token (NO body externo)
    next();
  },
  removeCartItem
);

/* =========================
   CLEAR CART
========================= */
router.post(
  "/clear",
  authMiddleware,
  [],
  (req, res, next) => {
    req.body.userId = req.user.userId; // 🔥 token
    next();
  },
  clearCartItems
);

/* =========================
   (OPCIONAL) GET BY ID ADMIN
========================= */
router.get(
  "/:id",
  authMiddleware,
  isAdmin,
  [mongoIdValidation("id", "Cart ID")],
  validate,
  getCartById
);

/* =========================
   (OPCIONAL) DELETE CART ADMIN
========================= */
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  [mongoIdValidation("id", "Cart ID")],
  validate,
  deleteCart
);

export default router;