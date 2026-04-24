import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import validate from "../middlewares/validation.js";
import {
  createShippingAddress,
  deleteShippingAddress,
  getAddressById,
  getDefaultAddress,
  getUserAddresses,
  setDefaultAddress,
  updateShippingAddress,
} from "../controllers/shippingAddressController.js";

import {
  nameValidation,
  addressLineValidation,
  cityValidation,
  stateValidation,
  postalCodeValidation,
  countryValidation,
  addressPhoneValidation,
  booleanValidation,
  addressTypeValidation,
  mongoIdValidation,
  nameOptionalValidation,
  addressLineOptionalValidation,
  cityOptionalValidation,
  stateOptionalValidation,
  postalCodeOptionalValidation,
  addressPhoneOptionalValidation,
} from "../middlewares/validators.js";

const router = express.Router();

const addressValidations = [
  nameValidation(),
  addressLineValidation(),
  cityValidation(),
  stateValidation(),
  postalCodeValidation(),
  countryValidation(),
  addressPhoneValidation(),
  booleanValidation("isDefault"),
  addressTypeValidation(),
];

// CREATE
router.post(
  "/shipping-address",
  authMiddleware,
  addressValidations,
  validate,
  createShippingAddress
);

// GET ALL
router.get("/shipping-address", authMiddleware, getUserAddresses);

// GET DEFAULT
router.get("/shipping-address/default", authMiddleware, getDefaultAddress);

// GET BY ID
router.get(
  "/shipping-address/:addressId",
  authMiddleware,
  [mongoIdValidation("addressId", "Address ID")],
  validate,
  getAddressById
);

// UPDATE
router.put(
  "/shipping-address/:addressId",
  authMiddleware,
  [
    mongoIdValidation("addressId", "Address ID"),
    nameOptionalValidation(),
    addressLineOptionalValidation(),
    cityOptionalValidation(),
    stateOptionalValidation(),
    postalCodeOptionalValidation(),
    countryValidation(),
    addressPhoneOptionalValidation(),
    booleanValidation("isDefault"),
    addressTypeValidation(),
  ],
  validate,
  updateShippingAddress
);

// SET DEFAULT
router.patch(
  "/shipping-address/:addressId/default",
  authMiddleware,
  [mongoIdValidation("addressId", "Address ID")],
  validate,
  setDefaultAddress
);

// DELETE
router.delete(
  "/shipping-address/:addressId",
  authMiddleware,
  [mongoIdValidation("addressId", "Address ID")],
  validate,
  deleteShippingAddress
);

export default router;