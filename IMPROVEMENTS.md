# IMPROVEMENTS.md — Mejoras Propuestas para ECOMMERCE-REACT

> Análisis generado automáticamente a partir del código fuente.  
> Prioridad: 🔴 Crítico · 🟠 Alto · 🟡 Medio · 🟢 Bajo

---

## 🔴 CRÍTICO — Bugs que Rompen Funcionalidad

### 1. Parámetro `next` no declarado en controladores

**Archivos afectados:**
- `ecommerce-api/src/controllers/productController.js` → `getProducts`, `getProductById`, `createProduct`, `updateProduct`
- `ecommerce-api/src/controllers/orderController.js` → `getOrders`, `getOrderById`, `getOrdersByUser`, `createOrder`, `updateOrder`, `cancelOrder`, `updateOrderStatus`, `updatePaymentStatus`
- `ecommerce-api/src/controllers/cartController.js` → `getCarts`, `getCartById`, `getCartByUser`, `createCart`, `updateCart`, `addProductToCart`

**Problema:** `next(error)` se llama dentro del bloque `catch` pero la función no recibe `next` como parámetro. Esto lanza un `ReferenceError: next is not defined` en cualquier error, rompiendo el manejo centralizado de errores.

**Solución:**
```js
// ❌ Actual
async function getProducts(req, res) {
  try { ... } catch (error) { next(error); }
}

// ✅ Correcto
async function getProducts(req, res, next) {
  try { ... } catch (error) { next(error); }
}
```

---

### 2. `Checkout.jsx` usa `total` de CartContext pero CartContext no lo expone

**Archivo:** `ecommerce-app/src/pages/Checkout.jsx` (línea 25)

**Problema:**
```js
const { cartItems, total, clearCart } = useCart();
const subtotal = total || 0;  // ← total es siempre undefined
```

`CartContext` expone `getTotalPrice()` como función, no `total` como valor.

**Solución:**
```js
const { cartItems, getTotalPrice, clearCart } = useCart();
const subtotal = getTotalPrice();
```

---

### 3. CORS mal configurado en `server.js`

**Archivo:** `ecommerce-api/server.js` (línea 19)

```js
// ❌ Actual — usa https en localhost (sin certificado SSL)
app.use(cors({ origin: 'https://localhost:3000', credentials: true }));

// ✅ Correcto
app.use(cors({ origin: process.env.CORS_ORIGIN || 'http://localhost:3000', credentials: true }));
```

---

### 4. Rutas no montadas en el router principal

**Archivo:** `ecommerce-api/src/routes/index.js`

Los siguientes archivos de rutas existen pero **no se registran** en el router:
- `userRoutes.js`
- `reviewRoutes.js`
- `shippingAddressRoutes.js`
- `wishListRoutes.js`

**Solución:** Importar y montar con `router.use(...)` en `routes/index.js`.

---

### 5. `orderController.js` importa `errorHandler` sin usarlo

**Archivo:** `ecommerce-api/src/controllers/orderController.js` (línea 2)
`cartController.js` también lo importa innecesariamente.

Eliminar el import; el manejo de errores se hace a través de `next(error)`.

---

## 🟠 ALTO — Deuda Técnica Importante

### 6. Autenticación del frontend no integrada con la API

**Archivo:** `ecommerce-app/src/utils/auth.js`

El login del frontend usa credenciales hardcodeadas y genera un token falso con `btoa()`. No llama al endpoint `POST /api/auth/login`.

**Plan de integración:**
```js
import { http } from '../services/http';

export async function login(email, password) {
  const { data } = await http.post('auth/login', { email, password });
  localStorage.setItem('authToken', data.token);
  // Decodificar JWT y guardar userData
}
```

Además, `http.js` debe incluir el token en las solicitudes:
```js
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('authToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});
```

---

### 7. Checkout no crea órdenes en la API

**Archivo:** `ecommerce-app/src/pages/Checkout.jsx` (función `handleCreateOrder`)

Actualmente solo guarda en `localStorage["orders"]`. Debe llamar a `POST /api/orders`:

```js
import { http } from '../services/http';

const handleCreateOrder = async () => {
  const payload = {
    user: currentUser.userId,
    products: cartItems.map(i => ({
      productId: i._id,
      quantity: i.quantity,
      price: i.price,
    })),
    shippingAddress: selectedAddress._id,
    paymentMethod: selectedPayment._id,
    shippingCost,
  };
  const { data: order } = await http.post('orders', payload);
  clearCart();
  navigate('/order-confirmation', { state: { order } });
};
```

---

### 8. Servicios de categoría, usuario, pago y envío usan datos mock

**Archivos:**
- `categoryService.js` → JSON local
- `userService.js` → JSON local con delay artificial de 1.5s
- `paymentService.js` → JSON local
- `shippingService.js` → JSON local

Todos deben migrarse a `http.js`:
```js
export const fetchCategories = () => http.get('categories').then(r => r.data);
export const fetchPaymentMethods = () => http.get('payment-methods').then(r => r.data);
// etc.
```

---

### 9. `getProductById` en `productService.js` usa mock en lugar de la API

```js
// ❌ Actual
async function getProductById(id) {
  await new Promise((res) => setTimeout(res, 300)); // delay artificial
  const products = await fetchProducts(); // descarga TODOS los productos
  return products.find((p) => p._id === id); // búsqueda en cliente
}

// ✅ Correcto
async function getProductById(id) {
  const { data } = await http.get(`products/${id}`);
  return data;
}
```

---

### 10. No hay refresh token — JWT expira en 1h sin renovación

**Archivo:** `ecommerce-api/src/controllers/authController.js`

El token JWT expira en 1 hora y no hay ningún mecanismo de renovación. El usuario queda bloqueado sin feedback claro.

**Soluciones opcionales:**
- Implementar `PUT /api/auth/refresh` con un refresh token de larga duración.
- O ampliar la expiración a 7 días y aceptar el riesgo hasta implementar logout activo.

---

## 🟡 MEDIO — Mejoras de Calidad y Robustez

### 11. Agregar validación con `express-validator` a rutas de productos (POST/PUT)

Actualmente la validación manual en `createProduct`/`updateProduct` verifica campos vacíos pero no valida tipos ni rangos. Usar `body()` como en `authRoutes.js`.

---

### 12. Proteger rutas del carrito con autenticación

**Archivo:** `ecommerce-api/src/routes/cartRoutes.js`

Las rutas del carrito no tienen `authMiddleware`, cualquiera puede listar o modificar carritos ajenos.

---

### 13. MongoDB: agregar timestamps a todos los modelos

Solo el modelo `Order` tendría beneficio inmediato pero niguno usa `timestamps: true`.

```js
const cartSchema = new mongoose.Schema({ ... }, { timestamps: true });
```

---

### 14. `User` no tiene índice en `isActive`

Si muchos usuarios se desactivan, las consultas se vuelven costosas sin índice:

```js
isActive: { type: Boolean, default: true, index: true }
```

---

### 15. Logger HTTP no loguea en archivo

`logger.js` solo hace `console.log`. Para entornos de producción conviene escribir a archivo o integrar un logger como `pino` o `winston`.

---

### 16. Agregar contexto de usuario autenticado al frontend

No existe un `AuthContext` o `UserContext` centralizado en el frontend. `isAuthenticated()` y `getCurrentUser()` se llaman directamente desde `localStorage` en cada componente que los necesita.

**Plan sugerido:**
```jsx
// context/AuthContext.jsx
export function AuthProvider({ children }) {
  const [user, setUser] = useState(getCurrentUser());
  const login = async (email, password) => { ... };
  const logout = () => { ... setUser(null); };
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
```

---

### 17. `searchProducts` en `productService.js` concatena query sin encodear

```js
// ❌ Puede fallar con espacios o caracteres especiales
http.get("products/search?q=" + query)

// ✅ Usar URLSearchParams
http.get("products/search", { params: { q: query } })
```

---

### 18. Carpeta `ecommerce-app/src/styles/` está vacía

Existe `src/styles/.gitkeep` pero no hay archivos CSS globales allí. Definir variables CSS globales (colores, tipografía, espaciado) para reducir dependencia exclusiva de Tailwind/CVA inline.

---

## 🟢 BAJO — Mejoras de Experiencia y Mantenimiento

### 19. Tipado con JSDoc o migración a TypeScript

El proyecto no tiene tipos. Al menos agregar JSDoc en los servicios y modelos:
```js
/**
 * @param {string} id
 * @returns {Promise<Product>}
 */
export async function getProductById(id) { ... }
```

---

### 20. Agregar tests unitarios al backend

No hay ningún test en `ecommerce-api`. Recomendado:
- **Jest** + **Supertest** para controllers.
- Mocks de Mongoose con `jest-mock-extended`.

---

### 21. Variables de entorno en el frontend

La URL base `http://localhost:4000/api/` está hardcodeada en `http.js`. Usar:

```js
const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:4000/api/";
```

Y definir en `.env.local`:
```
REACT_APP_API_URL=http://localhost:4000/api/
```

---

### 22. `getProductsByCategory` en `productService.js` carga TODOS los productos

```js
// ❌ Ineficiente — trae todos los productos y filtra en cliente
export const getProductsByCategory = async (categoryId) => {
  return fetchProducts().then(data =>
    data.filter(product => product.category?._id === categoryId)
  );
};

// ✅ Usar el endpoint correcto del backend
export const getProductsByCategory = (categoryId) =>
  http.get(`products/category/${categoryId}`).then(r => r.data);
```

---

### 23. Manejo de error 401/403 global en Axios

Si los interceptores de `http.js` detectan un 401, deben redirigir a `/login` automáticamente:

```js
http.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      logout();
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);
```

---

### 24. Eliminar `console.log` de producción

`Home.jsx` (línea 21) tiene `console.log(productsData)` sin guard. Todos los `console.log` de depuración deben eliminarse o condicionarse con `process.env.NODE_ENV === 'development'`.

---

### 25. `BannerCarousel` y `List` sin documentación de props

Agregar `PropTypes` o JSDoc para facilitar el onboarding de nuevos desarrolladores.

---

## Resumen por Prioridad

| Prioridad | # Items | Área |
|---|---|---|
| 🔴 Crítico | 5 | Bugs que causan errores en runtime |
| 🟠 Alto | 6 | Integración API, seguridad, deuda técnica |
| 🟡 Medio | 7 | Robustez, validaciones, performance |
| 🟢 Bajo | 7 | DX, mantenimiento, buenas prácticas |

**Orden de implementación sugerido:**
1. Fixes críticos (#1–#5) — pueden resolverse en 1–2 horas.
2. Integración real de autenticación (#6) — prerrequisito para el resto de integraciones.
3. Integración del Checkout con la API (#7) — flujo principal del negocio.
4. Migrar servicios mock a API real (#8, #9) — completar la integración.
5. Refresh token + AuthContext (#10, #16) — sesión robusta.
6. Tests y TypeScript (#19, #20) — largo plazo.
