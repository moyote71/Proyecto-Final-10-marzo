# ECOMMERCE-REACT

Plataforma de comercio electrónico full-stack construida con **React 19** en el frontend y **Node.js + Express 5 + MongoDB** en el backend.

## 📁 Estructura del Monorepo

```
ECOMMERCE-REACT/
├── ecommerce-api/             # Backend: Express 5 + Mongoose + JWT
├── ecommerce-app/             # Frontend: React 19 + React Router v7
├── PROJECT_AUDIT_AND_SPECS.md # Especificaciones y diagnóstico completo
├── TECHNICAL_DEBT.md          # Deuda técnica priorizada y pendientes
└── IMPLEMENTATION_PLAN.md     # Checkpoints de progreso
```

## 🚀 Inicio Rápido

### Backend (Puerto 4000)

```bash
cd ecommerce-api
npm install

# Crear archivo de entorno
cp .env.example .env   # o crear manualmente con las variables requeridas

npm run dev            # Inicia con nodemon
```

**Variables de entorno requeridas (`.env`):**
```
PORT=4000
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=ecommerce
JWT_SECRET=tu_secreto_super_seguro
```

### Frontend (Puerto 3000)

```bash
cd ecommerce-app
npm install
npm start
```

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Frontend UI | React 19, React Router v7 |
| Estilos | Tailwind CSS, CVA (class-variance-authority) |
| Animaciones | Framer Motion |
| HTTP Client | Axios |
| Backend | Express 5, Node.js |
| Base de datos | MongoDB + Mongoose |
| Autenticación | JWT + bcrypt |
| Validación | express-validator |

## 📋 Documentación

### Backend (`ecommerce-api/`)
- **[AGENTS.md](./ecommerce-api/AGENTS.md)** — Guía completa de la API: endpoints, autenticación JWT, modelos de datos, manejo de errores y reglas para agentes IA.
- **[AGENTS.testing.md](./ecommerce-api/AGENTS.testing.md)** — Plan de pruebas de la API: requests/responses, pruebas de seguridad (JWT, roles, injection, rate limit) y scripts de rendimiento k6.

### Frontend (`ecommerce-app/`)
- **[AGENTS.testing.md](./ecommerce-app/AGENTS.testing.md)** — Plan de pruebas E2E con Cypress: 6 suites (auth, products, cart, checkout, wishlist, theme), tabla de `data-testid` e integración CI/CD.

### General
- **[PROJECT_AUDIT_AND_SPECS.md](./PROJECT_AUDIT_AND_SPECS.md)** — Diagnóstico, arquitectura y especificaciones completas.
- **[USER_STORIES.md](./USER_STORIES.md)** — Historias de usuario extraídas del backlog.
- **[TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md)** — Deuda técnica priorizada (P0–P3) y roadmap hacia el despliegue.
- **[IMPLEMENTATION_PLAN.md](./IMPLEMENTATION_PLAN.md)** — Plan de implementación con checkboxes de progreso (Fase 1→4).

## 🧪 Pruebas de Rendimiento

Scripts k6 en `ecommerce-api/scripts/`:

```bash
brew install k6
k6 run ecommerce-api/scripts/load-test.js    # Carga sostenida (20 VUs)
k6 run ecommerce-api/scripts/stress-test.js  # Estrés (hasta 200 VUs)
```

## 🔑 Rutas Principales de la API

| Módulo | Base Path |
|---|---|
| Autenticación | `POST /api/auth/register` \| `POST /api/auth/login` |
| Productos | `GET /api/products` \| `GET /api/products/search` |
| Órdenes | `GET/POST /api/orders` |
| Carrito | `GET/POST /api/cart` |

Ver [PROJECT_AUDIT_AND_SPECS.md](./PROJECT_AUDIT_AND_SPECS.md) y `AGENTS.md` para la lista completa de endpoints.

## ⚠️ Estado Actual

El proyecto está en desarrollo activo enfocado en saldar la deuda técnica. El frontend aún usa datos locales o lógica mockeada de autenticación y carrito temporalmente. Ver **[TECHNICAL_DEBT.md](./TECHNICAL_DEBT.md)** y **[PROJECT_AUDIT_AND_SPECS.md](./PROJECT_AUDIT_AND_SPECS.md)** para la lista de integraciones requeridas.
