import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import routes from './src/routes/index.js';
import dbConnection from './src/config/database.js';

import logger from './src/middlewares/logger.js';
import errorHandler from './src/middlewares/errorHandler.js';
import setupGlobalErrorHandlers from './src/middlewares/globalErrorHandler.js';

dotenv.config();

// global error handlers
if (process.env.NODE_ENV !== 'test') {
    setupGlobalErrorHandlers();
}

if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET or REFRESH_TOKEN_SECRET is not defined');
    process.exit(1);
}

const app = express();

// DB
if (process.env.NODE_ENV !== 'test') {
    dbConnection();
}

// BODY + COOKIES (orden importante)
app.use(express.json());
app.use(cookieParser());

// TRUST PROXY (RENDER)
app.set("trust proxy", 1);

// LOGS
if (process.env.NODE_ENV !== 'test') {
    app.use(logger);
}

// ===============================
// 🔥 CORS FIX DEFINITIVO
// ===============================
const allowedOrigins = process.env.CORS_ORIGIN
    ? process.env.CORS_ORIGIN.split(',').map(o => o.trim())
    : [];

app.use(cors({
    origin: (origin, callback) => {
        // permitir Postman / server-to-server
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.warn("❌ CORS bloqueado:", origin);
        return callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
}));

// preflight fix
app.options("*", cors());

// ROUTES
app.get('/', (req, res) => {
    res.send('WELCOME TO ECOMMERCE API!');
});

app.use('/api', routes);

// 404
app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        method: req.method,
        url: req.originalUrl
    });
});

// error handler
app.use(errorHandler);

export default app;