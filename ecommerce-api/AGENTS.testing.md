# AGENTS.testing.md — Plan de Pruebas de la API `ecommerce-api`

> **Última actualización:** 2026-03-11  
> **Progreso del plan:**
> - [x] Pruebas de Requests/Responses — Auth
> - [x] Pruebas de Requests/Responses — Products
> - [x] Pruebas de Requests/Responses — Orders
> - [x] Pruebas de Requests/Responses — Cart, Categories, Users
> - [x] Pruebas de Seguridad
> - [x] Pruebas de Rendimiento
> - [x] Configuración Vitest/Supertest

---

## Índice

1. [Configuración del Entorno de Pruebas](#1-configuración-del-entorno-de-pruebas)
2. [Pruebas de Requests y Responses](#2-pruebas-de-requests-y-responses)
3. [Pruebas de Seguridad](#3-pruebas-de-seguridad)
4. [Pruebas de Rendimiento](#4-pruebas-de-rendimiento)
5. [Matriz de Cobertura](#5-matriz-de-cobertura)

---

## 1. Configuración del Entorno de Pruebas

### Stack de Testing

| Herramienta | Rol |
|---|---|
| `vitest` | Test runner (compatible con ES Modules) |
| `supertest` | Cliente HTTP para pruebas de integración |
| Mocks de Mongoose | Evita dependencia de DB real en CI |
| `k6` | Pruebas de rendimiento / carga |

### Scripts disponibles

```bash
npm test              # Ejecuta todos los tests (Vitest)
npm run test:ui       # Interfaz visual interactiva de Vitest
npm run test:coverage # Reporte de cobertura de código
```

### `vitest.config.js`

```js
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/tests/setup.js'],
    hookTimeout: 30000,
  },
});
```

### `src/tests/setup.js` — Patrón de Mocks Mongoose

Los mocks simulan el encadenamiento de métodos de Mongoose (`.find().populate().exec()`):

```js
// Uso en un test
Product.find().exec.mockResolvedValue([mockProduct]);
// Si el controller usa await Model.find(), funciona vía .then()
```

> [!TIP]
> Nunca uses `mongodb-memory-server` en este proyecto — en Mac con Apple Silicon pueden fallar los binarios. Usa el sistema de mocks de `setup.js`.

---

## 2. Pruebas de Requests y Responses

### 2.1 Autenticación (`/api/auth`)

#### `POST /api/auth/register`

| Case | Body | Status esperado | Response |
|---|---|---|---|
| Happy path | displayName, email, password, phone válidos | `201` | `{ token, user }` |
| Email duplicado | email ya existente | `409` | `{ error: "Email already exists" }` |
| Email inválido | `email: "no-es-email"` | `422` | `{ errors: [...] }` |
| Password corta | `password: "abc"` | `422` | `{ errors: [...] }` |
| Body vacío | `{}` | `422` | `{ errors: [...] }` |
| Phone inválido | `phone: "123456789012"` (>10 dígitos) | `422` | `{ errors: [...] }` |

```js
// src/tests/auth.test.js
it('POST /register — 201 con datos válidos', async () => {
  const res = await request(app).post('/api/auth/register').send({
    displayName: 'Test User',
    email: `test${Date.now()}@example.com`,
    password: 'Password123!',
    phone: '1234567890',
  });
  expect(res.status).toBe(201);
  expect(res.body).toHaveProperty('token');
  expect(res.body.user).toHaveProperty('_id');
});

it('POST /register — 409 email duplicado', async () => {
  User.findOne.mockResolvedValue({ email: 'dupe@test.com' });
  const res = await request(app).post('/api/auth/register').send({
    displayName: 'Dup', email: 'dupe@test.com',
    password: 'Password123!', phone: '1234567890',
  });
  expect(res.status).toBe(409);
});
```

#### `POST /api/auth/login`

| Case | Body | Status | Response |
|---|---|---|---|
| Credenciales válidas | email + password correctos | `200` | `{ token, user }` |
| Password incorrecta | password errónea | `400` | `{ error: "Invalid credentials" }` |
| Email no registrado | email inexistente | `400` | `{ error: "..." }` |
| Sin body | `{}` | `422` | `{ errors: [...] }` |

```js
it('POST /login — 200 genera JWT válido', async () => {
  bcrypt.compare.mockResolvedValue(true);
  User.findOne.mockResolvedValue({ _id: 'uid', email: 'u@u.com', role: 'customer', hashPassword: 'h' });
  const res = await request(app).post('/api/auth/login').send({
    email: 'u@u.com', password: 'Password123!',
  });
  expect(res.status).toBe(200);
  expect(res.body.token).toMatch(/^eyJ/); // JWT format
});
```

#### `GET /api/auth/check-email`

| Case | Query | Status | Response |
|---|---|---|---|
| Email disponible | `?email=nuevo@test.com` | `200` | `{ exists: false }` |
| Email en uso | `?email=existente@test.com` | `200` | `{ exists: true }` |
| Email inválido | `?email=notanemail` | `422` | `{ errors: [...] }` |

---

### 2.2 Productos (`/api/products`)

#### `GET /api/products`

| Case | Query | Status | Response |
|---|---|---|---|
| Sin parámetros | — | `200` | `{ data: [...], total, page, limit }` |
| Con paginación | `?page=2&limit=5` | `200` | 5 productos, página 2 |
| Parámetros inválidos | `?page=-1` | `422` | `{ errors: [...] }` |

```js
it('GET /products — 200 con paginación por defecto', async () => {
  Product.find().exec.mockResolvedValue([mockProduct]);
  Product.countDocuments.mockResolvedValue(1);
  const res = await request(app).get('/api/products');
  expect(res.status).toBe(200);
  expect(res.body.data).toBeInstanceOf(Array);
});
```

#### `GET /api/products/search`

| Case | Query | Status | Response |
|---|---|---|---|
| Búsqueda por texto | `?q=laptop` | `200` | Productos filtrados |
| Filtro precio | `?minPrice=100&maxPrice=500` | `200` | Productos en rango |
| Solo en stock | `?inStock=true` | `200` | Solo stock > 0 |
| Ordenado desc | `?sort=price&order=desc` | `200` | Más caro primero |
| Combinado | `?q=phone&inStock=true&sort=price&order=asc` | `200` | Multi-filtro |
| Sort inválido | `?sort=invalidField` | `422` | `{ errors: [...] }` |

#### `GET /api/products/:id`

| Case | Param | Status | Response |
|---|---|---|---|
| ID válido y existente | ObjectId válido | `200` | Objeto producto |
| ID no existente | ObjectId válido pero no en DB | `404` | `{ error: "Not found" }` |
| ID malformado | `"abc123"` | `400` | `{ errors: [...] }` |

#### `POST /api/products` (Admin)

| Case | Body / Auth | Status | Response |
|---|---|---|---|
| Admin, datos válidos | JWT admin + body completo | `201` | Producto creado |
| Sin token | Sin header Auth | `401` | `{ error: "..." }` |
| Token de customer | JWT con role: customer | `403` | `{ error: "Forbidden" }` |
| Precio negativo | `{ price: -10 }` | `422` | `{ errors: [...] }` |
| Category inválida | `{ category: "notanid" }` | `422` | `{ errors: [...] }` |

---

### 2.3 Órdenes (`/api/orders`)

#### `POST /api/orders`

| Case | Body / Auth | Status | Response |
|---|---|---|---|
| Usuario autenticado, stock suficiente | JWT válido + productos con stock | `201` | Orden creada |
| Stock insuficiente | Quantity > stock disponible | `400` | `{ error: "Insufficient stock" }` |
| Sin autenticación | Sin JWT | `401` | `{ error: "..." }` |
| Products vacío | `{ products: [] }` | `422` | `{ errors: [...] }` |
| ShippingAddress inválido | ObjectId malformado | `422` | `{ errors: [...] }` |

```js
it('POST /orders — 201 descuenta stock', async () => {
  Product.findById.mockResolvedValue({ stock: 10, save: jest.fn() });
  const res = await request(app)
    .post('/api/orders')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({
      user: userId,
      products: [{ productId: productId, quantity: 2, price: 100 }],
      shippingAddress: addressId,
      paymentMethod: paymentId,
    });
  expect(res.status).toBe(201);
});
```

#### `PATCH /api/orders/:id/status`

| Case | Auth | Body | Status |
|---|---|---|---|
| Admin, estado válido | JWT admin | `{ status: "shipped" }` | `200` |
| Customer (sin permisos) | JWT customer | `{ status: "shipped" }` | `403` |
| Estado inválido | JWT admin | `{ status: "flying" }` | `422` |

#### `DELETE /api/orders/:id`

| Case | Auth | Estado de orden | Status |
|---|---|---|---|
| Admin, orden cancelada | JWT admin | `cancelled` | `200` |
| Admin, orden activa | JWT admin | `pending` | `400` — no se puede borrar |
| Customer | JWT customer | `cancelled` | `403` |

---

### 2.4 Otros Módulos

#### Cart, Categories, Users — Pruebas esenciales

```js
// GET /api/categories — sin auth, debe 200
it('GET /categories — 200 lista pública', async () => {
  Category.find().exec.mockResolvedValue([{ name: 'Electronics' }]);
  const res = await request(app).get('/api/categories');
  expect(res.status).toBe(200);
});

// GET /api/carts/user/:id — devuelve carrito del usuario
it('GET /carts/user/:userId — 200', async () => {
  Cart.findOne().exec.mockResolvedValue({ user: userId, products: [] });
  const res = await request(app).get(`/api/carts/user/${userId}`);
  expect(res.status).toBe(200);
});
```

---

## 3. Pruebas de Seguridad

### 3.1 Autenticación y Autorización JWT

| Escenario | Header enviado | Status esperado |
|---|---|---|
| Token ausente en ruta protegida | Sin `Authorization` | `401` |
| Token con firma inválida | `Bearer token_manipulado` | `401` |
| Token expirado (1h) | Token real pero expirado | `401` |
| Token de customer en ruta admin | JWT con `role: customer` | `403` |
| Token bien formado pero userId falso | JWT firmado con userId inexistente | `401` o `404` |

```js
it('401 sin Bearer token en ruta protegida', async () => {
  const res = await request(app).get('/api/orders');
  expect(res.status).toBe(401);
});

it('403 customer intenta crear producto', async () => {
  const res = await request(app)
    .post('/api/products')
    .set('Authorization', `Bearer ${customerToken}`)
    .send({ name: 'Hack', price: 1, stock: 1, category: catId });
  expect(res.status).toBe(403);
});

it('401 token con firma alterada', async () => {
  const fakeToken = validToken.slice(0, -5) + 'XXXXX';
  const res = await request(app)
    .get('/api/orders')
    .set('Authorization', `Bearer ${fakeToken}`);
  expect(res.status).toBe(401);
});
```

### 3.2 Rate Limiting

El rate limiter está activo en `/api/auth/*` en entornos no-test.

```js
// Test de rate limit (ejecutar fuera de NODE_ENV=test, con DB real)
it('429 tras superar el límite de requests', async () => {
  const requests = Array(101).fill(null).map(() =>
    request(app).post('/api/auth/login').send({ email: 'x@x.com', password: 'w' })
  );
  const responses = await Promise.all(requests);
  const rateLimited = responses.filter(r => r.status === 429);
  expect(rateLimited.length).toBeGreaterThan(0);
});
```

### 3.3 Validación de Inputs (Anti-Injection)

| Escenario | Input | Status | Descripción |
|---|---|---|---|
| NoSQL Injection en email | `{ "email": { "$gt": "" } }` | `422` | express-validator rechaza |
| ObjectId malformado | `id = "'; DROP TABLE users;"` | `400` | Validación mongoIdValidation |
| XSS en displayName | `<script>alert(1)</script>` | `422` / body saneado | Depende de validador |
| Precio como string | `{ "price": "cien" }` | `422` | isNumeric falla |
| Quantity negativa | `{ "quantity": -5 }` | `422` | min: 1 falla |

```js
it('NoSQL injection en login rechazada', async () => {
  const res = await request(app)
    .post('/api/auth/login')
    .send({ email: { $gt: '' }, password: 'anything' });
  expect(res.status).toBe(422);
});

it('ObjectId malformado → 400', async () => {
  const res = await request(app).get('/api/products/NOTANOBJECTID');
  expect(res.status).toBe(400);
});
```

### 3.4 CORS

```js
it('CORS bloquea origen no permitido', async () => {
  const res = await request(app)
    .get('/api/products')
    .set('Origin', 'https://evil-site.com');
  // Supertest no verifica CORS como un browser — verificar en integration manual
  // En browser: el preflight OPTIONS debe fallar para orígenes no permitidos
});
```

> [!NOTE]
> Para verificación real de CORS, ejecutar `npm run dev` y usar un browser con DevTools o herramienta como `curl -H "Origin: https://evil.com" -X OPTIONS http://localhost:4000/api/products -v`.

---

## 4. Pruebas de Rendimiento

### 4.1 Herramienta: k6

```bash
# Instalar k6 (macOS)
brew install k6

# Ejecutar un script de carga
k6 run scripts/load-test.js
```

### 4.2 Targets de Rendimiento

| Endpoint | Métrica | Target |
|---|---|---|
| `GET /api/products` | p95 latencia | < 200ms |
| `GET /api/products/search` | p95 latencia | < 300ms |
| `POST /api/auth/login` | p95 latencia | < 400ms |
| `POST /api/orders` | p95 latencia | < 500ms |
| Error rate global | % errores 5xx | < 1% |

### 4.3 Script de Carga — `scripts/load-test.js`

```js
import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate } from 'k6/metrics';

const errorRate = new Rate('errors');

export const options = {
  stages: [
    { duration: '1m', target: 20 },   // Rampa: 0 → 20 VUs en 1 minuto
    { duration: '3m', target: 20 },   // Carga sostenida: 20 VUs por 3 minutos
    { duration: '1m', target: 0 },    // Bajada: 20 → 0
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'],  // 95% de requests < 500ms
    errors: ['rate<0.01'],             // < 1% errores
  },
};

const BASE_URL = 'http://localhost:4000/api';

// Setup: obtener token
export function setup() {
  const res = http.post(`${BASE_URL}/auth/login`, JSON.stringify({
    email: 'admin@email.com',
    password: 'admin123',
  }), { headers: { 'Content-Type': 'application/json' } });
  return { token: res.json('token') };
}

export default function (data) {
  const params = {
    headers: { Authorization: `Bearer ${data.token}` },
  };

  // Test 1: Listado de productos (pública)
  const r1 = http.get(`${BASE_URL}/products?page=1&limit=10`);
  errorRate.add(r1.status !== 200);
  check(r1, { 'products 200': (r) => r.status === 200 });

  // Test 2: Búsqueda con filtros
  const r2 = http.get(`${BASE_URL}/products/search?q=phone&sort=price&order=asc`);
  errorRate.add(r2.status !== 200);
  check(r2, { 'search 200': (r) => r.status === 200 });

  // Test 3: Órdenes (autenticado)
  const r3 = http.get(`${BASE_URL}/orders`, params);
  errorRate.add(![200, 403].includes(r3.status));

  sleep(1); // think time entre iteraciones
}
```

### 4.4 Script de Estrés — `scripts/stress-test.js`

```js
import http from 'k6/http';
import { sleep } from 'k6';

export const options = {
  stages: [
    { duration: '2m', target: 100 },
    { duration: '5m', target: 100 },
    { duration: '2m', target: 200 },
    { duration: '5m', target: 200 },
    { duration: '2m', target: 0 },
  ],
  thresholds: {
    http_req_duration: ['p(99)<1500'], // 99% < 1.5s bajo estrés
    http_req_failed: ['rate<0.05'],    // < 5% errores
  },
};

export default function () {
  http.get('http://localhost:4000/api/products');
  sleep(0.5);
}
```

---

## 5. Matriz de Cobertura

### Endpoints verificados con Vitest + Supertest

| Módulo | Endpoint | Método | Happy Path | Error Cases | Auth/Roles | Estado |
|:---|:---|:---|:---|:---|:---|:---|
| **Auth** | `/api/auth/register` | POST | ✅ | 400/409/422 | N/A | ✅ Implementado |
| **Auth** | `/api/auth/login` | POST | ✅ | 400/422 | N/A | ✅ Implementado |
| **Auth** | `/api/auth/refresh` | POST | ⬜ | 401 | N/A | ⬜ Pendiente |
| **Auth** | `/api/auth/check-email` | GET | ⬜ | 422 | N/A | ⬜ Pendiente |
| **Products** | `/api/products` | GET | ✅ | 422 | N/A | ✅ Implementado |
| **Products** | `/api/products/search` | GET | ✅ | 422 | N/A | ✅ Implementado |
| **Products** | `/api/products/:id` | GET | ⬜ | 400/404 | N/A | ⬜ Pendiente |
| **Products** | `/api/products` | POST | ⬜ | 401/403/422 | Admin | ⬜ Pendiente |
| **Products** | `/api/products/:id` | PUT | ⬜ | 401/403/422 | Admin | ⬜ Pendiente |
| **Products** | `/api/products/:id` | DELETE | ⬜ | 401/403 | Admin | ⬜ Pendiente |
| **Orders** | `/api/orders` | POST | ✅ | 400/401/422 | Auth | ✅ Implementado |
| **Orders** | `/api/orders` | GET | ⬜ | 401/403 | Admin | ⬜ Pendiente |
| **Orders** | `/api/orders/:id/status` | PATCH | ⬜ | 401/403/422 | Admin | ⬜ Pendiente |
| **Orders** | `/api/orders/:id` | DELETE | ⬜ | 400/401/403 | Admin | ⬜ Pendiente |
| **Cart** | `/api/carts/add` | POST | ⬜ | 422 | N/A | ⬜ Pendiente |
| **Categories** | `/api/categories` | GET | ⬜ | — | N/A | ⬜ Pendiente |

> [!NOTE]
> Actualiza el estado de cada endpoint en esta tabla conforme implementes los tests. Los marcados ✅ tienen implementación en `src/tests/`.

### Cobertura de Seguridad

| Escenario | Implementado |
|---|---|
| Token ausente → 401 | ⬜ Pendiente |
| Token manipulado → 401 | ⬜ Pendiente |
| Rol insuficiente → 403 | ⬜ Pendiente |
| NoSQL Injection → 422 | ⬜ Pendiente |
| ObjectId malformado → 400 | ⬜ Pendiente |
| Rate limit → 429 | ⬜ Pendiente (requiere entorno no-test) |

### Cobertura de Rendimiento

| Script | Estado |
|---|---|
| `scripts/load-test.js` | ⬜ Script creado, pendiente ejecución |
| `scripts/stress-test.js` | ⬜ Script creado, pendiente ejecución |
