import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  getShippingAddresses,
  getShippingAddressesByUser,
  getDefaultShippingAddress,
  createShippingAddress,
  updateShippingAddress,
  deleteShippingAddress,
} from "../controllers/shippingAddressController.js";

const router = express.Router();

/* =========================
   USER ADDRESSES
========================= */
router.get(
    "/shipping-addresses/me",
    authMiddleware,
    getShippingAddresses
);

/* =========================
   DEFAULT ADDRESS
========================= */
router.get(
    "/shipping-addresses/default",
    authMiddleware,
    getDefaultShippingAddress
);

/* =========================
   CREATE
========================= */
router.post(
    "/shipping-addresses",
    authMiddleware,
    createShippingAddress
);

/* =========================
   UPDATE
========================= */
router.put(
    "/shipping-addresses/:id",
    authMiddleware,
    updateShippingAddress
);

/* =========================
   DELETE
========================= */
router.delete(
    "/shipping-addresses/:id",
    authMiddleware,
    deleteShippingAddress
);

export default router;