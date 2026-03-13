---
name: Node.js Best Practices - Production Ready Code
description: Guía para escribir código Node.js de producción. Cubre estructura de proyecto, manejo de errores, logging, seguridad, performance y deployment.
scope: backend
trigger: cuando se trabaje con Node.js, se configure un proyecto backend, o se necesiten mejores prácticas de Node
tools: view, file_create, str_replace, bash_tool
version: 1.0.0
---

# Node.js Best Practices - Production Ready Code

## 🎯 Propósito

Guía para escribir código Node.js de producción. Cubre estructura, manejo de errores, logging con Winston, seguridad (Helmet, Rate Limiting), performance y graceful shutdown.

## 🔧 Cuándo Usar Esta Skill

- Configurar nuevo proyecto Node.js
- Implementar logging y monitoring
- Optimizar performance
- Implementar graceful shutdown
- Configurar variables de entorno

## 📚 Estructura de Proyecto

```
src/
├── config/           # Configuraciones (env, logger)
├── controllers/      # Lógica de request/response
├── middleware/       # Custom middlewares (auth, error handler)
├── models/           # Schemas (Mongoose)
├── routes/           # Definición de rutas Express
├── services/         # Lógica de negocio pesada / llamadas externas
├── utils/            # Helpers (AppError, catchAsync)
├── validators/       # Reglas de validación
└── server.js         # Entry point (conexión DB, server listen)
```

## 📊 Logging Profesional (Winston)

No uses `console.log` en producción. Usa `winston` con rotación de archivos.

```javascript
// config/logger.js
const winston = require('winston');
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'logs/error.log', level: 'error' }),
    new winston.transports.File({ filename: 'logs/combined.log' }),
  ],
});

if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({ format: winston.format.simple() }));
}
// Uso: logger.info('Message', { meta: data })
```

## 🚨 Error Handling Robusto

### 1. Clase Custom de Error

```javascript
// utils/AppError.js
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true; // Errores previstos vs bugs de programación
    Error.captureStackTrace(this, this.constructor);
  }
}
```

### 2. Async Wrapper (Evitar try/catch repetitivo)

```javascript
// utils/catchAsync.js
const catchAsync = fn => (req, res, next) => {
  fn(req, res, next).catch(next);
};

// Uso en controller:
exports.getUser = catchAsync(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  if (!user) return next(new AppError('No user found', 404));
  res.status(200).json({ data: user });
});
```

### 3. Global Error Middleware

Captura errores de Mongoose (CastError, DuplicateKey, ValidationError) y JWT.

```javascript
// middleware/errorHandler.js
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  
  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({ error: err, message: err.message, stack: err.stack });
  } else {
    // Lógica para production: no filtrar detalles técnicos al cliente 
    // a menos que sea error isOperational
  }
};
```

## 🔒 Seguridad Best Practices

```javascript
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');

app.use(helmet()); // Security headers
app.use(mongoSanitize()); // Prevenir NoSQL injection
app.use(xss()); // Prevenir XSS

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100, // max requests por IP
});
app.use('/api/', limiter);
```

## ⚡ Optimización de Performance

- **No bloquees el Event Loop:** Usa funciones async/non-blocking.
- **CPU Intensive Tasks:** Usa `worker_threads` o un queue system como Redis/Bull.
- **Connection Pooling:** Configura `maxPoolSize` en Mongoose.
- **Caching:** Usa Caching en memoria (`node-cache`) o Redis para datos frecuentes.

## 🏁 Graceful Shutdown

Evita que las conexiones se corten bruscamente al reiniciar o matar la app.

```javascript
const server = app.listen(PORT);

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled Rejection. Shutting down...');
  server.close(() => process.exit(1));
});

process.on('SIGTERM', () => {
  logger.info('SIGTERM received. Shutting down gracefully');
  server.close(() => logger.info('Process terminated'));
});
```

## 🎓 Best Practices Summary

1. **Async/Await everywhere** - No bloquees el event loop.
2. **Proper error handling** - Usa global error middleware y la clase `AppError`.
3. **Environment variables** - Configura vía `dotenv` y valida al iniciar.
4. **Structured Logging** - Winston en JSON format para logs de producción.
5. **Security first** - Helmet, rate limiting y sanitización obligatorios.
6. **Graceful shutdown** - Cierra servidor limpiamente ante señales del OS.

---

*Versión: 1.0.0 | Scope: backend | Stack: Node.js, Express, Winston*
