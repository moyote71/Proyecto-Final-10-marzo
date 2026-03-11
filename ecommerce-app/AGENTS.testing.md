# Guía de Pruebas E2E con Cypress - Soluciones Mac

Esta guía detalla la configuración, comandos y flujos de prueba para asegurar la calidad del frontend utilizando Cypress.

## 1. Instalación y Configuración

Cypress no está instalado actualmente. Para comenzar, ejecuta los siguientes comandos en la raíz de `ecommerce-app/`:

```bash
# Instalar Cypress como dependencia de desarrollo
npm install cypress --save-dev

# Abrir Cypress por primera vez para generar la estructura básica
npx cypress open
```

### Configuración Inicial (`cypress.config.js`)
Crea este archivo en la raíz del proyecto para definir la URL base:

```javascript
const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    viewportWidth: 1280,
    viewportHeight: 720,
  },
});
```

---

## 2. Comandos Personalizados (`cypress/support/commands.js`)

Añade estos comandos para simplificar las pruebas y evitar repetición de código UI.

### Iniciar Sesión por API
Permite saltar el formulario de login en pruebas que no sean de autenticación.

```javascript
Cypress.Commands.add('loginByApi', (email, password) => {
  cy.request('POST', 'http://localhost:5000/api/auth/login', {
    email,
    password
  }).then((response) => {
    window.localStorage.setItem('authToken', response.body.token);
    window.localStorage.setItem('userData', JSON.stringify(response.body.user));
  });
});
```

### Añadir Producto al Carrito
```javascript
Cypress.Commands.add('addProductToCart', (productId) => {
  cy.visit(`/product/${productId}`);
  cy.get('[data-testid="add-to-cart-btn"]').click();
  cy.get('[data-testid="cart-badge"]').should('not.contain', '0');
});
```

---

## 3. Flujos de Prueba Automatizados

### Registro de Usuario
> [!IMPORTANT]
> Actualmente el registro se maneja vía menú en el Header. Se recomienda crear una página `/register`.

```javascript
describe('Flujo de Registro', () => {
  it('debería permitir crear una cuenta nueva', () => {
    cy.visit('/login');
    cy.get('[data-testid="go-to-register"]').click(); // Botón sugerido
    cy.get('[data-testid="reg-name"]').type('Nuevo Usuario');
    cy.get('[data-testid="reg-email"]').type('nuevo@test.com');
    cy.get('[data-testid="reg-password"]').type('Pass123!');
    cy.get('[data-testid="reg-submit"]').click();
    cy.url().should('eq', Cypress.config().baseUrl + '/');
    cy.get('[data-testid="user-menu"]').should('contain', 'Nuevo');
  });
});
```

### Login Completo
```javascript
describe('Flujo de Login', () => {
  it('debería autenticar un usuario cliente', () => {
    cy.visit('/login');
    cy.get('[data-testid="login-email"]').type('cliente@email.com');
    cy.get('[data-testid="login-password"]').type('cliente123');
    cy.get('[data-testid="login-submit"]').click();
    cy.url().should('not.include', '/login');
    cy.get('[data-testid="user-greeting"]').should('contain', 'Hola, Cliente');
  });
});
```

### Checkout (Flujo de 4 Fases)
```javascript
describe('Flujo de Checkout', () => {
  beforeEach(() => {
    cy.loginByApi('cliente@email.com', 'cliente123');
    cy.addProductToCart('some-product-id');
    cy.visit('/checkout');
  });

  it('debería completar las 4 fases del pedido', () => {
    // Fase 1: Dirección de Envío
    cy.get('[data-testid="address-step"]').click();
    cy.get('[data-testid="address-item-0"]').click(); // Seleccionar primera
    
    // Fase 2: Método de Pago
    cy.get('[data-testid="payment-step"]').click();
    cy.get('[data-testid="payment-item-0"]').click();

    // Fase 3: Revisión del Pedido
    cy.get('[data-testid="order-summary-list"]').should('be.visible');
    cy.get('[data-testid="grand-total"]').should('not.be.empty');

    // Fase 4: Confirmación Final
    cy.get('[data-testid="confirm-order-btn"]').click();
    cy.url().should('include', '/order-confirmation');
    cy.get('[data-testid="success-message"]').should('be.visible');
  });
});
```

---

## 4. Matriz de `data-testid` Requeridos

Para que estos tests funcionen, se deben añadir los siguientes atributos a los componentes:

| Componente | Elemento | `data-testid` |
| :--- | :--- | :--- |
| `LoginForm` | Input Email | `login-email` |
| `LoginForm` | Input Password | `login-password` |
| `LoginForm` | Botón Submit | `login-submit` |
| `ProductDetails`| Botón Comprar | `add-to-cart-btn` |
| `Header` | Badge Carrito | `cart-badge` |
| `Checkout` | Botón Confirmar | `confirm-order-btn` |
| `Checkout` | Total Final | `grand-total` |
| `AddressList` | Item Dirección | `address-item-{index}` |

---
**Nota**: Para implementar estos IDs, edita `src/components/common/Input/Input.jsx` y `Button.jsx` para que acepten el prop `dataTestId` y lo inyecten en el elemento nativo.
