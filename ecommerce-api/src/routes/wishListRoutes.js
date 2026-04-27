import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";

import {
  getMyWishList,
  addToWishList,
  removeFromWishList,
} from "../controllers/wishListController.js";

const router = express.Router();

/* =========================
   WISHLIST
========================= */
router.get("/", authMiddleware, getMyWishList);

router.post("/", authMiddleware, addToWishList);

router.delete("/:productId", authMiddleware, removeFromWishList);

export default router;