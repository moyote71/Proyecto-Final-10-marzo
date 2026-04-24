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

router.get("/me", authMiddleware, getShippingAddresses);

router.get("/default", authMiddleware, getDefaultShippingAddress);

router.post("/", authMiddleware, createShippingAddress);

router.put("/:id", authMiddleware, updateShippingAddress);

router.delete("/:id", authMiddleware, deleteShippingAddress);

export default router;