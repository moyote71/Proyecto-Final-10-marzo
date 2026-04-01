# SPEC: Implementación de Módulos Incompletos P2
**Fecha:** 2026-03-24
**Autor:** Orchestrator/Builder AI
**Status:** DRAFT

## 1. Definición del Problema
Existen tres módulos de alto valor del lado del Backend (WishLists, Reviews, API Exclusiva de Admin) cuyas contrapartes de presentación en React (Frontend) están ausentes (`WishList.jsx` tiene apenas un par de bytes), rotas, o nunca se plantearon en la estructura.

## 2. Objetivos Principales
- Otorgarle al usuario final interfaces fluidas y seguras para marcar productos favoritos y aportar opiniones.
- Dotar al dueño del ecommerce de una vista (`AdminDashboard`) para operar la API de su negocio sin recurrir a llamadas terminales o Postman.

## 3. Modelo STRIDE (Análisis de Amenazas)
| Amenaza | Modulo | Mitigación Nueva |
| :--- | :--- | :--- |
| **Elevation of Privilege** | **Admin Panel** | Verificación en capa backend y Frontend de claims de `role === admin` extraído directamente de fuente confiable (DB y Cookie Token decode). |
| **Spoofing / Repudiation** | **Reviews** | Los ids en creaciones de review surgen del jwt codificado, imposible de falsear el autor desde el Payload body de axios. |
| **Denial of Service** | **WishList** | Prevención de clicks masivos de agregar con `isLoading` flags y debounce desde la UI. |

## 4. Diseño Técnico Angular/Global

### Capas Separadas
- **UI Components:** React encapsulado por responsabilidades.
- **Service Hooks:** Archivos `<Entity>Service.js` en vez de llamadas directas.

### WishList y Mapeo
Para WishList el diseño requiere enlazar mediante un context menor o directamente hooks de react-query un botón intermitente de 🤍 en las Card Lists. Si se oprime `wishlist/add`, pintaremos 💖.

### Reseñas y Validaciones
Solo las órdenes en estado concretado admitirían review, pero ante la falta de esa lógica compleja se optará por el chequeo de "User exists and logged in" = Review admitida, y un limite de 1 por producto por user (manejado por mongoose index u orchestration controller).
