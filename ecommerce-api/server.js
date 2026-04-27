import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import dbConnection from "./src/config/database.js";
import errorHandler from "./src/middlewares/errorHandler.js";
import logger from "./src/middlewares/logger.js";
import { apiLimiter } from "./src/middlewares/rateLimiter.js";
import uploadRoutes from "./src/routes/uploadRoutes.js";
import routes from "./src/routes/index.js";

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
   CORS FIX (PRODUCCIÓN ROBUSTA)
========================= */
const allowedOrigins = [
  "http://localhost:3000",
  "http://localhost:5173",
  "https://proyecto-final-10-marzo-qv08.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
    },
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

app.use("/uploads", express.static("uploads"));

/* =========================
   HEALTH CHECK
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
   ROUTES
========================= */
app.use("/api", routes);
app.use("/api/upload", uploadRoutes);

/* =========================
   404
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