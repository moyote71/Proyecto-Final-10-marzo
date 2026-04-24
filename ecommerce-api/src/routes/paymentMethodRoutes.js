import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  getPaymentMethodsByUser,
  getDefaultPaymentMethod,
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../controllers/paymentMethodController.js";

const router = express.Router();

router.get("/me", authMiddleware, getPaymentMethodsByUser);
router.get("/default", authMiddleware, getDefaultPaymentMethod);
router.post("/", authMiddleware, createPaymentMethod);
router.put("/:id", authMiddleware, updatePaymentMethod);
router.delete("/:id", authMiddleware, deletePaymentMethod);

export default router;