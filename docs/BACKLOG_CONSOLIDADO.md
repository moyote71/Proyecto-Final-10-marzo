# BACKLOG CONSOLIDADO — E-Commerce P0/P1
*(Autogenerado a partir de auditoría de código real - Marzo 2026)*

## 1. SPECS Y ESTADO ACTUAL (Source of Truth)
Este documento refleja el estado **real** de la implementación, priorizando el código por encima de cualquier otra documentación.

### 1.1 Matriz de Integración FE-BE
| Funcionalidad | Frontend (React) | Backend (Express) | Estado de Integración |
| :--- | :--- | :--- | :--- |
| **Catálogo de Productos** | ✅ Fetch real a API (`/products`) | ✅ Endpoints vivos | **Integrado** (con debounce/caché simple) |
| **Búsqueda de Productos** | ✅ Fetch real a API (`/products/search`) | ✅ Endpoints vivos | **Integrado** |
| **Autenticación (Login)** | ✅ Fetch real a API (`/auth/login`) | ✅ Endpoints vivos | **Parcial** (Token guardado en `localStorage` en vez de http-only cookies) |
| **Creación de Órdenes** | ✅ Fetch real a API (`/orders`) | ✅ Endpoints vivos | **Integrado** (Checkout procesa orden real) |
| **Categorías** | ⚠️ Usa Mocks (`data/categories.json`) | ✅ Endpoints vivos locales (`/category`) | **No Integrado** (El frontend ignora la API) |
| **Métodos de Pago** | ⚠️ Usa Mocks (`data/paymentMethods.json`) | ✅ Endpoints vivos (`/payment-method`) | **No Integrado** (El frontend ignora la API) |
| **Direcciones de Envío** | ⚠️ Usa Mocks (`data/shipping-address.json`) | ✅ Endpoints vivos (`/shipping-address`) | **No Integrado** (El frontend ignora la API) |
| **Usuarios/Perfil** | ⚠️ Usa Mocks (`data/users.json`) | ✅ Endpoints vivos (`/users`) | **No Integrado** (El frontend ignora la API) |
| **Carrito de Compras** | ❌ Solo local (`CartContext.jsx`) | ✅ Endpoints vivos (`/cart`) | **No Integrado** (Frontend no usa la BD) |
| **Wishlist** | ❌ Inexistente/Mocks | ✅ Endpoints vivos (`/wishlist`) | **No Integrado** |
| **Reseñas (Reviews)** | ❌ Inexistente/Mocks | ✅ Endpoints vivos (`/review`) | **No Integrado** |
| **Notificaciones** | ❌ Inexistente | ✅ Endpoints vivos (`/notification`) | **No Integrado** |

---

### 1.2 Inventario de Uso de `localStorage` y Storage Local (Frontend)
Actualmente, el frontend depende fuertemente de persistencia en el navegador en lugar de la base de datos o estado seguro:
- `cart`: En **`CartContext.jsx`**, todo el carrito está atado a localStorage. No sobrevive entre distintos dispositivos del mismo usuario y no usa la API `/cart`.
- `authToken` y `userData`: En **`auth.js`**. Riesgo mediano de XSS. Lo ideal bajo SSDLC es usar HTTP-Only Cookies.
- `theme`: En **`ThemeContext.jsx`**. Uso correcto de localStorage para UX.
- `productsCache`: En **`productService.js`**. Guarda temporalmente (sessionStorage) productos para no re-fetchear frecuentemente.

---

### 1.3 Estado de la Documentación Swagger
**Diagnóstico:** Inexistente.
La búsqueda exhaustiva en `ecommerce-api` arrojó que **NO existe** configuración ni anotaciones de Swagger/OpenAPI en los endpoints (rutas o controladores). **Todos los endpoints requieren documentación Swagger.**

---

## 2. BACKLOG PRIORIZADO Y HALLAZGOS CRÍTICOS

### 🔴 P0 - Bugs Críticos y Tareas Bloqueantes (Deuda Técnica Alta)
- [x] **Migrar Carrito a Backend (`/cart`):** Abandonar `localStorage` para el carrito de sesión autenticada y conectar `CartContext.jsx` a la API (`ecommerce-api/src/routes/cartRoutes.js`).
- [x] **Conectar Categorías, Direcciones y Pagos a API:** Modificar los archivos en `ecommerce-app/src/services/` (`categoryService.js`, `shippingService.js`, `paymentService.js`, `userService.js`) para que dejen de importar `.json` estáticos e implementen llamadas HTTP reales mediante `axios`.

### 🟠 P1 - Mejoras de Arquitectura y Seguridad
- [x] **Documentación API (Swagger):** Instalar `swagger-ui-express` y `swagger-jsdoc` en `ecommerce-api`. Etiquetar todos los endpoints activos (Auth, Cart, Category, Product, Orders, Users, WishList, Reviews, Shipping).
- [x] **Mejorar Seguridad de Sesión (SSDLC):** Migrar el guardado de JWT en `localStorage` (como se hace en `auth.js`) a cookies HTTP-Only de servidor para evitar robos de token por XSS.
- [x] **Refactor: Data Fetching Frontend:** Existe caché manual e inconsistente en `productService.js` mediante sessionStorage y variables de memoria. Se debe migrar a una solución profesional estándar como **TanStack Query** (React Query) u otra estrategia sólida.

### 🟡 P2 - Funcionalidades Pendientes
- [x] **WishList Frontend:** Conectar UI existente (o diseñarla) con `ecommerce-api/src/routes/wishListRoutes.js`.
- [x] **Sistema de Reseñas (Reviews):** Implementar vista y formulario en Frontend para el controlador de reseñas ya existente en backend.
- [x] **Panel Administrativo:** Utilizar las rutas de `isAdmin` dentro del Frontend para gestionar usuarios, catálogo y visualizar órdenes holísticas.
