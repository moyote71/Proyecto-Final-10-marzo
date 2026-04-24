import express from "express";

import {
  cancelOrder,
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  getOrdersByUser,
  updateOrderStatus,
  updatePaymentStatus,
} from "../controllers/orderController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";
import validate from "../middlewares/validation.js";

import {
  mongoIdValidation,
  orderStatusValidation,
  paymentStatusValidation,
  shippingCostValidation,
  bodyMongoIdValidation,
} from "../middlewares/validators.js";

const router = express.Router();

/* =========================
   ADMIN - ALL ORDERS
========================= */
router.get("/", authMiddleware, isAdmin, getOrders);

/* =========================
   USER ORDERS
========================= */
router.get("/me", authMiddleware, getOrdersByUser);

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
   CREATE ORDER
========================= */
router.post(
  "/",
  authMiddleware,
  [
    bodyMongoIdValidation("shippingAddress", "Shipping address"),
    bodyMongoIdValidation("paymentMethod", "Payment method"),
    shippingCostValidation(),
  ],
  validate,
  createOrder
);

/* =========================
   STATUS UPDATE
========================= */
router.patch(
  "/:id/status",
  authMiddleware,
  isAdmin,
  [
    mongoIdValidation("id", "Order ID"),
    orderStatusValidation(),
  ],
  validate,
  updateOrderStatus
);

/* =========================
   PAYMENT STATUS
========================= */
router.patch(
  "/:id/payment-status",
  authMiddleware,
  isAdmin,
  [
    mongoIdValidation("id", "Order ID"),
    paymentStatusValidation(),
  ],
  validate,
  updatePaymentStatus
);

/* =========================
   CANCEL ORDER
========================= */
router.patch(
  "/:id/cancel",
  authMiddleware,
  isAdmin,
  [mongoIdValidation("id", "Order ID")],
  validate,
  cancelOrder
);

/* =========================
   DELETE ORDER
========================= */
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  [mongoIdValidation("id", "Order ID")],
  validate,
  deleteOrder
);

export default router;