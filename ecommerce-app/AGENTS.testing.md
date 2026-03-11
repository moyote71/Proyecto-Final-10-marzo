# AGENTS.testing.md — Plan de Pruebas E2E `ecommerce-app`

> **Última actualización:** 2026-03-11  
> **Progreso del plan:**
> - [x] Configuración de Cypress
> - [x] Custom Commands
> - [x] `auth.cy.js` — Registro, Login, Logout, ProtectedRoute
> - [x] `products.cy.js` — Listado, Búsqueda, Categoría, Detalle
> - [x] `cart.cy.js` — Agregar, Actualizar, Eliminar, Persistencia
> - [x] `checkout.cy.js` — Flujo completo de 4 fases
> - [x] `wishlist.cy.js` — Agregar/quitar wishlist
> - [x] `theme.cy.js` — Dark/Light mode
> - [x] Tabla de `data-testid` requeridos
> - [x] Integración CI/CD

---

## Índice

1. [Instalación y Configuración](#1-instalación-y-configuración)
2. [Comandos Personalizados](#2-comandos-personalizados)
3. [Suite: Autenticación](#3-suite-autenticación)
4. [Suite: Productos](#4-suite-productos)
5. [Suite: Carrito](#5-suite-carrito)
6. [Suite: Checkout](#6-suite-checkout)
7. [Suite: Wishlist y Tema](#7-suite-wishlist-y-tema)
8. [Tabla de `data-testid` Requeridos](#8-tabla-de-data-testid-requeridos)
9. [Integración CI/CD](#9-integración-cicd)

---

## 1. Instalación y Configuración

```bash
# Desde ecommerce-app/
npm install cypress --save-dev

# Abrir Cypress por primera vez (genera estructura cypress/)
npx cypress open
```

### `cypress.config.js` (raíz de `ecommerce-app/`)

```js
const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    env: {
      apiUrl: 'http://localhost:4000/api',
      adminEmail: 'admin@email.com',
      adminPassword: 'admin123',
      customerEmail: 'cliente@email.com',
      customerPassword: 'cliente123',
    },
  },
});
```

### Estructura de carpetas Cypress

```
ecommerce-app/
└── cypress/
    ├── e2e/
    │   ├── auth.cy.js
    │   ├── products.cy.js
    │   ├── cart.cy.js
    │   ├── checkout.cy.js
    │   ├── wishlist.cy.js
    │   └── theme.cy.js
    ├── fixtures/
    │   ├── user.json
    │   └── product.json
    └── support/
        ├── commands.js
        └── e2e.js
```

### Scripts en `package.json`

```json
{
  "scripts": {
    "cy:open": "cypress open",
    "cy:run": "cypress run",
    "cy:run:headed": "cypress run --headed"
  }
}
```

---

## 2. Comandos Personalizados

### `cypress/support/commands.js`

```js
// Iniciar sesión directamente via localStorage (evita UI de login)
Cypress.Commands.add('loginByMock', (role = 'customer') => {
  const users = {
    admin: { email: 'admin@email.com', displayName: 'Admin', role: 'admin' },
    customer: { email: 'cliente@email.com', displayName: 'Cliente', role: 'customer' },
  };
  const user = users[role];
  // Simula el btoa token del utils/auth.js actual
  const token = btoa(`${user.email}${Date.now()}`);
  cy.window().then((win) => {
    win.localStorage.setItem('authToken', token);
    win.localStorage.setItem('userData', JSON.stringify(user));
  });
});

// Iniciar sesión via API real (cuando el frontend integre el JWT real)
Cypress.Commands.add('loginByApi', (email, password) => {
  cy.request('POST', `${Cypress.env('apiUrl')}/auth/login`, { email, password })
    .then((response) => {
      window.localStorage.setItem('authToken', response.body.token);
      window.localStorage.setItem('userData', JSON.stringify(response.body.user));
    });
});

// Agregar un producto al carrito vía UI
Cypress.Commands.add('addProductToCart', (productId) => {
  cy.visit(`/product/${productId}`);
  cy.get('[data-testid="add-to-cart-btn"]').click();
  cy.get('[data-testid="cart-badge"]').should('not.contain', '0');
});

// Limpiar todo el estado de la app
Cypress.Commands.add('clearAppState', () => {
  cy.clearLocalStorage();
  cy.clearCookies();
});
```

---

## 3. Suite: Autenticación

**Archivo:** `cypress/e2e/auth.cy.js`

```js
describe('Autenticación', () => {
  beforeEach(() => {
    cy.clearAppState();
  });

  // --- LOGIN ---
  context('Login', () => {
    it('debería autenticar a un customer con credenciales válidas', () => {
      cy.visit('/login');
      cy.get('[data-testid="login-email"]').type(Cypress.env('customerEmail'));
      cy.get('[data-testid="login-password"]').type(Cypress.env('customerPassword'));
      cy.get('[data-testid="login-submit"]').click();
      cy.url().should('not.include', '/login');
      cy.get('[data-testid="user-greeting"]').should('contain', 'Cliente');
    });

    it('debería mostrar error con contraseña incorrecta', () => {
      cy.visit('/login');
      cy.get('[data-testid="login-email"]').type(Cypress.env('customerEmail'));
      cy.get('[data-testid="login-password"]').type('wrongpassword');
      cy.get('[data-testid="login-submit"]').click();
      cy.get('[data-testid="login-error"]').should('be.visible');
      cy.url().should('include', '/login');
    });

    it('debería mostrar error con email no registrado', () => {
      cy.visit('/login');
      cy.get('[data-testid="login-email"]').type('noexiste@test.com');
      cy.get('[data-testid="login-password"]').type('cualquiera123');
      cy.get('[data-testid="login-submit"]').click();
      cy.get('[data-testid="login-error"]').should('be.visible');
    });

    it('debería deshabilitar el botón si los campos están vacíos', () => {
      cy.visit('/login');
      cy.get('[data-testid="login-submit"]').should('be.disabled');
    });
  });

  // --- LOGOUT ---
  context('Logout', () => {
    it('debería cerrar sesión y redirigir a login', () => {
      cy.loginByMock('customer');
      cy.visit('/');
      cy.get('[data-testid="user-menu"]').click();
      cy.get('[data-testid="logout-btn"]').click();
      cy.url().should('include', '/login');
      expect(localStorage.getItem('authToken')).to.be.null;
    });
  });

  // --- PROTECTED ROUTES ---
  context('Rutas Protegidas', () => {
    it('debería redirigir a /login si no está autenticado', () => {
      cy.visit('/checkout');
      cy.url().should('include', '/login');
    });

    it('debería redirigir a /login desde /orders sin auth', () => {
      cy.visit('/orders');
      cy.url().should('include', '/login');
    });

    it('debería permitir acceso a /checkout con sesión activa', () => {
      cy.loginByMock('customer');
      // Agregar un item al carrito en localStorage
      cy.window().then((win) => {
        win.localStorage.setItem('cart', JSON.stringify([
          { _id: 'prod1', name: 'Test', price: 100, quantity: 1 }
        ]));
      });
      cy.visit('/checkout');
      cy.url().should('include', '/checkout');
    });
  });
});
```

---

## 4. Suite: Productos

**Archivo:** `cypress/e2e/products.cy.js`

```js
describe('Catálogo de Productos', () => {
  context('Home — Listado', () => {
    it('debería mostrar productos en la página inicial', () => {
      cy.visit('/');
      cy.get('[data-testid="product-card"]').should('have.length.greaterThan', 0);
    });

    it('debería navegar a detalle al hacer click en un producto', () => {
      cy.visit('/');
      cy.get('[data-testid="product-card"]').first().click();
      cy.url().should('match', /\/product\/.+/);
    });
  });

  context('Búsqueda', () => {
    it('debería mostrar resultados al buscar un término', () => {
      cy.visit('/');
      cy.get('[data-testid="search-input"]').type('laptop{enter}');
      cy.url().should('include', '/search');
      cy.get('[data-testid="search-results-list"]').should('exist');
    });

    it('debería mostrar mensaje cuando no hay resultados', () => {
      cy.visit('/search?q=xyznonexistent99');
      cy.get('[data-testid="no-results-msg"]').should('be.visible');
    });
  });

  context('Detalle de Producto', () => {
    it('debería mostrar el nombre, precio e imágenes del producto', () => {
      cy.visit('/');
      cy.get('[data-testid="product-card"]').first().click();
      cy.get('[data-testid="product-name"]').should('not.be.empty');
      cy.get('[data-testid="product-price"]').should('not.be.empty');
      cy.get('[data-testid="product-image"]').should('be.visible');
    });

    it('debería mostrar el botón "Agregar al carrito"', () => {
      cy.visit('/');
      cy.get('[data-testid="product-card"]').first().click();
      cy.get('[data-testid="add-to-cart-btn"]').should('be.visible');
    });
  });

  context('Por Categoría', () => {
    it('debería filtrar productos al seleccionar una categoría', () => {
      cy.visit('/');
      cy.get('[data-testid="nav-category"]').first().click();
      cy.url().should('match', /\/category\/.+/);
      cy.get('[data-testid="product-card"]').should('exist');
    });
  });
});
```

---

## 5. Suite: Carrito

**Archivo:** `cypress/e2e/cart.cy.js`

```js
describe('Carrito de Compras', () => {
  beforeEach(() => {
    cy.clearAppState();
    cy.loginByMock('customer');
  });

  it('debería agregar un producto al carrito desde el detalle', () => {
    cy.visit('/');
    cy.get('[data-testid="product-card"]').first().click();
    cy.get('[data-testid="add-to-cart-btn"]').click();
    cy.get('[data-testid="cart-badge"]').should('contain', '1');
  });

  it('debería actualizar la cantidad en el carrito', () => {
    // Prellenar carrito
    cy.window().then((win) => {
      win.localStorage.setItem('cart', JSON.stringify([
        { _id: 'prod1', name: 'Test Product', price: 200, quantity: 1 }
      ]));
    });
    cy.visit('/cart');
    cy.get('[data-testid="quantity-increase"]').click();
    cy.get('[data-testid="item-quantity"]').should('contain', '2');
    cy.get('[data-testid="cart-total"]').should('contain', '400');
  });

  it('debería eliminar un producto del carrito', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('cart', JSON.stringify([
        { _id: 'prod1', name: 'Test', price: 100, quantity: 1 }
      ]));
    });
    cy.visit('/cart');
    cy.get('[data-testid="remove-item-btn"]').click();
    cy.get('[data-testid="empty-cart-msg"]').should('be.visible');
  });

  it('debería persistir el carrito tras recargar la página', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('cart', JSON.stringify([
        { _id: 'prod1', name: 'Persist Test', price: 150, quantity: 2 }
      ]));
    });
    cy.visit('/cart');
    cy.reload();
    cy.get('[data-testid="cart-item"]').should('have.length', 1);
  });
});
```

---

## 6. Suite: Checkout

**Archivo:** `cypress/e2e/checkout.cy.js`

```js
describe('Flujo de Checkout', () => {
  beforeEach(() => {
    cy.clearAppState();
    cy.loginByMock('customer');
    // Precargar carrito con un item
    cy.window().then((win) => {
      win.localStorage.setItem('cart', JSON.stringify([
        { _id: 'prod1', name: 'Laptop', price: 1500, quantity: 1 }
      ]));
    });
  });

  it('debería redirigir a /cart si el carrito está vacío', () => {
    cy.clearLocalStorage('cart');
    cy.visit('/checkout');
    cy.url().should('include', '/cart');
  });

  it('debería completar el flujo completo de 4 fases', () => {
    cy.visit('/checkout');

    // FASE 1: Dirección de envío
    cy.get('[data-testid="address-step"]').should('be.visible');
    cy.get('[data-testid="address-item-0"]').click();
    cy.get('[data-testid="next-step-btn"]').click();

    // FASE 2: Método de pago
    cy.get('[data-testid="payment-step"]').should('be.visible');
    cy.get('[data-testid="payment-item-0"]').click();
    cy.get('[data-testid="next-step-btn"]').click();

    // FASE 3: Revisión del pedido
    cy.get('[data-testid="order-summary-list"]').should('be.visible');
    cy.get('[data-testid="summary-subtotal"]').should('contain', '1,500');
    cy.get('[data-testid="summary-shipping"]').should('exist');
    cy.get('[data-testid="grand-total"]').should('not.be.empty');
    cy.get('[data-testid="next-step-btn"]').click();

    // FASE 4: Confirmación final
    cy.get('[data-testid="confirm-order-btn"]').should('be.visible');
    cy.get('[data-testid="confirm-order-btn"]').click();

    // Verificar redirección y mensaje de éxito
    cy.url().should('include', '/order-confirmation');
    cy.get('[data-testid="success-message"]').should('be.visible');

    // Verificar que el carrito se limpió
    cy.window().then((win) => {
      const cart = JSON.parse(win.localStorage.getItem('cart') || '[]');
      expect(cart).to.have.length(0);
    });
  });

  it('debería calcular envío gratis para pedidos >= MXN $1,000', () => {
    // El carrito ya tiene $1,500
    cy.visit('/checkout');
    cy.get('[data-testid="address-item-0"]').click();
    cy.get('[data-testid="next-step-btn"]').click();
    cy.get('[data-testid="payment-item-0"]').click();
    cy.get('[data-testid="next-step-btn"]').click();
    cy.get('[data-testid="summary-shipping"]').should('contain', '$0');
  });

  it('debería mostrar costo de envío $350 para pedidos < $1,000', () => {
    cy.window().then((win) => {
      win.localStorage.setItem('cart', JSON.stringify([
        { _id: 'prod2', name: 'Mouse', price: 300, quantity: 1 }
      ]));
    });
    cy.visit('/checkout');
    cy.get('[data-testid="address-item-0"]').click();
    cy.get('[data-testid="next-step-btn"]').click();
    cy.get('[data-testid="payment-item-0"]').click();
    cy.get('[data-testid="next-step-btn"]').click();
    cy.get('[data-testid="summary-shipping"]').should('contain', '350');
  });

  it('debería permitir agregar nueva dirección en el checkout', () => {
    cy.visit('/checkout');
    cy.get('[data-testid="add-address-btn"]').click();
    cy.get('[data-testid="address-form"]').should('be.visible');
    cy.get('[data-testid="address-street"]').type('Calle Falsa 123');
    cy.get('[data-testid="address-city"]').type('Ciudad de México');
    cy.get('[data-testid="address-zip"]').type('06600');
    cy.get('[data-testid="address-form-submit"]').click();
    // La dirección nueva debe aparecer en la lista
    cy.get('[data-testid="address-item-0"]').should('exist');
  });
});
```

---

## 7. Suite: Wishlist y Tema

**Archivo:** `cypress/e2e/wishlist.cy.js`

```js
describe('Wishlist', () => {
  beforeEach(() => {
    cy.clearAppState();
    cy.loginByMock('customer');
  });

  it('debería agregar un producto a la wishlist', () => {
    cy.visit('/');
    cy.get('[data-testid="product-card"]').first().find('[data-testid="wishlist-btn"]').click();
    cy.visit('/wishlist');
    cy.get('[data-testid="wishlist-item"]').should('have.length.greaterThan', 0);
  });

  it('debería quitar un producto de la wishlist', () => {
    cy.visit('/wishlist');
    cy.get('[data-testid="wishlist-remove-btn"]').first().click();
    cy.get('[data-testid="empty-wishlist-msg"]').should('be.visible');
  });
});
```

**Archivo:** `cypress/e2e/theme.cy.js`

```js
describe('Tema Dark/Light', () => {
  beforeEach(() => {
    cy.clearLocalStorage('theme');
  });

  it('debería cambiar al modo oscuro al hacer click en toggle', () => {
    cy.visit('/');
    cy.get('[data-testid="theme-toggle"]').click();
    cy.get('body').should('have.class', 'dark');
    // Verificar persistencia en localStorage
    cy.window().then((win) => {
      expect(win.localStorage.getItem('theme')).to.equal('dark');
    });
  });

  it('debería persistir el tema tras recargar la página', () => {
    cy.window().then((win) => win.localStorage.setItem('theme', 'dark'));
    cy.visit('/');
    cy.get('body').should('have.class', 'dark');
  });

  it('debería volver al modo claro al hacer click de nuevo', () => {
    cy.window().then((win) => win.localStorage.setItem('theme', 'dark'));
    cy.visit('/');
    cy.get('[data-testid="theme-toggle"]').click();
    cy.get('body').should('not.have.class', 'dark');
  });
});
```

---

## 8. Tabla de `data-testid` Requeridos

Para que todos los tests funcionen, estos atributos deben estar presentes en los componentes:

| Componente | Elemento | `data-testid` | Tests que lo usan |
|:---|:---|:---|:---|
| `LoginForm` | Input email | `login-email` | auth.cy.js |
| `LoginForm` | Input password | `login-password` | auth.cy.js |
| `LoginForm` | Botón submit | `login-submit` | auth.cy.js |
| `LoginForm` | Mensaje de error | `login-error` | auth.cy.js |
| `Header` | Menú de usuario | `user-menu` | auth.cy.js |
| `Header` | Badge carrito | `cart-badge` | auth.cy.js, cart.cy.js |
| `Header` | Input búsqueda | `search-input` | products.cy.js |
| `Header` | Toggle de tema | `theme-toggle` | theme.cy.js |
| `Header` | Botón logout | `logout-btn` | auth.cy.js |
| `Header` | Saludo usuario | `user-greeting` | auth.cy.js |
| `Navigation` | Link de categoría | `nav-category` | products.cy.js |
| `ProductCard` | Card de producto | `product-card` | products.cy.js, cart.cy.js |
| `ProductCard` | Botón wishlist | `wishlist-btn` | wishlist.cy.js |
| `ProductDetails` | Nombre del producto | `product-name` | products.cy.js |
| `ProductDetails` | Precio del producto | `product-price` | products.cy.js |
| `ProductDetails` | Imagen del producto | `product-image` | products.cy.js |
| `ProductDetails` | Botón add to cart | `add-to-cart-btn` | products.cy.js, cart.cy.js |
| `CartView` | Item del carrito | `cart-item` | cart.cy.js |
| `CartView` | Botón aumentar qty | `quantity-increase` | cart.cy.js |
| `CartView` | Cantidad del item | `item-quantity` | cart.cy.js |
| `CartView` | Total del carrito | `cart-total` | cart.cy.js |
| `CartView` | Botón eliminar item | `remove-item-btn` | cart.cy.js |
| `CartView` | Mensaje carrito vacío | `empty-cart-msg` | cart.cy.js |
| `Checkout` | Step dirección | `address-step` | checkout.cy.js |
| `Checkout` | Step pago | `payment-step` | checkout.cy.js |
| `Checkout` | Botón siguiente | `next-step-btn` | checkout.cy.js |
| `Checkout` | Botón confirmar | `confirm-order-btn` | checkout.cy.js |
| `Checkout` | Botón nueva dirección | `add-address-btn` | checkout.cy.js |
| `Checkout` | Subtotal resumen | `summary-subtotal` | checkout.cy.js |
| `Checkout` | Envío resumen | `summary-shipping` | checkout.cy.js |
| `Checkout` | Total final | `grand-total` | checkout.cy.js |
| `AddressList` | Item dirección | `address-item-{index}` | checkout.cy.js |
| `AddressForm` | Formulario | `address-form` | checkout.cy.js |
| `AddressForm` | Calle | `address-street` | checkout.cy.js |
| `AddressForm` | Ciudad | `address-city` | checkout.cy.js |
| `AddressForm` | Código postal | `address-zip` | checkout.cy.js |
| `AddressForm` | Submit | `address-form-submit` | checkout.cy.js |
| `PaymentList` | Item pago | `payment-item-{index}` | checkout.cy.js |
| `OrderConfirmation` | Mensaje éxito | `success-message` | checkout.cy.js |
| `SearchResultsList` | Lista resultados | `search-results-list` | products.cy.js |
| `SearchResultsList` | Sin resultados | `no-results-msg` | products.cy.js |
| `WishList` | Item wishlist | `wishlist-item` | wishlist.cy.js |
| `WishList` | Botón eliminar | `wishlist-remove-btn` | wishlist.cy.js |
| `WishList` | Lista vacía | `empty-wishlist-msg` | wishlist.cy.js |

> [!IMPORTANT]
> Para inyectar `data-testid` en componentes comunes, edita `src/components/common/Button/Button.jsx` y `Input/Input.jsx` para que acepten `data-testid` como prop y lo pasen al elemento nativo.

```jsx
// Ejemplo en Button.jsx
const Button = ({ children, 'data-testid': testId, ...props }) => (
  <button data-testid={testId} {...props}>{children}</button>
);
```

---

## 9. Integración CI/CD

### GitHub Actions — `.github/workflows/cypress.yml`

```yaml
name: Cypress E2E Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  cypress-run:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout código
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: ecommerce-app/package-lock.json

      - name: Instalar dependencias del frontend
        run: npm ci
        working-directory: ecommerce-app

      - name: Instalar dependencias de la API
        run: npm ci
        working-directory: ecommerce-api

      - name: Iniciar API en background
        run: npm run dev &
        working-directory: ecommerce-api
        env:
          NODE_ENV: development
          PORT: 4000
          MONGODB_URI: ${{ secrets.MONGODB_URI }}
          JWT_SECRET: ${{ secrets.JWT_SECRET }}

      - name: Iniciar frontend en background
        run: npm start &
        working-directory: ecommerce-app

      - name: Esperar que los servidores estén listos
        run: npx wait-on http://localhost:3000 http://localhost:4000 --timeout 60000

      - name: Ejecutar tests Cypress
        uses: cypress-io/github-action@v6
        with:
          working-directory: ecommerce-app
          browser: chrome
          headed: false

      - name: Subir screenshots de fallos
        uses: actions/upload-artifact@v4
        if: failure()
        with:
          name: cypress-screenshots
          path: ecommerce-app/cypress/screenshots
          retention-days: 7
```
