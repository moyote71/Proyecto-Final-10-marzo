import express from "express";
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
   SEARCH (DEBE IR PRIMERO)
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
   GET ALL CATEGORIES
========================= */
router.get("/", getCategories);

/* =========================
   GET CATEGORY BY ID
========================= */
router.get(
  "/:id",
  [mongoIdValidation("id", "Category ID")],
  validate,
  getCategoryById
);

/* =========================
   CREATE CATEGORY
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
   UPDATE CATEGORY
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
   DELETE CATEGORY
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