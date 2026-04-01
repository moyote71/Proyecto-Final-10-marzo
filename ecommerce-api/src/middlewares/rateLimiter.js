import rateLimit from "express-rate-limit";

// Middleware bypass for tests
const skipTests = (req, res) => process.env.NODE_ENV === "test";

// Rate limiter para autenticación (login/register)
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 5, // Máximo 5 intentos por ventana
    message: {
        message: "Too many authentication attempts, please try again after 15 minutes",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: skipTests,
});

// Rate limiter general para API
export const apiLimiter = rateLimit({
    windowMs: 30 * 60 * 1000, // 30 minutos
    max: 10000, // Máximo 10000 requests por ventana
    message: {
        error: "Demasiadas peticiones a la API, intente luego.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: skipTests,
});

// Rate limiter estricto para operaciones sensibles
export const strictLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hora
    max: 100, // Máximo 3 intentos por hora
    message: {
        error: "Demasiados intentos de autenticación, intente en 15 minutos.",
    },
    standardHeaders: true,
    legacyHeaders: false,
    skip: skipTests,
});
