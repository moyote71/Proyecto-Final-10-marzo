# SPEC: Mejoras de Arquitectura y Seguridad (P1 Backlog Fix)
**Fecha:** 2026-03-24
**Autor:** Orchestrator/Builder AI
**Status:** DRAFT

## 1. Definición del Problema
De acuerdo a la auditoría del proyecto (`BACKLOG_CONSOLIDADO.md`), existen debilidades estructurales que comprometen la madurez de la aplicación:
A. Falta de un esquema OpenAPI auto-documentado.
B. Caching client-side primitivo, re-inventado con session variables.
C. Almacenamiento crítico de JWT en `localStorage`.

## 2. Objetivos Principales
- Instalar y configurar `swagger-ui-express`.
- Migrar de autenticación localStorage-JWT a **Cookies HTTP-Only**.
- Reemplazar funciones impuras `productService.js` (mutaciones offline de memoria) por peticiones de bajo nivel cacheadas asíncronamente vía **TanStack Query**.

## 3. Modelo STRIDE (Análisis de Amenazas de Alto Nivel)
| Amenaza | Riesgo Anterior | Mitigación Nueva |
| :--- | :--- | :--- |
| **Tampering & Information Disclosure** | El JWT y UserData eran visibles localmente y accesibles vía XSS-Payloads maliciosos. | HTTP-Only prohíbe el acceso del Objeto de Browser local (`document.cookie` block). |
| **Denial of Service** | Sobrecarga al backend y repetición manual de fetches sin invalidación de caché apropiado. | TanStack define el `staleTime` global para reutilizar queries sin abrumar nodos de origen Express. |

## 4. Diseño Técnico

### 4.1 Sessión de Seguridad (Cookies)
Backend enviará `res.cookie('token', token)` y limpiará cookie en método logout.
Frontend Axios habilitará `config.withCredentials = true`. Adios intercepciones engorrosas de Token.

### 4.2 Documentación API
`swagger-jsdoc` analizará los comentarios multi-línea `/** @openapi */` sobre `src/routes/`. Se optará por documentar las rutas P0 y P1 primero.

## 5. Casos de Prueba y Criterios de "Done"
- [ ] Endpoint `/api/docs` operativo y navegable.
- [ ] Inicio de Sesión / Cerrado de Sesión exitosos confirmando uso exclusivo de Cookies en Request Header.
- [ ] No hay llamadas REST duplicadas en Frontend gracias a React Query.
