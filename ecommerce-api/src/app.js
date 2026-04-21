import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './src/routes/index.js';
import dbConnection from './src/config/database.js';
import logger from './src/middlewares/logger.js';
import errorHandler from './src/middlewares/errorHandler.js';
import setupGlobalErrorHandlers from './src/middlewares/globalErrorHandler.js';

// Solo ejecutar handlers globales si no estamos en test
if (process.env.NODE_ENV !== 'test') {
    setupGlobalErrorHandlers();
}

if (!process.env.JWT_SECRET || !process.env.REFRESH_TOKEN_SECRET) {
    console.error('FATAL ERROR: JWT_SECRET or REFRESH_TOKEN_SECRET is not defined in the environment variables.');
    process.exit(1);
}

const app = express();

// Solo conectar a DB real si no estamos en test (el test usa setup.js)
if (process.env.NODE_ENV !== 'test') {
    dbConnection();
}

app.use(express.json());
app.use(cookieParser());

// Solo usar logger y rate limiting si no estamos en test
if (process.env.NODE_ENV !== 'test') {
    app.use(logger);
}

// Configurar CORS
const allowedOrigins = process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : [];
app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

app.get('/', (req, res) => {
    res.send('WELCOME TO ECOMMERCE API!');
});

app.use('/api', routes);

app.use((req, res) => {
    res.status(404).json({
        error: 'Ruta no encontrada',
        method: req.method,
        url: req.originalUrl
    });
});

app.use(errorHandler);

export default app;
