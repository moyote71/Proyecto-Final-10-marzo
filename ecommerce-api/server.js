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

app.set("trust proxy", 1);

/* =========================
   DB
========================= */
if (process.env.NODE_ENV !== "test") {
  dbConnection();
}

/* =========================
   CORS FIX PRO (IMPORTANTE)
========================= */
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.CLIENT_URL,
    ],
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
   ROUTES
========================= */
app.use("/api", routes);
app.use("/api/upload", uploadRoutes);

/* =========================
   ERROR HANDLER
========================= */
app.use(errorHandler);

/* =========================
   START
========================= */
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log("🚀 Server running on port", PORT);
});