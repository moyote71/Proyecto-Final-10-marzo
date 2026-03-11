# SPEC.md — Especificaciones Técnicas del Proyecto ECOMMERCE-REACT

> **Generado automáticamente** a partir del análisis profundo del código fuente.  
> Última actualización: 2026-02-24

---

## 1. Resumen del Proyecto

Plataforma de comercio electrónico full-stack compuesta por:

| Subproyecto | Tecnología principal | Puerto |
|---|---|---|
| `ecommerce-api` | Node.js + Express 5 + MongoDB | `4000` |
| `ecommerce-app` | React 19 + React Router v7 | `3000` |

---

## 2. Backend — `ecommerce-api`

### 2.1 Stack Tecnológico

| Paquete | Versión | Rol |
|---|---|---|
| `express` | ^5.1.0 | Framework HTTP |
| `mongoose` | ^8.16.3 | ODM para MongoDB |
| `bcrypt` | ^6.0.0 | Hash de contraseñas |
| `jsonwebtoken` | ^9.0.2 | Autenticación JWT |
| `express-validator` | ^7.2.1 | Validación de requests |
| `cors` | ^2.8.5 | Control de origen cruzado |
| `dotenv` | ^17.2.0 | Variables de entorno |
| `nodemon` | ^3.1.11 | Hot-reload en desarrollo |

### 2.2 Estructura de Directorios

```
ecommerce-api/
├── server.js                        # Entrada principal
├── .env                             # Variables de entorno (no versionado)
├── src/
│   ├── config/
│   │   └── database.js              # Connexión a MongoDB
│   ├── controllers/
│   │   ├── authController.js        # register, login
│   │   ├── cartController.js        # CRUD carrito + addProductToCart
│   │   ├── categoryController.js    # CRUD categorías
│   │   ├── notificationController.js
│   │   ├── orderController.js       # CRUD órdenes + gestión de estados
│   │   ├── paymentMethodController.js
│   │   ├── productController.js     # CRUD productos + búsqueda avanzada
│   │   ├── reviewController.js
│   │   ├── shippingAddressController.js
│   │   ├── userController.js
│   │   └── wishListController.js
│   ├── middlewares/
│   │   ├── authMiddleware.js        # Verificación JWT (Bearer token)
│   │   ├── isAdminMiddleware.js     # Control de rol admin
│   │   ├── errorHandler.js          # Manejo de errores + log a archivo
│   │   ├── globalErrorHandler.js    # uncaughtException / unhandledRejection
│   │   ├── logger.js                # Logger HTTP simple (consola)
│   │   └── validation.js            # Wrapper express-validator
│   ├── models/
│   │   ├── cart.js
│   │   ├── category.js
│   │   ├── notification.js
│   │   ├── order.js
│   │   ├── paymentMethod.js
│   │   ├── product.js
│   │   ├── review.js
│   │   ├── shippingAddress.js
│   │   ├── user.js
│   │   └── wishList.js
│   └── routes/
│       ├── index.js                 # Router raíz en /api
│       ├── authRoutes.js
│       ├── cartRoutes.js
│       ├── categoryRoutes.js
│       ├── notificationRoutes.js
│       ├── orderRoutes.js
│       ├── paymentMethodRoutes.js
│       ├── productRoutes.js
│       ├── reviewRoutes.js
│       ├── shippingAddressRoutes.js
│       ├── userRoutes.js
│       └── wishListRoutes.js
└── logs/
    └── error.log                    # Generado automáticamente
```

### 2.3 Variables de Entorno Requeridas (.env)

```env
PORT=4000
MONGODB_URI=mongodb://...
MONGODB_DB=nombre_base_datos
JWT_SECRET=tu_secreto_jwt
```

### 2.4 Modelos de Datos (Mongoose)

#### User
| Campo | Tipo | Restricciones |
|---|---|---|
| `displayName` | String | required |
| `email` | String | required, unique, formato email |
| `hashPassword` | String | required |
| `role` | String | enum: `admin`, `customer`, `guest`; default: `guest` |
| `avatar` | String | required, default: placeholder |
| `phone` | String | required, max: 10 dígitos |
| `isActive` | Boolean | default: `true` |

#### Product
| Campo | Tipo | Restricciones |
|---|---|---|
| `name` | String | required, trim |
| `description` | String | required, trim |
| `price` | Number | required, min: 1 |
| `stock` | Number | required, min: 0 |
| `imagesUrl` | [String] | default: placeholder 800x600 |
| `category` | ObjectId → Category | required |

#### Order
| Campo | Tipo | Restricciones |
|---|---|---|
| `user` | ObjectId → User | required |
| `products` | [{productId, quantity, price}] | productId required, qty ≥ 1 |
| `shippingAddress` | ObjectId → ShippingAddress | required |
| `paymentMethod` | ObjectId → PaymentMethod | required |
| `shippingCost` | Number | default: 0 |
| `totalPrice` | Number | required (calculado) |
| `status` | String | enum: `pending`, `processing`, `shipped`, `delivered`, `cancelled` |
| `paymentStatus` | String | enum: `pending`, `paid`, `failed`, `refunded` |

#### Cart
| Campo | Tipo | Restricciones |
|---|---|---|
| `user` | ObjectId → User | required |
| `products` | [{product: ObjectId, quantity: Number}] | qty ≥ 1 |

### 2.5 API Endpoints

#### Autenticación (`/api/auth`)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| POST | `/api/auth/register` | ❌ | Registrar usuario (valida con express-validator) |
| POST | `/api/auth/login` | ❌ | Login, retorna JWT |

#### Productos (`/api/products`)
| Método | Ruta | Auth | Role | Descripción |
|---|---|---|---|---|
| GET | `/api/products` | ❌ | — | Listar productos paginados |
| GET | `/api/products/search` | ❌ | — | Búsqueda avanzada (q, category, minPrice, maxPrice, inStock, sort, order, page, limit) |
| GET | `/api/products/category/:idCategory` | ❌ | — | Productos por categoría |
| GET | `/api/products/:id` | ❌ | — | Producto por ID |
| POST | `/api/products` | ✅ | admin | Crear producto |
| PUT | `/api/products/:id` | ✅ | admin | Actualizar producto |
| DELETE | `/api/products/:id` | ✅ | admin | Eliminar producto |

#### Órdenes (`/api/orders`)
| Método | Ruta | Auth | Role | Descripción |
|---|---|---|---|---|
| GET | `/api/orders` | ✅ | admin | Todas las órdenes |
| GET | `/api/orders/user/:userId` | ✅ | — | Órdenes por usuario |
| GET | `/api/orders/:id` | ✅ | — | Orden por ID |
| POST | `/api/orders` | ✅ | — | Crear orden |
| PUT | `/api/orders/:id` | ✅ | admin | Actualizar orden (campos: status, paymentStatus, shippingCost) |
| PATCH | `/api/orders/:id/status` | ✅ | admin | Cambiar estado |
| PATCH | `/api/orders/:id/payment-status` | ✅ | admin | Cambiar estado de pago |
| PATCH | `/api/orders/:id/cancel` | ✅ | admin | Cancelar orden |
| DELETE | `/api/orders/:id` | ✅ | admin | Eliminar (solo órdenes canceladas) |

#### Carrito (`/api/cart`)
| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| GET | `/api/carts` | — | Todos los carritos |
| GET | `/api/carts/:id` | — | Carrito por ID |
| GET | `/api/carts/user/:id` | — | Carrito del usuario |
| POST | `/api/carts` | — | Crear carrito |
| PUT | `/api/carts/:id` | — | Actualizar carrito completo |
| DELETE | `/api/carts/:id` | — | Eliminar carrito |
| POST | `/api/carts/add` | — | Agregar producto (crea carrito si no existe) |

### 2.6 Autenticación y Seguridad

- **JWT** con `expiresIn: '1h'`. Payload: `{ userId, displayName, role }`.
- Token enviado como `Authorization: Bearer <token>`.
- Hash de contraseñas con **bcrypt** (saltRounds: 10).
- Validación de inputs con **express-validator** en rutas de auth y búsqueda de productos.
- Roles: `guest` (default al registrarse), `customer`, `admin`.

### 2.7 Manejo de Errores

- Middleware `errorHandler` captura errores de Express y los escribe en `logs/error.log`.
- `setupGlobalErrorHandlers` maneja `uncaughtException` y `unhandledRejection` del proceso.
- Errores 404 para rutas no encontradas respondidos inline en `server.js`.

---

## 3. Frontend — `ecommerce-app`

### 3.1 Stack Tecnológico

| Paquete | Versión | Rol |
|---|---|---|
| `react` | ^19.2.0 | UI framework |
| `react-dom` | ^19.2.0 | Renderer |
| `react-router-dom` | ^7.9.6 | Enrutamiento cliente |
| `axios` | ^1.13.2 | Peticiones HTTP |
| `framer-motion` | ^12.23.25 | Animaciones |
| `class-variance-authority` | ^0.7.1 | Estilos variantes (CVA) |
| `tailwindcss` | (config presente) | Clases utilitarias de estilos |
| `react-scripts` | 5.0.1 | Build toolchain (CRA) |

### 3.2 Estructura de Directorios

```
ecommerce-app/src/
├── index.js                         # Entrada: ThemeProvider + App
├── index.css                        # CSS global
├── components/
│   ├── App/                         # Router principal
│   ├── Cart/
│   │   └── CartView.jsx
│   ├── Checkout/
│   │   ├── Address/
│   │   │   ├── AddressForm.jsx
│   │   │   └── AddressList.jsx
│   │   ├── Payment/
│   │   │   ├── PaymentForm.jsx
│   │   │   └── PaymentList.jsx
│   │   └── shared/
│   │       └── SummarySection.jsx
│   ├── LoginForm/
│   │   └── LoginForm.jsx
│   ├── ProductCard/
│   ├── ProductDetails/
│   ├── ProfileCard/
│   ├── SearchResultsList/
│   ├── BannerCarousel/
│   ├── List/
│   ├── common/
│   │   ├── Badge/
│   │   ├── Button/        # Variantes: primary, secondary, danger, ghost
│   │   ├── ErrorMessage/
│   │   ├── Icon/
│   │   ├── Input/
│   │   └── Loading/
│   └── ui/
│       └── LiquidButton/  # Botón animado custom (CSS animation)
├── context/
│   ├── CartContext.jsx    # Estado del carrito (localStorage sync)
│   └── ThemeContext.jsx   # Tema dark/light (CVA + localStorage)
├── layout/
│   ├── Layout.jsx
│   ├── Header/
│   ├── Navigation/
│   ├── Footer/
│   ├── BreadCrumb/
│   └── Newsletter/
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── OrderConfirmation.jsx
│   ├── Orders.jsx
│   ├── Product.jsx
│   ├── ProductDetails.jsx
│   ├── CategoryPage.jsx
│   ├── SearchResults.jsx
│   ├── Profile.jsx
│   ├── Settings.jsx
│   ├── WishList.jsx
│   ├── PurchaseOrder.jsx
│   └── ProtectedRoute.jsx
├── services/
│   ├── http.js               # Instancia Axios (base: http://localhost:4000/api/)
│   ├── productService.js     # fetchProducts, searchProducts, getProductById
│   ├── categoryService.js    # fetchCategories, getProductsByCategory, etc.
│   ├── userService.js        # fetchUsers (mock JSON)
│   ├── paymentService.js
│   └── shippingService.js
├── data/                     # Datos mock (JSON locales)
│   ├── products.json
│   ├── categories.json
│   ├── users.json
│   ├── homeImages.json
│   ├── paymentMethods.json
│   └── shipping-address.json
├── utils/
│   ├── auth.js               # login/logout con credenciales hardcodeadas + btoa token
│   ├── storageHelpers.js     # CRUD localStorage + normalizeAddress/normalizePayment
│   ├── cn.js
│   └── index.js
└── styles/                   # Carpeta vacía (placeholder)
```

### 3.3 Contextos

#### CartContext (`useCart`)
```js
{
  cartItems: [],          // Array de productos en el carrito
  addToCart(product, quantity),
  removeFromCart(productId),
  updateQuantity(productId, newQuantity),
  clearCart(),
  getTotalItems(),        // Suma de quantities
  getTotalPrice(),        // Suma de price * quantity
}
```
- Persiste en `localStorage` con la clave `"cart"`.

#### ThemeContext (`useTheme`)
```js
{
  theme: "light" | "dark",
  toggleTheme(),
}
```
- Persiste en `localStorage` con la clave `"theme"`.
- Aplica clases CVA sobre `document.body`.
- Al iniciar, detecta `prefers-color-scheme` del sistema.

### 3.4 Flujo de Checkout

1. **Verificar carrito no vacío** → redirige a `/cart` si está vacío.
2. **Cargar datos** → `getShippingAddresses()` + `getDefaultShippingAddress()` + `getPaymentMethods()` + `getDefaultPaymentMethods()`.
3. **Paso 1: Dirección de envío** → seleccionar, agregar (con `AddressForm`) o editar.
4. **Paso 2: Método de pago** → seleccionar, agregar (con `PaymentForm`) o editar.
5. **Paso 3: Revisar pedido** → muestra `CartView`.
6. **Confirmar y pagar** → calcula subtotal + IVA (16%) + envío (MXN $350, gratis si subtotal ≥ $1000) → guarda en `localStorage["orders"]` → navega a `/order-confirmation`.

> ⚠️ Actualmente el checkout **no llama a la API real**. La orden se guarda únicamente en localStorage.

### 3.5 Capa de Servicios

| Servicio | Fuente de datos |
|---|---|
| `productService.js` | API real (`http.js` → `GET /products`) |
| `categoryService.js` | Mock JSON local (`data/categories.json`) |
| `userService.js` | Mock JSON local (`data/users.json`) |
| `paymentService.js` | Mock JSON local (`data/paymentMethods.json`) |
| `shippingService.js` | Mock JSON local (`data/shipping-address.json`) |

### 3.6 Autenticación (Frontend)

- Implementada en `utils/auth.js` con credenciales **hardcodeadas**:
  - `admin@email.com` / `admin123`
  - `cliente@email.com` / `cliente123`
- El "token" es un `btoa(email + timestamp)` — **NO es JWT**.
- Persiste en `localStorage["authToken"]` y `localStorage["userData"]`.
- `ProtectedRoute.jsx` verifica `isAuthenticated()` para rutas protegidas.

> ⚠️ El frontend aún **no se integra** con el endpoint `/api/auth/login` del backend.

### 3.7 Sistema de Estilos

- Estilos definidos mediante **CVA** (`class-variance-authority`) en archivos `*Styles.js` por componente/página.
- Tema dark/light gestionado globalmente con `ThemeContext`.
- Se usa Tailwind CSS como base de clases utilitarias.

---

## 4. Comunicación Frontend — Backend

| Componente | Integrado con API | Datos de origen |
|---|---|---|
| Home (productos) | ✅ Parcial | API `/products` |
| Login | ❌ | Mock (`utils/auth.js`) |
| Categorías | ❌ | JSON local |
| Checkout (orden) | ❌ | localStorage |
| Usuarios | ❌ | JSON local |
| Métodos de pago | ❌ | JSON local |
| Direcciones de envío | ❌ | JSON local |

---

## 5. Cómo Ejecutar

### Backend
```bash
cd ecommerce-api
cp .env.example .env   # Configurar variables
npm install
npm run dev            # Nodemon en puerto 4000
```

### Frontend
```bash
cd ecommerce-app
npm install
npm start              # CRA en puerto 3000
```

---

## 6. Observaciones y Bugs Conocidos

| # | Ubicación | Descripción |
|---|---|---|
| 1 | `productController.js` | `next` no está declarado en los parámetros de `getProducts`, `getProductById`, `createProduct`, `updateProduct` — causará `ReferenceError` |
| 2 | `orderController.js` | `next` no declarado en `getOrders`, `getOrderById`, `getOrdersByUser`, `createOrder`, `updateOrder`, `cancelOrder`, `updateOrderStatus`, `updatePaymentStatus` |
| 3 | `cartController.js` | `next` no declarado en `getCarts`, `getCartById`, `getCartByUser`, `createCart`, `updateCart`, `addProductToCart` |
| 4 | `server.js` | CORS configurado con `https://localhost:3000` (debería ser `http://`) |
| 5 | `utils/auth.js` | Credenciales hardcodeadas en el cliente. Token falso (btoa) |
| 6 | `Checkout.jsx` | La orden solo se guarda en localStorage, no se llama a `POST /api/orders` |
| 7 | `productService.js` | `getProductById` usa mock delay + busca en `fetchProducts()` en lugar del endpoint `GET /products/:id` |
| 8 | `routes/index.js` | `userRoutes`, `reviewRoutes`, `shippingAddressRoutes`, `wishListRoutes` importados en archivos individuales pero **no montados** en el router |
| 9 | `authController.js` | JWT expira en 1h sin mecanismo de refresh token |
| 10 | `Checkout.jsx` | `useCart()` desestructura `total` pero `CartContext` expone `getTotalPrice()` — `total` siempre es `undefined` |
