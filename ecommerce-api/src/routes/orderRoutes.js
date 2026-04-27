import express from "express";
import {
  checkout,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "../controllers/orderController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";
import validate from "../middlewares/validation.js";
import { mongoIdValidation } from "../middlewares/validators.js";

const router = express.Router();

/* =========================
   CHECKOUT
========================= */
router.post("/checkout", authMiddleware, checkout);

/* =========================
   USER ORDERS
========================= */
router.get("/my-orders", authMiddleware, getMyOrders);

/* =========================
   GET BY ID
========================= */
router.get(
  "/:id",
  authMiddleware,
  [mongoIdValidation("id", "Order ID")],
  validate,
  getOrderById
);

/* =========================
   ADMIN UPDATE
========================= */
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  [mongoIdValidation("id", "Order ID")],
  validate,
  updateOrderStatus
);

export default router;