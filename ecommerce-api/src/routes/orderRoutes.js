import express from "express";
import {
  cancelOrder,
  createOrder,
  deleteOrder,
  getOrderById,
  getOrders,
  getOrdersByUser,
  updateOrder,
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
router.get("/orders", authMiddleware, isAdmin, getOrders);

/* =========================
   USER - MY ORDERS
   🔥 FIX: NO userId param, usa token
========================= */
router.get("/orders/me", authMiddleware, (req, res, next) => {
  req.params.userId = req.user.userId;
  next();
}, getOrdersByUser);

/* =========================
   GET ORDER BY ID
========================= */
router.get(
  "/orders/:id",
  authMiddleware,
  [mongoIdValidation("id", "Order ID")],
  validate,
  getOrderById
);

/* =========================
   CREATE ORDER
   🔥 IMPORTANTE: user viene del token
========================= */
router.post(
  "/orders",
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
   CANCEL ORDER (ADMIN ONLY)
========================= */
router.patch(
  "/orders/:id/cancel",
  authMiddleware,
  isAdmin,
  [mongoIdValidation("id", "Order ID")],
  validate,
  cancelOrder
);

/* =========================
   STATUS UPDATE
========================= */
router.patch(
  "/orders/:id/status",
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
  "/orders/:id/payment-status",
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
   UPDATE ORDER (ADMIN)
========================= */
router.put(
  "/orders/:id",
  authMiddleware,
  isAdmin,
  [
    mongoIdValidation("id", "Order ID"),
    orderStatusValidation(true),
    paymentStatusValidation(true),
    shippingCostValidation(),
  ],
  validate,
  updateOrder
);

/* =========================
   DELETE ORDER (ADMIN)
========================= */
router.delete(
  "/orders/:id",
  authMiddleware,
  isAdmin,
  [mongoIdValidation("id", "Order ID")],
  validate,
  deleteOrder
);

export default router;