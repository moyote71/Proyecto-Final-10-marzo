import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import dbConnection from "./src/config/database.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import logger from "./src/middlewares/logger.js";
import { apiLimiter } from "./src/middlewares/rateLimiter.js";
import routes from "./src/routes/index.js";

console.log("🚀 SERVER BOOTING...");

dotenv.config();

const app = express();

/* =========================
   TRUST PROXY (RENDER FIX)
========================= */
app.set("trust proxy", 1);

/* =========================
   DB
========================= */
if (process.env.NODE_ENV !== "test") {
  dbConnection();
}

/* =========================
   CORS (SIMPLIFICADO Y SEGURO)
========================= */
app.use(
  cors({
    origin: process.env.CORS_ORIGIN?.split(",") || "*",
    credentials: true,
  })
);

/* =========================
   MIDDLEWARES
========================= */
app.use(express.json());
app.use(cookieParser());
app.use(logger);
app.use("/api", apiLimiter);

/* =========================
   HEALTH
========================= */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    db: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

/* =========================
   ROOT
========================= */
app.get("/", (req, res) => {
  res.json({
    message: "E-commerce API",
    status: "running",
  });
});

/* =========================
   DEBUG CRÍTICO
========================= */
console.log("🔥 ROUTES LOADING...");

/* =========================
   API ROUTES
========================= */
app.use("/api", routes);

console.log("✅ ROUTES REGISTERED");

/* =========================
   404 HANDLER
========================= */
app.use((req, res) => {
  res.status(404).json({
    error: "Route not found",
    method: req.method,
    url: req.originalUrl,
  });
});

/* =========================
   ERROR HANDLER
========================= */
app.use(errorHandler);

/* =========================
   START SERVER
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📦 API ready at /api`);
});