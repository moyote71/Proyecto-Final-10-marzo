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
import wishListRoutes from "./routes/wishListRoutes.js";

const router = express.Router();

/* =========================
   DEBUG (CLAVE PARA RENDER)
========================= */
console.log("📦 ROUTES INDEX LOADED");

/* =========================
   ROUTES
========================= */
router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/products", productRoutes);
router.use("/cart", cartRoutes);
router.use("/categories", categoryRoutes);
router.use("/notifications", notificationRoutes);
router.use("/orders", orderRoutes);
router.use("/payment-methods", paymentMethodRoutes);
router.use("/reviews", reviewRoutes);
router.use("/shipping-addresses", shippingAddressRoutes);
app.use("/api/wishlist", wishListRoutes);
export default router;