# IMPLEMENTATION_PLAN.md — Plan de Implementación

> **Objetivo:** API estable y probada → Frontend integrado → Despliegue  
> **Última actualización:** 2026-03-11  
> **Convención de progreso:** `[ ]` pendiente · `[/]` en progreso · `[x]` completado

---

## Cómo usar este documento

1. **Antes de empezar** cualquier tarea: cambia `[ ]` → `[/]` y anota la fecha.
2. **Al terminar**: cambia `[/]` → `[x]` y deja un comentario breve con lo que se hizo o si quedó algo pendiente.
3. **Referencia cruzada:** cada issue tiene un ID que corresponde a [`TECHNICAL_DEBT.md`](./TECHNICAL_DEBT.md).
4. **Ver la documentación actualizada** en [`ecommerce-api/AGENTS.md`](./ecommerce-api/AGENTS.md) y los planes de prueba en `AGENTS.testing.md` de cada subproyecto.

---

## Fase 1 — API Estable y Probada 🔴 P0 + 🟠 P1

### 1.1 Corrección de bugs críticos en la API

- [ ] **[API-001]** `authMiddleware`: cambiar `res.status(403)` → `res.status(401)` para tokens inválidos/expirados  
  _Archivo: `ecommerce-api/src/middlewares/authMiddleware.js:12`_

- [ ] **[API-002]** Añadir `REFRESH_TOKEN_SECRET` a `.env.example` y verificar que el proceso no arranca sin ella  
  _Archivo: `ecommerce-api/src/.env.example`_

- [ ] **[API-009]** Eliminar duplicados en `cartRoutes.js` (bloques `update-item`, `remove-item`, `clear` declarados dos veces)  
  _Archivo: `ecommerce-api/src/routes/cartRoutes.js` líneas 99-162_

- [ ] **[API-010]** Eliminar `router.post("/refresh", refreshToken)` duplicado en `authRoutes.js`  
  _Archivo: `ecommerce-api/src/routes/authRoutes.js:50`_

### 1.2 Mejoras de respuesta en la API

- [ ] **[API-003]** `POST /api/auth/register`: retornar token + datos básicos del usuario tras registro exitoso  
  _Archivo: `ecommerce-api/src/controllers/authController.js:47`_

- [ ] **[API-004]** `POST /api/auth/login`: incluir `user: { _id, displayName, email, role }` en la respuesta  
  _Archivo: `ecommerce-api/src/controllers/authController.js:76`_

- [ ] **[API-014]** `GET /api/orders/user/:userId`: validar que `req.user.userId === userId` o rol admin  
  _Archivo: `ecommerce-api/src/controllers/orderController.js:35`_

### 1.3 Pruebas de la API (Vitest + Supertest)

Referencia: [`ecommerce-api/AGENTS.testing.md`](./ecommerce-api/AGENTS.testing.md) — sección Matriz de Cobertura.

- [ ] Auth: `POST /auth/register` — cobertura completa (201/409/422)
- [ ] Auth: `POST /auth/login` — (200/400/422)
- [ ] Auth: `GET /auth/check-email` — (200/422)
- [ ] Auth: `POST /auth/refresh` — (200/401)
- [ ] Products: `GET /products/:id` — (200/400/404)
- [ ] Products: `POST /products` — (201/401/403/422)
- [ ] Products: `PUT /products/:id` — (200/401/403/404)
- [ ] Products: `DELETE /products/:id` — (204/401/403/404)
- [ ] Orders: `GET /orders` — (200/401/403)
- [ ] Orders: `PATCH /orders/:id/status` — (200/401/403/422)
- [ ] Orders: `DELETE /orders/:id` — (204/400/401/403)
- [ ] Cart: `POST /cart/add-product` — (200/401/422)
- [ ] Security: token ausente → 401
- [ ] Security: token inválido → 401 (después de fix [API-001])
- [ ] Security: rol insuficiente → 403
- [ ] Security: NoSQL injection → 422
- [ ] Security: ObjectId malformado → 400

---

## Fase 2 — Integración Frontend con API Real 🟠 P1

- [ ] **[APP-001]** Reemplazar `utils/auth.js`: llamar a `POST /api/auth/login` y guardar el JWT real  
  _Archivo: `ecommerce-app/src/utils/auth.js`_

- [ ] **[APP-002]** Añadir interceptor de request en `http.js` para inyectar `Authorization: Bearer <token>`  
  _Archivo: `ecommerce-app/src/services/http.js`_

- [ ] **[APP-003]** Corregir bug en `Checkout.jsx`: `total` → `getTotalPrice()`  
  _Archivo: `ecommerce-app/src/pages/Checkout.jsx`_

- [ ] **[APP-004]** Integrar `POST /api/orders` en el flujo de checkout (reemplazar guardado en localStorage)  
  _Archivo: `ecommerce-app/src/pages/Checkout.jsx`_

---

## Fase 3 — Frontend Completo y Pruebas E2E 🟡 P2

- [ ] **[APP-005]** Integrar `GET /api/categories` en `categoryService.js` (reemplazar mock JSON)

- [ ] **[APP-006]** Integrar `GET /api/payment-methods` y `GET /api/shipping-addresses` con el usuario autenticado

- [ ] **[APP-007]** Corregir `getProductById` para usar `GET /api/products/:id` directamente

- [ ] **[APP-008]** Implementar los 42 atributos `data-testid` en los componentes  
  _Referencia: tabla en [`ecommerce-app/AGENTS.testing.md`](./ecommerce-app/AGENTS.testing.md#8-tabla-de-data-testid-requeridos)_

- [ ] Configurar Cypress: crear `cypress.config.js` e instalar con `npm install cypress --save-dev`

- [ ] Ejecutar y depurar suite `auth.cy.js`

- [ ] Ejecutar y depurar suite `products.cy.js`

- [ ] Ejecutar y depurar suite `cart.cy.js`

- [ ] Ejecutar y depurar suite `checkout.cy.js`

- [ ] Ejecutar y depurar suite `wishlist.cy.js` + `theme.cy.js`

- [ ] **[APP-009]** Interceptor en `http.js` para redirigir a `/login` en respuestas `401`

---

## Fase 4 — Despliegue 🚀

- [ ] Configurar variables de entorno de producción (`.env.production`)
- [ ] Elegir plataforma para la API: Railway / Render / VPS
- [ ] Configurar MongoDB Atlas para la base de datos en producción
- [ ] Ajustar `CORS_ORIGIN` en la API al dominio del frontend en producción
- [ ] Deploy del frontend en Vercel / Netlify con `REACT_APP_API_URL` correcto
- [ ] Ejecutar suites Cypress contra el entorno de staging

---

## Registro de Cambios

| Fecha | Quien | Cambio |
|---|---|---|
| 2026-03-11 | IA | Creación del plan inicial basado en auditoría de código |

> Añade una fila a esta tabla cada vez que completes una fase o un bloque de tareas.
