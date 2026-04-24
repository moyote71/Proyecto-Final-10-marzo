import express from "express";
import {
    createProduct,
    deleteProduct,
    getProductByCategory,
    getProductById,
    getProducts,
    searchProducts,
    updateProduct,
} from "../controllers/productController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";
import validate from "../middlewares/validation.js";
import {
    bodyMongoIdValidation,
    imagesUrlValidation,
    mongoIdValidation,
    orderValidation,
    paginationValidation,
    priceOptionalValidation,
    priceValidation,
    productDescriptionValidation,
    productNameValidation,
    queryBooleanValidation,
    queryMongoIdValidation,
    queryPriceValidation,
    searchQueryValidation,
    sortFieldValidation,
    stockOptionalValidation,
    stockValidation
} from "../middlewares/validators.js";

console.log("🛍️ PRODUCT ROUTES LOADED");

const router = express.Router();

/* =========================
   PRODUCTS
   BASE: /api/products
========================= */

// GET /api/products
router.get("/", [...paginationValidation()], validate, getProducts);

// GET /api/products/search
router.get(
  "/search",
  [
    searchQueryValidation(),
    queryMongoIdValidation("category", "Category"),
    queryPriceValidation("minPrice"),
    queryPriceValidation("maxPrice"),
    queryBooleanValidation("inStock"),
    sortFieldValidation(["name", "price", "createdAt"]),
    orderValidation(),
    ...paginationValidation(),
  ],
  validate,
  searchProducts
);

// GET /api/products/category/:idCategory
router.get(
  "/category/:idCategory",
  [mongoIdValidation("idCategory", "Category ID")],
  validate,
  getProductByCategory
);

// GET /api/products/:id
router.get("/:id", [mongoIdValidation("id", "Product ID")], validate, getProductById);

// POST /api/products (admin)
router.post(
  "/",
  authMiddleware,
  isAdmin,
  [
    productNameValidation(true),
    productDescriptionValidation(true),
    priceValidation("price"),
    stockValidation(),
    ...imagesUrlValidation(true),
    bodyMongoIdValidation("category", "Category"),
  ],
  validate,
  createProduct
);

// PUT /api/products/:id (admin)
router.put(
  "/:id",
  authMiddleware,
  isAdmin,
  [
    mongoIdValidation("id", "Product ID"),
    productNameValidation(false),
    productDescriptionValidation(false),
    priceOptionalValidation("price"),
    stockOptionalValidation(),
    ...imagesUrlValidation(false),
    bodyMongoIdValidation("category", "Category", true),
  ],
  validate,
  updateProduct
);

// DELETE /api/products/:id (admin)
router.delete(
  "/:id",
  authMiddleware,
  isAdmin,
  [mongoIdValidation("id", "Product ID")],
  validate,
  deleteProduct
);

export default router;