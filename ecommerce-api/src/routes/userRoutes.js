import express from "express";
import { body } from "express-validator";

import {
  changePassword,
  createUser,
  deactivateUser,
  deleteUser,
  getAllUsers,
  getUserById,
  getUserProfile,
  searchUser,
  toggleUserStatus,
  updateUser,
  updateUserProfile,
} from "../controllers/userController.js";

import authMiddleware from "../middlewares/authMiddleware.js";
import isAdmin from "../middlewares/isAdminMiddleware.js";
import validate from "../middlewares/validation.js";

import {
  displayNameValidation,
  emailValidation,
  phoneValidation,
  urlValidation,
  paginationValidation,
  mongoIdValidation,
  roleValidation,
  booleanValidation,
  userDisplayNameValidation,
  fullPasswordValidation,
  newPasswordValidation,
  confirmPasswordValidation,
  queryRoleValidation,
  queryIsActiveValidation,
  searchQueryValidation,
  sortFieldValidation,
  orderValidation,
} from "../middlewares/validators.js";

const router = express.Router();

/* =========================
   PROFILE (USER LOGGED IN)
========================= */
router.get("/profile", authMiddleware, getUserProfile);

router.put(
  "/profile",
  authMiddleware,
  [
    userDisplayNameValidation(false),
    emailValidation(true),
    phoneValidation(),
    urlValidation("avatar"),
  ],
  validate,
  updateUserProfile
);

/* =========================
   USERS (ADMIN)
========================= */
router.get(
  "/",
  authMiddleware,
  isAdmin,
  [...paginationValidation(), queryRoleValidation(), queryIsActiveValidation()],
  validate,
  getAllUsers
);

router.get(
  "/search",
  authMiddleware,
  [
    searchQueryValidation(),
    ...paginationValidation(),
    queryRoleValidation(),
    queryIsActiveValidation(),
    sortFieldValidation(["email", "displayName", "createdAt"]),
    orderValidation(),
  ],
  validate,
  searchUser
);

router.get(
  "/:userId",
  authMiddleware,
  isAdmin,
  [mongoIdValidation("userId", "User ID")],
  validate,
  getUserById
);

router.post(
  "/",
  authMiddleware,
  isAdmin,
  [
    userDisplayNameValidation(true),
    emailValidation(),
    fullPasswordValidation(),
    phoneValidation(),
    urlValidation("avatar"),
    roleValidation(),
    booleanValidation("isActive"),
  ],
  validate,
  createUser
);

router.put(
  "/:userId",
  authMiddleware,
  isAdmin,
  [
    mongoIdValidation("userId", "User ID"),
    userDisplayNameValidation(false),
    emailValidation(true),
    phoneValidation(),
    urlValidation("avatar"),
    roleValidation(),
    booleanValidation("isActive"),
  ],
  validate,
  updateUser
);

router.patch("/deactivate", authMiddleware, deactivateUser);

router.patch(
  "/:userId/toggle-status",
  authMiddleware,
  isAdmin,
  [mongoIdValidation("userId", "User ID")],
  validate,
  toggleUserStatus
);

router.delete(
  "/:userId",
  authMiddleware,
  isAdmin,
  [mongoIdValidation("userId", "User ID")],
  validate,
  deleteUser
);

/* =========================
   PASSWORD
========================= */
router.put(
  "/change-password",
  authMiddleware,
  [
    body("currentPassword").notEmpty().withMessage("Current password is required"),
    newPasswordValidation(),
    confirmPasswordValidation(),
  ],
  validate,
  changePassword
);

export default router;