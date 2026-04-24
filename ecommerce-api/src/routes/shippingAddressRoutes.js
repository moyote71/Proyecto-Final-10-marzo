import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  getShippingAddresses,
  getDefaultShippingAddress,
  createShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
} from "../controllers/shippingAddressController.js";

const router = express.Router();

/* =========================
   USER ADDRESSES
========================= */
router.get("/me", authMiddleware, getShippingAddresses);

/* =========================
   DEFAULT
========================= */
router.get("/default", authMiddleware, getDefaultShippingAddress);

/* =========================
   CREATE
========================= */
router.post("/", authMiddleware, createShippingAddress);

/* =========================
   UPDATE
========================= */
router.put("/:id", authMiddleware, updateShippingAddress);

/* =========================
   DELETE
========================= */
router.delete("/:id", authMiddleware, deleteShippingAddress);

export default router;