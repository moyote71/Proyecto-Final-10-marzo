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

// 🔐 AUTH
router.use("/auth", authRoutes);

// 👤 USERS (IMPORTANTE para /users/profile)
router.use("/users", userRoutes);

// 🛍 PRODUCTS (CRÍTICO)
router.use("/products", productRoutes);

// 🛒 CART
router.use("/cart", cartRoutes);

// 📦 CATEGORIES
router.use("/categories", categoryRoutes);

// 🔔 NOTIFICATIONS
router.use("/notifications", notificationRoutes);

// 📦 ORDERS
router.use("/orders", orderRoutes);

// 💳 PAYMENTS
router.use("/payment-methods", paymentMethodRoutes);

// ⭐ REVIEWS
router.use("/reviews", reviewRoutes);

// 📍 SHIPPING
router.use("/shipping-address", shippingAddressRoutes);

// ❤️ WISHLIST
router.use("/wishlist", wishListRoutes);

export default router;