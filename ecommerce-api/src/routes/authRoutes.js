import express from "express";
import { body, query } from "express-validator";
import {
  login,
  register,
  logout,
  checkEmail
} from "../controllers/authController.js";

import validate from "../middlewares/validation.js";
import { authLimiter } from "../middlewares/rateLimiter.js";
import {
  displayNameValidation,
  emailValidation,
  passwordValidation,
  phoneValidation,
  urlValidation,
  roleValidation,
  queryEmailValidation,
  passwordLoginValidation,
} from "../middlewares/validators.js";

const router = express.Router();

router.use(authLimiter);

/* =========================
   REGISTER
========================= */
router.post(
  "/register",
  [
    displayNameValidation(),
    emailValidation(),
    passwordValidation(),
    phoneValidation(),
    roleValidation(),
    urlValidation("avatar"),
  ],
  validate,
  register
);

/* =========================
   LOGIN
========================= */
router.post(
  "/login",
  [emailValidation(), passwordLoginValidation()],
  validate,
  login
);

/* =========================
   LOGOUT
========================= */
router.post("/logout", logout);

/* =========================
   CHECK EMAIL
========================= */
router.get(
  "/check-email",
  [queryEmailValidation()],
  validate,
  checkEmail
);

export default router;