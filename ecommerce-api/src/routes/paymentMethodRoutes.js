import express from "express";

import {
  createPaymentMethod,
  deactivatePaymentMethod,
  deletePaymentMethod,
  getDefaultPaymentMethod,
  getPaymentMethodById,
  getPaymentMethods,
  getPaymentMethodsByUser,
  setDefaultPaymentMethod,
  updatePaymentMethod,
} from "../controllers/paymentMethodController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";
import validate from "../middlewares/validation.js";

import {
  accountNumberValidation,
  bankNameValidation,
  booleanValidation,
  cardHolderNameValidation,
  cardNumberValidation,
  expiryDateValidation,
  mongoIdValidation,
  paymentTypeValidation,
  paypalEmailValidation,
} from "../middlewares/validators.js";

const router = express.Router();

/* =========================
   ADMIN
========================= */
router.get("/", authMiddleware, isAdmin, getPaymentMethods);

/* =========================
   USER
========================= */
router.get("/default", authMiddleware, getDefaultPaymentMethod);
router.get("/me", authMiddleware, getPaymentMethodsByUser);

/* =========================
   GET BY ID
========================= */
router.get(
  "/:id",
  authMiddleware,
  [mongoIdValidation("id", "Payment method ID")],
  validate,
  getPaymentMethodById
);

/* =========================
   CREATE
========================= */
router.post(
  "/",
  authMiddleware,
  [
    paymentTypeValidation(),
    cardNumberValidation(),
    cardHolderNameValidation(),
    expiryDateValidation(),
    paypalEmailValidation(),
    bankNameValidation(),
    accountNumberValidation(),
    booleanValidation("isDefault"),
  ],
  validate,
  createPaymentMethod
);

/* =========================
   SET DEFAULT
========================= */
router.patch(
  "/:id/set-default",
  authMiddleware,
  [mongoIdValidation("id", "Payment method ID")],
  validate,
  setDefaultPaymentMethod
);

/* =========================
   UPDATE
========================= */
router.put(
  "/:id",
  authMiddleware,
  [
    mongoIdValidation("id", "Payment method ID"),
    cardHolderNameValidation(),
    expiryDateValidation(),
    paypalEmailValidation(),
    bankNameValidation(),
    accountNumberValidation(),
    booleanValidation("isDefault"),
  ],
  validate,
  updatePaymentMethod
);

/* =========================
   DELETE
========================= */
router.delete(
  "/:id",
  authMiddleware,
  [mongoIdValidation("id", "Payment method ID")],
  validate,
  deletePaymentMethod
);

export default router;