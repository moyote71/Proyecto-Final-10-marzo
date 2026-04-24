import express from "express";
import Category from "../models/category.js";

import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategoryById,
  searchCategory,
  updateCategory,
} from "../controllers/categoryController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";
import validate from "../middlewares/validation.js";

import {
  mongoIdValidation,
  paginationValidation,
  descriptionValidation,
  urlValidation,
  searchQueryValidation,
  sortFieldValidation,
  orderValidation,
  generalNameValidation,
  queryMongoIdValidation,
  bodyMongoIdValidation,
} from "../middlewares/validators.js";

const router = express.Router();

/* =========================
   SEARCH
========================= */
router.get(
  "/search",
  [
    searchQueryValidation(),
    queryMongoIdValidation("parentCategory", "parent category ID"),
    sortFieldValidation(["name", "description", "createdAt", "updatedAt"]),
    orderValidation(),
    ...paginationValidation(),
  ],
  validate,
  searchCategory
);

/* =========================
   GET ALL
========================= */
router.get("/", getCategories);

/* =========================
   GET BY SLUG (🔥 IMPORTANTE - PRODUCCIÓN)
========================= */
router.get("/slug/:slug", async (req, res, next) => {
  try {
    const category = await Category.findOne({
      slug: req.params.slug,
    }).populate("parentCategory");

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.status(200).json(category);
  } catch (error) {
    next(error);
  }
});

/* =========================
   GET BY ID (BACKOFF LEGACY)
========================= */
router.get(
  "/:id",
  [mongoIdValidation("id", "Category ID")],
  validate,
  getCategoryById
);

/* =========================
   CREATE
========================= */
router.post(
  "/",
  authMiddleware,
  isAdmin,
  [
    generalNameValidation("name", true, 100),
    descriptionValidation("description"),
    bodyMongoIdValidation("parentCategory", "Parent category", true),
    urlValidation("imageURL"),
  ],
  validate,
  createCategory
);

/* =========================
   UPDATE
========================= */
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  [
    mongoIdValidation("id", "Category ID"),
    generalNameValidation("name", false, 100),
    descriptionValidation("description"),
    bodyMongoIdValidation("parentCategory", "Parent category", true),
    urlValidation("imageURL"),
  ],
  validate,
  updateCategory
);

/* =========================
   DELETE
========================= */
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  [mongoIdValidation("id", "Category ID")],
  validate,
  deleteCategory
);

export default router;