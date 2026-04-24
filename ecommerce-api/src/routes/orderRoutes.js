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

router.get("/", authMiddleware, getOrders);
router.get("/me", authMiddleware, getOrdersByUser);
router.get("/:id", authMiddleware, getOrderById);

router.post("/", authMiddleware, createOrder);

router.patch("/:id/status", authMiddleware, updateOrderStatus);
router.patch("/:id/payment-status", authMiddleware, updatePaymentStatus);
router.patch("/:id/cancel", authMiddleware, cancelOrder);

router.delete("/:id", authMiddleware, deleteOrder);

export default router;