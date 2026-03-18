---
description: Definition of Done - Backend
---

# Definition of Done: Backend (Node.js/Express)

Antes de considerar una tarea en el backend (API/DB) como terminada y pasarla a PR, el Backend-Builder debe cumplir estos estatutos:

## Obligatorio: Funcionalidad y Contratos
- [ ] La API cumple 100% con los Criterios de Aceptación del Spec asociados.
- [ ] El endpoint/servicio obedece el contrato de Request/Response especificado (nombres de campos y status codes exactos).
- [ ] La aplicación compila y levanta localmente. Los endpoints responden a `curl` o Postman.

## Obligatorio: Seguridad (Zero Trust)
- [ ] Ningún IDOR posible: Se validó que el recurso pertenece al usuario que hace la petición (si aplica).
- [ ] Todo input externo fue validado y sanitizado antes de tocar la base de datos o lógica de negocio.
- [ ] No se están retornando passwords (ni hasheados) ni PII confidencial innecesaria en las respuestas de la API.
- [ ] No hay secrets (API_KEYs, JWT_SECRET, URIs) hardcodeados en el código. Se usa `process.env`.
- [ ] Manejo de errores seguro: Los `try/catch` envían un status 500 genérico al cliente y ocultan el stacktrace interno.

## Obligatorio: Integridad de Base de Datos
- [ ] Mongoose Schemas o migraciones no rompen compatibilidad hacia atrás o se hizo script de migración.
- [ ] Queries pesados tienen su índice (index) correspondiente.

## Obligatorio: Verificaciones Automáticas
- [ ] Linter ejecutado sin errores.
- [ ] Unit Tests creados y ejecutados exitosamente (`npm run test:unit`).
- [ ] No hay `console.log` de debug en el código a commitear.
