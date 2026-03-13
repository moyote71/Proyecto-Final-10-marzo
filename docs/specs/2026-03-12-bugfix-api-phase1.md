# Spec: API Phase 1 Cleanup and Bugfixes

## Metadata
- **Tipo:** bugfix
- **Complejidad:** S
- **Fecha:** 2026-03-12
- **Estado:** DRAFT

## Historia
**S**pecífica: Se resolverán los tickets API-001 (authMiddleware), API-002 (.env refresh token), API-009 (cartRoutes.js duplicates) y API-010 (authRoutes.js duplicates).
**M**edible: La API no arrancará sin `REFRESH_TOKEN_SECRET` y no habrá rutas duplicadas en consola.
**A**lcanzable: Son cambios contenidos en 3 archivos.
**R**elevante: Preparación necesaria para la integración segura del frontend y corrección de deuda técnica crítica.
**T**emporal: Complejidad S, se resuelve en una sola sesión de trabajo.

## Contexto
El backlog consolidado y documentado en `IMPLEMENTATION_PLAN.md` prioriza una serie de correcciones críticas de deuda técnica sobre el backend antes de integrarlo con el frontend. Estas deudas incluyen errores HTTP lógicos en middleware de autenticación, faltas de controles de seguridad en configuración de entorno, y definición redundante/duplicada de endpoints en el router de carrito y autenticación.

## Criterios de Aceptación
- [ ] CA-1: `authMiddleware.js` ya devuelve 401 para peticiones no autorizadas (ticket API-001, verificado previamente).
- [ ] CA-2: El proceso de Node (`app.js`) lanza un error síncrono si la variable de entorno `REFRESH_TOKEN_SECRET` no está configurada, impidiendo el arranque inseguro (ticket API-002).
- [ ] CA-3: El archivo `cartRoutes.js` ya no contiene las definiciones duplicadas para `update-item`, `remove-item` y `clear` (ticket API-009).
- [ ] CA-4: El archivo `authRoutes.js` ya no tiene rutas duplicadas (ticket API-010).

## Consideraciones de Seguridad
- Amenazas STRIDE identificadas:
  - **Spoofing** (si no se controla bien el refresh token secret o los errores 401).
- Controles de mitigación:
  - Validación fuerte en la inicialización (fail securely) de secretos `REFRESH_TOKEN_SECRET`.
  - Códigos HTTP semánticamente correctos para prevenir información confusa (ticket API-001).
- Inputs que requieren validación: Ninguno en este spec.
- Secrets involucrados: `REFRESH_TOKEN_SECRET`.
- Superficie de ataque afectada: La inicialización principal del app.

## Dependencias
- Internas: `.env`, `authMiddleware`, `app.js`.
- Externas: Ninguna adicional.

## Decisiones de Diseño
- **Fail Securely:** En lugar de dejar a la app arrancar y fallar durante la petición de re-emisión de token, se verificará que `REFRESH_TOKEN_SECRET` (junto con `JWT_SECRET`) esté definido tan pronto como arranque Node (`app.js`), interrumpiendo tempranamente con error explícito.

## Riesgos y Deuda Técnica
- Si `.env` no tiene estas llaves en desarrollo local, los developers tendrán una caída dura al hacer `npm run dev`. Se mitiga asegurándose de documentarlo, y agregándolo a `.env.example`.

## Pendientes Abiertos y Gaps Detectados
- Funcionalidades faltantes: 
- Comportamientos inconsistentes detectados: 
- Gaps entre frontend y backend: 
- Persistencia pendiente de migrar: 
- Decisiones aplazadas: 
- Trabajo fuera de alcance en esta iteración: 
- Riesgos que requieren seguimiento: 
- Items que deben convertirse en backlog: 

## Resultados (se completa al cerrar)
- Fecha de cierre:
- CAs cumplidos:
- CAs no cumplidos:
- Deuda técnica generada:
- Lecciones aprendidas:
- Pendientes abiertos confirmados:
- Gaps no resueltos:
- Trabajo fuera de alcance confirmado:
- Backlog derivado creado:
- Referencias a historias/tareas creadas:

## Matriz de cierre
| Item detectado | Estado | Acción |
|---|---|---|
| Implementado | Confirmado | Cerrar |
