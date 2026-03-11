# AGENTS.md — Guía de la API `ecommerce-api`

> **Última actualización:** 2026-03-11  
> **Estado del progreso:** ✅ Documentación inicial completa

---

## Índice

1. [Stack Tecnológico](#1-stack-tecnológico)
2. [Variables de Entorno](#2-variables-de-entorno)
3. [Cómo Ejecutar](#3-cómo-ejecutar)
4. [Arquitectura de la Aplicación](#4-arquitectura-de-la-aplicación)
5. [Autenticación y Seguridad](#5-autenticación-y-seguridad)
6. [Endpoints Completos](#6-endpoints-completos)
7. [Modelos de Datos](#7-modelos-de-datos)
8. [Manejo de Errores](#8-manejo-de-errores)
9. [Reglas para Agentes IA](#9-reglas-para-agentes-ia)

---

## 1. Stack Tecnológico

| Paquete | Versión | Rol |
|---|---|---|
| `express` | ^5.1.0 | Framework HTTP |
| `mongoose` | ^8.x | ODM para MongoDB |
| `bcrypt` | ^6.0.0 | Hash de contraseñas |
| `jsonwebtoken` | ^9.0.2 | Autenticación JWT (Bearer) |
| `express-validator` | ^7.2.1 | Validación de inputs |
| `cors` | ^2.8.5 | Control de origen cruzado |
| `dotenv` | ^17.x | Variables de entorno |
| `nodemon` | ^3.x | Hot-reload en desarrollo |
| `vitest` + `supertest` | dev | Testing de integración |

---

## 2. Variables de Entorno

Crea un archivo `.env` en `ecommerce-api/` copiando `.env.example`:

```env
PORT=4000
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=ecommerce
JWT_SECRET=tu_secreto_super_seguro_min_32_chars
REFRESH_TOKEN_SECRET=tu_refresh_secreto_min_32_chars
CORS_ORIGIN=http://localhost:3000
NODE_ENV=development
```

> [!IMPORTANT]
> `JWT_SECRET` debe tener al menos 32 caracteres en producción. Nunca lo commits.

---

## 3. Cómo Ejecutar

```bash
cd ecommerce-api

# Primera vez
cp .env.example .env
npm install

# Desarrollo (hot-reload)
npm run dev        # nodemon → puerto 4000

# Tests
npm test            # ejecuta todos los tests
npm run test:ui     # interfaz visual Vitest
npm run test:coverage # reporte de cobertura
```

---

## 4. Arquitectura de la Aplicación

```
ecommerce-api/
├── server.js              # Entrada → importa app.js
├── src/
│   ├── app.js             # Express app (middlewares, rutas, CORS)
│   ├── config/
│   │   └── database.js    # Conexión Mongoose
│   ├── controllers/       # Lógica de negocio (async/await)
│   ├── middlewares/
│   │   ├── authMiddleware.js      # Verifica Bearer JWT
│   │   ├── isAdminMiddleware.js   # Verifica role === "admin"
│   │   ├── rateLimiter.js         # Rate limit en rutas /auth
│   │   ├── validators.js          # Funciones de validación reutilizables
│   │   ├── validation.js          # Wrapper express-validator
│   │   ├── errorHandler.js        # Escribe en logs/error.log
│   │   └── globalErrorHandler.js  # uncaughtException + unhandledRejection
│   ├── models/            # Schemas Mongoose
│   ├── routes/
│   │   └── index.js       # Router raíz → monta todos los subrouters
│   └── tests/
│       ├── setup.js       # Mocks de Mongoose (sin DB real)
│       ├── auth.test.js
│       ├── order.test.js
│       └── product.test.js
└── logs/
    └── error.log          # Generado automáticamente
```

### Flujo de una petición

```
Request → CORS → express.json() → Rate Limiter (solo /auth) → Route
       → Validators → authMiddleware? → isAdmin? → Controller → Response
       → errorHandler (si hay error)
```

---

## 5. Autenticación y Seguridad

### JWT

- **Algoritmo:** HS256
- **Payload:** `{ userId, displayName, role }`
- **Access token expira:** `1h`
- **Refresh token expira:** `7d` (firmado con `REFRESH_TOKEN_SECRET`)
- **Envío:** Header `Authorization: Bearer <token>`

```http
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Refresh Token

```http
POST /api/auth/refresh
Body: { "refreshToken": "<refresh_jwt>" }
```
Respuesta: `{ token: "<new_access_token>", refreshToken: "<new_refresh_token>" }`

> [!IMPORTANT]
> El body debe enviar `refreshToken` (no `token`). Ver `authController.js:97`.

### Rate Limiting

Las rutas `/api/auth/*` tienen rate limiting activo. En `NODE_ENV=test` está deshabilitado.

### Roles

| Rol | Acceso |
|---|---|
| `guest` | Solo lectura pública |
| `customer` | Lectura pública + órdenes propias + carrito |
| `admin` | Acceso completo (CRUD de productos, órdenes, usuarios) |

> [!WARNING]
> `authMiddleware` retorna **`401`** cuando no hay token, pero **`403`** cuando el token es inválido/expirado. Esto es un bug conocido ([API-001] en TECHNICAL_DEBT.md).

---

## 6. Endpoints Completos

**Base URL:** `http://localhost:4000/api`

### 🔐 Auth (`/auth`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/auth/register` | ❌ | Registrar nuevo usuario |
| `POST` | `/auth/login` | ❌ | Login → retorna JWT |
| `POST` | `/auth/refresh` | ❌ | Renovar token |
| `GET` | `/auth/check-email` | ❌ | Verificar si email existe |

**Body de `/auth/register`:**
```json
{
  "displayName": "string (requerido)",
  "email": "string (email válido, requerido)",
  "password": "string (min 8 chars, requerido)",
  "phone": "string (max 10 dígitos, requerido)",
  "role": "guest | customer | admin (default: guest)",
  "avatar": "string (URL, opcional)"
}
```
**Respuesta de `/auth/register` (201):**
```json
{ "displayName": "string", "email": "string" }
```
> ⚠️ No retorna token. El usuario debe hacer login después de registrarse. Ver [API-003] en TECHNICAL_DEBT.md.

**Body de `/auth/login`:**
```json
{
  "email": "string (requerido)",
  "password": "string (requerido)"
}
```

**Respuesta exitosa de `/auth/login` (200):**
```json
{
  "token": "eyJ...",
  "refreshToken": "eyJ..."
}
```
> ⚠️ No incluye datos del usuario. El cliente debe decodificar el JWT para obtener `userId`, `displayName`, `role`. Ver [API-004] en TECHNICAL_DEBT.md.

**`GET /auth/check-email` — Respuesta:**
```json
{ "taken": true | false }
```
> Nota: El campo es `taken`, no `exists`.

---

### 📦 Products (`/products`)

| Método | Ruta | Auth | Role | Descripción |
|---|---|---|---|---|
| `GET` | `/products` | ❌ | — | Todos los productos (paginado) |
| `GET` | `/products/search` | ❌ | — | Búsqueda con filtros |
| `GET` | `/products/category/:idCategory` | ❌ | — | Por categoría |
| `GET` | `/products/:id` | ❌ | — | Por ID |
| `POST` | `/products` | ✅ | admin | Crear producto |
| `PUT` | `/products/:id` | ✅ | admin | Actualizar producto |
| `DELETE` | `/products/:id` | ✅ | admin | Eliminar producto |

**Query params de `/products`:**
- `page` (default: 1), `limit` (default: 10)

**Query params de `/products/search`:**
- `q` (texto libre), `category` (ObjectId), `minPrice`, `maxPrice`, `inStock` (boolean), `sort` (name|price|createdAt), `order` (asc|desc), `page`, `limit`

**Body de `POST /products`:**
```json
{
  "name": "string (requerido)",
  "description": "string (requerido)",
  "price": "number (min 1, requerido)",
  "stock": "number (min 0, requerido)",
  "imagesUrl": ["url1", "url2"],
  "category": "ObjectId (requerido)"
}
```

---

### 🛒 Orders (`/orders`)

| Método | Ruta | Auth | Role | Descripción |
|---|---|---|---|---|
| `GET` | `/orders` | ✅ | admin | Todas las órdenes |
| `GET` | `/orders/user/:userId` | ✅ | — | Órdenes del usuario |
| `GET` | `/orders/:id` | ✅ | — | Orden por ID |
| `POST` | `/orders` | ✅ | — | Crear orden |
| `PUT` | `/orders/:id` | ✅ | admin | Actualizar orden completa |
| `PATCH` | `/orders/:id/status` | ✅ | admin | Cambiar estado de la orden |
| `PATCH` | `/orders/:id/payment-status` | ✅ | admin | Cambiar estado de pago |
| `PATCH` | `/orders/:id/cancel` | ✅ | admin | Cancelar orden |
| `DELETE` | `/orders/:id` | ✅ | admin | Eliminar (solo canceladas) |

**Body de `POST /orders`:**
```json
{
  "user": "ObjectId",
  "products": [
    { "productId": "ObjectId", "quantity": 2, "price": 100 }
  ],
  "shippingAddress": "ObjectId",
  "paymentMethod": "ObjectId",
  "shippingCost": 350
}
```

**Estados válidos de `status`:** `pending` | `processing` | `shipped` | `delivered` | `cancelled`  
**Estados válidos de `paymentStatus`:** `pending` | `paid` | `failed` | `refunded`

---

### 🛒 Cart (`/cart`)

> [!IMPORTANT]
> El prefijo es `/cart` (singular), no `/carts`. Todas las rutas requieren autenticación.

| Método | Ruta | Auth | Role | Descripción |
|---|---|---|---|---|
| `GET` | `/cart` | ✅ | admin | Todos los carritos |
| `GET` | `/cart/:id` | ✅ | admin | Carrito por ID |
| `GET` | `/cart/user/:id` | ✅ | — | Carrito del usuario autenticado |
| `POST` | `/cart` | ✅ | — | Crear carrito con productos |
| `PUT` | `/cart-item/:id` | ✅ | — | Reemplazar carrito completo |
| `DELETE` | `/cart/:id` | ✅ | — | Eliminar carrito |
| `POST` | `/cart/add-product` | ✅ | — | Agregar producto (crea carrito si no existe) |
| `PUT` | `/cart/update-item` | ✅ | — | Actualizar cantidad de un producto |
| `DELETE` | `/cart/remove-item/:productId` | ✅ | — | Quitar un producto del carrito |
| `POST` | `/cart/clear` | ✅ | — | Vaciar el carrito completo |

**Body de `POST /cart/add-product`:**
```json
{ "userId": "ObjectId", "productId": "ObjectId", "quantity": 1 }
```

**Body de `PUT /cart/update-item`:**
```json
{ "userId": "ObjectId", "productId": "ObjectId", "quantity": 3 }
```

---

### 📂 Categories (`/categories`)

| Método | Ruta | Auth | Role | Descripción |
|---|---|---|---|---|
| `GET` | `/categories` | ❌ | — | Todas las categorías |
| `GET` | `/categories/search` | ❌ | — | Buscar categorías (q, parentCategory, sort, order, page, limit) |
| `GET` | `/categories/:id` | ❌ | — | Categoría por ID |
| `POST` | `/categories` | ✅ | admin | Crear categoría |
| `PUT` | `/categories/:id` | ✅ | admin | Actualizar categoría |
| `DELETE` | `/categories/:id` | ✅ | admin | Eliminar categoría |

---

### 👥 Users (`/users`)

| Método | Ruta | Auth | Role | Descripción |
|---|---|---|---|---|
| `GET` | `/users` | ✅ | admin | Todos los usuarios (paginado, filtros: role, isActive) |
| `GET` | `/users/profile` | ✅ | — | Perfil del usuario autenticado |
| `GET` | `/users/search` | ✅ | — | Buscar usuarios por texto |
| `GET` | `/users/:userId` | ✅ | admin | Usuario por ID |
| `POST` | `/users` | ✅ | admin | Crear usuario |
| `PUT` | `/users/profile` | ✅ | — | Actualizar perfil propio |
| `PUT` | `/users/change-password` | ✅ | — | Cambiar contraseña propia |
| `PUT` | `/users/:userId` | ✅ | admin | Actualizar cualquier usuario |
| `PATCH` | `/users/deactivate` | ✅ | — | Desactivar cuenta propia |
| `PATCH` | `/users/:userId/toggle-status` | ✅ | admin | Activar/Desactivar usuario |
| `DELETE` | `/users/:userId` | ✅ | admin | Eliminar usuario |

**Body de `PUT /users/change-password`:**
```json
{ "currentPassword": "string", "newPassword": "string", "confirmPassword": "string" }
```

---

### 📍 Shipping Addresses (`/shipping-addresses`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/shipping-addresses` | ✅ | Todas las direcciones |
| `GET` | `/shipping-addresses/:id` | ✅ | Por ID |
| `GET` | `/shipping-addresses/user/:userId` | ✅ | Del usuario |
| `POST` | `/shipping-addresses` | ✅ | Crear dirección |
| `PUT` | `/shipping-addresses/:id` | ✅ | Actualizar |
| `DELETE` | `/shipping-addresses/:id` | ✅ | Eliminar |

---

### 💳 Payment Methods (`/payment-methods`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/payment-methods` | ✅ | Todos los métodos |
| `GET` | `/payment-methods/:id` | ✅ | Por ID |
| `GET` | `/payment-methods/user/:userId` | ✅ | Del usuario |
| `POST` | `/payment-methods` | ✅ | Crear método |
| `PUT` | `/payment-methods/:id` | ✅ | Actualizar |
| `DELETE` | `/payment-methods/:id` | ✅ | Eliminar |

---

### ⭐ Reviews (`/reviews`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/reviews` | ❌ | Todas las reviews |
| `GET` | `/reviews/:id` | ❌ | Por ID |
| `POST` | `/reviews` | ✅ | Crear review |
| `PUT` | `/reviews/:id` | ✅ | Actualizar |
| `DELETE` | `/reviews/:id` | ✅ | Eliminar |

---

### 🔔 Notifications (`/notifications`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/notifications/user/:userId` | ✅ | Notificaciones del usuario |
| `POST` | `/notifications` | ✅ | Crear notificación |
| `PATCH` | `/notifications/:id/read` | ✅ | Marcar como leída |
| `DELETE` | `/notifications/:id` | ✅ | Eliminar |

---

### ❤️ WishList (`/wishlists`)

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/wishlists/user/:userId` | ✅ | Wishlist del usuario |
| `POST` | `/wishlists` | ✅ | Crear wishlist |
| `PUT` | `/wishlists/:id` | ✅ | Actualizar wishlist |
| `DELETE` | `/wishlists/:id` | ✅ | Eliminar |

---

## 7. Modelos de Datos

### User
```js
{
  displayName: String,       // required
  email: String,             // required, unique, email format
  hashPassword: String,      // required (bcrypt, saltRounds: 10)
  role: String,              // enum: 'admin' | 'customer' | 'guest', default: 'guest'
  avatar: String,            // URL, default: placeholder
  phone: String,             // max 10 dígitos
  isActive: Boolean          // default: true
}
```

### Product
```js
{
  name: String,              // required, trim
  description: String,       // required, trim
  price: Number,             // required, min: 1
  stock: Number,             // required, min: 0
  imagesUrl: [String],       // default: placeholder 800x600
  category: ObjectId         // → Category, required
}
```

### Order
```js
{
  user: ObjectId,                        // → User, required
  products: [{
    productId: ObjectId,                 // required
    quantity: Number,                    // min: 1
    price: Number
  }],
  shippingAddress: ObjectId,             // → ShippingAddress, required
  paymentMethod: ObjectId,               // → PaymentMethod, required
  shippingCost: Number,                  // default: 0
  totalPrice: Number,                    // required (calculado)
  status: String,                        // enum: pending|processing|shipped|delivered|cancelled
  paymentStatus: String                  // enum: pending|paid|failed|refunded
}
```

### Cart
```js
{
  user: ObjectId,                        // → User, required
  products: [{
    product: ObjectId,                   // → Product
    quantity: Number                     // min: 1
  }]
}
```

---

## 8. Manejo de Errores

### Códigos de respuesta estándar

| Código | Significado |
|---|---|
| `200` | OK |
| `201` | Created |
| `400` | Bad Request (validación fallida) |
| `401` | Unauthorized (token ausente, inválido o expirado) |
| `403` | Forbidden (rol insuficiente) |
| `404` | Not Found |
| `409` | Conflict (email duplicado) |
| `422` | Unprocessable Entity (body mal formado) |
| `429` | Too Many Requests (rate limit) |
| `500` | Internal Server Error |

### Formato de error estándar
```json
{
  "error": "Mensaje descriptivo",
  "details": [...]  // Opcional, errores de validación
}
```

### Logging
- Los errores 5xx se escriben en `logs/error.log` (rotativo por middleware `errorHandler`).
- `uncaughtException` y `unhandledRejection` capturados por `globalErrorHandler`.

---

## 9. Reglas para Agentes IA

> [!IMPORTANT]
> **NO modificar** los archivos de configuración de `dotenv`, `cors`, o `database.js` sin entender las implicaciones de entorno.

**Siempre:**
- Usar `ObjectId` válidos para IDs en el body (24 hex chars).
- Incluir `Authorization: Bearer <token>` en rutas protegidas.
- Para tests, importar `app` desde `src/app.js`, no arrancar `server.js`.
- Usar `NODE_ENV=test` para deshabilitar DB real y rate limiter.

**Nunca:**
- Agregar lógica de negocio directamente en `routes/`.
- Hacer queries a MongoDB directamente en controllers sin usar los modelos Mongoose.
- Usar `console.log` en producción — usar el middleware `errorHandler`.

**Bugs conocidos a considerar:**
- `next` no declarado en varios controllers — puede causar `ReferenceError` en manejo de errores.
- Las rutas de `cart` no requieren autenticación — no asumir que el usuario está autenticado ahí.
- `authRoutes.js` tiene `router.post("/refresh", refreshToken)` duplicado (líneas 48 y 50).
