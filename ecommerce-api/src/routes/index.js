import express from "express";

import authRoutes from "./authRoutes.js";
import cartRoutes from "./cartRoutes.js";
import categoryRoutes from "./categoryRoutes.js";
import notificationRoutes from "./notificationRoutes.js";
import orderRoutes from "./orderRoutes.js";
import paymentMethodRoutes from "./paymentMethodRoutes.js";
import productRoutes from "./productRoutes.js";
import reviewRoutes from "./reviewRoutes.js";
import shippingAddressRoutes from "./shippingAddressRoutes.js";
import userRoutes from "./userRoutes.js";
import wishListRoutes from "./wishListRoutes.js";

const router = express.Router();

// AUTH
router.use("/auth", authRoutes);

// USER
router.use("/users", userRoutes);

// CART
router.use("/cart", cartRoutes);

// CATEGORIES
router.use("/categories", categoryRoutes);

// NOTIFICATIONS
router.use("/notifications", notificationRoutes);

// PRODUCTS
router.use("/products", productRoutes);

// REVIEWS
router.use("/reviews", reviewRoutes);

// PAYMENT METHODS
router.use("/payment-methods", paymentMethodRoutes);

// SHIPPING ADDRESS (🔥 IMPORTANTE FIX)
router.use("/shipping-address", shippingAddressRoutes);

// ORDERS (🔥 TE FALTABA EXPUESTO)
router.use("/orders", orderRoutes);

// WISHLIST
router.use("/wishlist", wishListRoutes);

export default router;