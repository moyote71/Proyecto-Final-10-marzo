# TECHNICAL_DEBT.md — Deuda Técnica & Roadmap

> **Última actualización:** 2026-03-11  
> **Objetivo:** Garantizar pruebas de API → Terminar frontend → Despliegue

---

## Leyenda de Prioridades

| Nivel | Significado | Acción |
|---|---|---|
| 🔴 **P0 — Crítico** | Bloquea funcionalidad, seguridad rota, rompe pruebas | Resolver antes de cualquier avance |
| 🟠 **P1 — Alto** | Integración incompleta, bugs conocidos con impacto real | Resolver antes del despliegue |
| 🟡 **P2 — Medio** | Experiencia de usuario degradada, código frágil | Resolver antes de considerar el frontend terminado |
| 🟢 **P3 — Bajo** | Mejoras de calidad, cobertura de tests, DX | Resolver en iteraciones posteriores |

---

## 🔴 P0 — Críticos (resolver primero)

### [API-001] `authMiddleware` retorna `403` en token inválido, debería ser `401`
- **Archivo:** `src/middlewares/authMiddleware.js:12`
- **Problema:** Cuando el token está presente pero es inválido o manipulado, el middleware devuelve `403 Forbidden` en lugar de `401 Unauthorized`. Esto rompe la semántica HTTP y los tests de seguridad.
- **Fix:** Cambiar `res.status(403)` → `res.status(401)` en el handler del `jwt.verify`.
- **Impacto:** Falla los tests de seguridad documentados en `AGENTS.testing.md`.

### [API-002] `REFRESH_TOKEN_SECRET` no está en `.env.example`
- **Archivos:** `src/controllers/authController.js:14`, `.env.example`
- **Problema:** `generateRefreshToken` usa `process.env.REFRESH_TOKEN_SECRET` pero esta variable **no está documentada** en `.env.example`. Si no existe, el proceso arroja `undefined` como secreto JWT — potencial falla silenciosa.
- **Fix:** Añadir `REFRESH_TOKEN_SECRET=tu_refresh_secreto` a `.env.example` y `AGENTS.md`.
- **Impacto:** Autenticación con refresh token rota en entornos frescos.

### [APP-001] Frontend no se integra con la API real — `utils/auth.js` usa credenciales hardcodeadas
- **Archivos:** `src/utils/auth.js`, `src/pages/Login.jsx`
- **Problema:** El login usa un diccionario hardcodeado y genera un `btoa` token falso. No hay JWT real ni llamada a `POST /api/auth/login`.
- **Fix:** Reemplazar `utils/auth.js` para llamar a la API con `http.post('/auth/login')` y almacenar el JWT real.
- **Impacto:** Toda la seguridad del frontend es falsa. Bloqueante para despliegue.

### [APP-002] `http.js` no inyecta el token JWT en las peticiones autenticadas
- **Archivo:** `src/services/http.js`
- **Problema:** El interceptor de Axios solo maneja errores de respuesta. No hay interceptor de **request** que añada `Authorization: Bearer <token>` automáticamente.
- **Fix:** Añadir interceptor de request:
  ```js
  http.interceptors.request.use(config => {
    const token = localStorage.getItem('authToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  ```
- **Impacto:** Todas las peticiones a endpoints protegidos fallan con `401`.

---

## 🟠 P1 — Alto (antes del despliegue)

### [API-003] `POST /api/auth/register` no devuelve token — documentación incorrecta
- **Archivo:** `src/controllers/authController.js:47`
- **Problema:** La respuesta es `{ displayName, email }` sin token ni `userId`. El usuario tiene que hacer login por separado tras registrarse.
- **Fix A (recomendado):** Tras registro exitoso, generar y retornar el token automáticamente.
- **Fix B:** Documentar correctamente el flujo: registrar → redirigir a login.
- **Impacto:** UX degradada; la documentación de la API está equivocada.

### [API-004] `POST /api/auth/login` no devuelve `user` en la respuesta
- **Archivo:** `src/controllers/authController.js:76`
- **Problema:** La respuesta real es `{ token, refreshToken }`. La documentación dice `{ token, user }`. El `user` nunca se retorna desde login.
- **Fix:** Incluir datos del usuario en la respuesta: `{ token, refreshToken, user: { _id, displayName, email, role } }`.
- **Impacto:** El frontend intenta leer `response.body.user` y falla silenciosamente.

### [API-005] Rutas del carrito están bajo `/cart` (singular) — documentadas como `/carts`
- **Archivo:** `src/routes/cartRoutes.js`
- **Problema:** Todos los endpoints del carrito usan el prefijo `/cart` (ej: `GET /api/cart`, `POST /api/cart/add-product`), no `/carts` como documenta el AGENTS.md.
- **Fix:** Corregir la documentación (o unificar el prefijo a `/carts` en el código).
- **Impacto:** Los tests de integración y el frontend usarán URLs incorrectas.

### [API-006] Las rutas del carrito **sí requieren autenticación** — documentadas como públicas
- **Archivo:** `src/routes/cartRoutes.js`
- **Problema:** `GET /cart` y `GET /cart/:id` requieren `authMiddleware` + `isAdmin`. Las demás rutas requieren `authMiddleware`. La documentación anterior decía que el carrito era público.
- **Fix:** Corregir la documentación.
- **Impacto:** Los tests fallarán porque no enviarán el token.

### [API-007] Módulo Users tiene 10+ endpoints no documentados
- **Archivo:** `src/routes/userRoutes.js`
- **Problema:** Existen endpoints completos no incluidos en `AGENTS.md`:
  - `GET /users/profile` — Perfil del usuario autenticado
  - `GET /users/search` — Búsqueda de usuarios (admin)
  - `PUT /users/profile` — Actualizar perfil propio
  - `PUT /users/change-password` — Cambiar contraseña
  - `PATCH /users/deactivate` — Desactivar cuenta propia
  - `PATCH /users/:userId/toggle-status` — Activar/Desactivar (admin)
  - `POST /users` — Crear usuario (admin)
- **Fix:** Añadir estos endpoints a `AGENTS.md`.
- **Impacto:** Los desarrolladores desconocen la API completa de usuarios.

### [API-008] Carrito tiene 3 endpoints nuevos no documentados
- **Archivos:** `src/routes/cartRoutes.js` (líneas 99-162)
  - `PUT /api/cart/update-item` — Actualizar cantidad de un item
  - `DELETE /api/cart/remove-item/:productId` — Quitar item específico
  - `POST /api/cart/clear` — Vaciar carrito completo
- **Nota adicional:** Los tres están duplicados en el archivo (bug en cartRoutes.js).
- **Fix:** Documentar los endpoints + eliminar los duplicados en cartRoutes.js.

### [APP-003] `Checkout.jsx` usa `total` desestructurado de `useCart()` pero no existe
- **Archivo:** `ecommerce-app/src/components/Checkout/Checkout.jsx`
- **Problema:** El context `CartContext` expone `getTotalPrice()` pero el checkout desestructura `total`, que siempre es `undefined`.
- **Fix:** Cambiar `const { ..., total } = useCart()` → `const { ..., getTotalPrice } = useCart()` y usar `getTotalPrice()`.
- **Impacto:** El total de la orden siempre es `undefined` — bug visual.

### [APP-004] Checkout no llama a `POST /api/orders` — orden solo en localStorage
- **Archivo:** `ecommerce-app/src/pages/Checkout.jsx`
- **Problema:** La orden se guarda en `localStorage["orders"]`. No hay petición real a la API.
- **Fix:** Integrar `orderService` que llame al endpoint real con el JWT del usuario.
- **Impacto:** Las órdenes no persisten en la base de datos.

---

## 🟡 P2 — Medio (antes de declarar frontend terminado)

### [APP-005] Categorías usan JSON local en lugar de la API real
- **Archivo:** `src/services/categoryService.js`
- **Problema:** Las categorías se leen de `data/categories.json`. La API tiene un endpoint completo `/api/categories`.
- **Fix:** Reemplazar el mock por `http.get('/categories')`.

### [APP-006] Métodos de pago y direcciones de envío usan datos mock
- **Archivos:** `src/services/paymentService.js`, `src/services/shippingService.js`
- **Problema:** Leen JSONs locales. La API tiene `/api/payment-methods` y `/api/shipping-addresses`.
- **Fix:** Integrar con los endpoints reales (requiere que el usuario esté autenticado).

### [API-009] `cartRoutes.js` duplica 3 bloques de código (bug)
- **Archivo:** `src/routes/cartRoutes.js` líneas 99-130 y 131-162
- **Problema:** Los bloques `update-item`, `remove-item` y `clear` están definidos dos veces exactamente.
- **Fix:** Eliminar la segunda declaración de cada bloque.

### [API-010] `authRoutes.js` tiene `router.post("/refresh", refreshToken)` duplicado
- **Archivo:** `src/routes/authRoutes.js` líneas 48 y 50
- **Fix:** Eliminar la línea duplicada.

### [APP-007] `getProductById` en el frontend usa mock en lugar del endpoint real
- **Archivo:** `src/services/productService.js`
- **Problema:** `getProductById` busca en la lista cargada por `fetchProducts()` en lugar de llamar a `GET /api/products/:id`.
- **Fix:** `return http.get(\`/products/${id}\`).then(r => r.data)`.

### [API-011] Categorías tienen endpoint `GET /categories/search` no documentado
- **Archivo:** `src/routes/categoryRoutes.js:29`
- **Parámetros:** `q`, `parentCategory`, `sort`, `order`, `page`, `limit`
- **Fix:** Añadir a `AGENTS.md`.

### [API-012] `checkEmail` retorna `{ taken: boolean }` — documentado como `{ exists: boolean }`
- **Archivo:** `src/controllers/authController.js:89`
- **Fix:** Corregir la documentación en `AGENTS.md`.

---

## 🟢 P3 — Bajo (calidad y cobertura)

### [API-013] JWT sin refresh automático en el frontend
- `expiresIn: "1h"` — Si el usuario no actúa en 1h, la sesión expira sin aviso.
- **Fix P3:** Añadir interceptor de respuesta en `http.js` para detectar `401` y hacer refresh automático.

### [API-014] Falta validación de roles en `getOrdersByUser`
- Cualquier usuario autenticado puede pedir las órdenes de otro usuario con su ID.
- **Fix:** Verificar que `req.user.userId === req.params.userId || req.user.role === 'admin'`.

### [API-015] Passwords no pasan validación de complejidad real
- Solo se valida longitud mínima. No hay requisito de mayúsculas, números, ni caracteres especiales.
- **Fix P3:** Añadir `isStrongPassword()` del paquete `express-validator`.

### [APP-008] Tests Cypress — `data-testid` no implementados en los componentes
- Los 42 atributos listados en `AGENTS.testing.md` aún no existen en el código.
- **Fix:** Implementar iterativamente antes de correr las suites Cypress.

### [APP-009] No hay manejo de errores 401/403 en el frontend
- Si la API devuelve `401`, el usuario ve un error genérico o nada.
- **Fix:** Interceptor en `http.js` que detecte `401` y redirija a `/login`.

### [APP-010] `userService.js` usa mock JSON en lugar del endpoint `/api/users`
- **Archivo:** `src/services/userService.js`
- Bajo impacto para el usuario final pero importante para admin.

---

## 📋 Roadmap Sugerido

### Fase 1 — API estable y probada (P0 + P1 API)
1. Corregir `authMiddleware` (P0 → `401`)
2. Añadir `REFRESH_TOKEN_SECRET` al `.env.example`
3. Retornar `user` y opcionalmente token en `POST /register`
4. Retornar objeto `user` completo en `POST /login`
5. Eliminar duplicados en `cartRoutes.js` y `authRoutes.js`
6. Corregir documentación de rutas de carrito (`/cart` no `/carts`)
7. Implementar tests pendientes en `AGENTS.testing.md` (⬜ → ✅)

### Fase 2 — Integración Frontend (P1 APP)
1. Reemplazar `utils/auth.js` para usar la API JWT real
2. Añadir interceptor de request en `http.js` para inyectar token
3. Corregir bug `total` → `getTotalPrice()` en Checkout
4. Integrar `POST /api/orders` en Checkout

### Fase 3 — Frontend completo (P2)
1. Integrar categorías, métodos de pago, direcciones con la API real
2. Corregir `getProductById` para usar el endpoint real
3. Implementar 42 `data-testid` para Cypress
4. Ejecutar y depurar las 6 suites Cypress

### Fase 4 — Despliegue
1. Configurar variables de entorno de producción
2. Dockerizar API + MongoDB o usar servicio cloud (Railway, Render)
3. Deploy frontend en Vercel/Netlify con `REACT_APP_API_URL` correcto
4. Configurar CORS en API para el dominio de producción
