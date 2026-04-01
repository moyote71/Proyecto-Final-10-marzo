import express from "express";
import { body, query } from "express-validator";
import {
  checkEmail,
  login,
  register,
  refreshToken,
  logout
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

// Aplicar rate limiting a todas las rutas de autenticación
router.use(authLimiter);

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Autenticación de usuarios
 */

/**
 * @openapi
 * /auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [displayName, email, password]
 *             properties:
 *               displayName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *       400:
 *         description: Datos inválidos o correo electrónico existente
 */
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
  register,
);

/**
 * @openapi
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener cookies seguras
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sesión iniciada, cookies HTTP-Only configuradas
 *       400:
 *         description: Credenciales inválidas
 */
router.post(
  "/login",
  [emailValidation(), passwordLoginValidation()],
  validate,
  login,
);

/**
 * @openapi
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión (Revoca cookies)
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Sesión cerrada exitosamente
 */
router.post("/logout", logout);

/**
 * @openapi
 * /auth/refresh:
 *   post:
 *     summary: Refrescar token usando cookie de actualización
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token fresco emitido
 *       401:
 *         description: Token expirado o inválido
 */
router.post("/refresh", refreshToken);

router.get("/check-email", [queryEmailValidation()], validate, checkEmail);

export default router;
