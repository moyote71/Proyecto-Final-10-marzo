import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  getOrders,
  getOrderById,
  getOrdersByUser,
  createOrder,
  updateOrderStatus,
  updatePaymentStatus,
  cancelOrder,
  deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

/* =========================
   ORDERS ROUTES
========================= */

// ADMIN
router.get("/", authMiddleware, getOrders);

// USER (LOGGED IN)
router.get("/me", authMiddleware, getOrdersByUser);

// SINGLE ORDER
router.get("/:id", authMiddleware, getOrderById);

// CREATE ORDER
router.post("/", authMiddleware, createOrder);

// STATUS UPDATES
router.patch("/:id/status", authMiddleware, updateOrderStatus);
router.patch("/:id/payment-status", authMiddleware, updatePaymentStatus);
router.patch("/:id/cancel", authMiddleware, cancelOrder);

// DELETE
router.delete("/:id", authMiddleware, deleteOrder);

export default router;