<<<<<<< HEAD
# ECOMMERCE-REACT

Plataforma de comercio electrónico full-stack construida con **React 19** en el frontend y **Node.js + Express 5 + MongoDB** en el backend.

## 📁 Estructura del Monorepo

```
ECOMMERCE-REACT/
├── ecommerce-api/    # Backend: Express 5 + Mongoose + JWT
├── ecommerce-app/    # Frontend: React 19 + React Router v7
├── SPEC.md           # Especificaciones técnicas completas
└── IMPROVEMENTS.md   # Mejoras propuestas y bugs conocidos
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

- **[SPEC.md](./SPEC.md)** — Especificaciones técnicas completas: modelos, endpoints, flujos de autenticación, estructura de directorios.
- **[IMPROVEMENTS.md](./IMPROVEMENTS.md)** — Bugs conocidos y mejoras propuestas ordenadas por prioridad.
- **[ecommerce-app/AGENTS.md](./ecommerce-app/AGENTS.md)** — Guía para agentes de IA que trabajan en el frontend.
- **[ecommerce-app/AGENTS.testing.md](./ecommerce-app/AGENTS.testing.md)** — Tests E2E con Cypress.

## 🔑 Rutas Principales de la API

| Módulo | Base Path |
|---|---|
| Autenticación | `POST /api/auth/register` \| `POST /api/auth/login` |
| Productos | `GET /api/products` \| `GET /api/products/search` |
| Órdenes | `GET/POST /api/orders` |
| Carrito | `GET/POST /api/carts` |

Ver [SPEC.md](./SPEC.md) para la lista completa de endpoints.

## ⚠️ Estado Actual

El proyecto está en desarrollo activo. El frontend aún usa algunos datos mock (JSON locales) en lugar de la API real. Ver [IMPROVEMENTS.md](./IMPROVEMENTS.md) para la lista de bugs conocidos y el plan de integración completa.
=======
# Proyecto-Final
>>>>>>> 1ab86ff6579cc8e3eb48056b9b2f54617f94923b
