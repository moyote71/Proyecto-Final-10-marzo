---
description: Plantilla para Diseño de Casos de Prueba (QA)
---

# Plan de Pruebas: [Módulo / Feature]

**Fecha:** YYYY-MM-DD  
**Spec Vinculado:** `/docs/specs/[YYYY-MM-DD]-[tipo]-[nombre-corto].md`  
**Autor (Subagente):** QA-Test-Designer  

## Estrategia General
[¿Qué tipo de pruebas se harán? Ej: Cypress para frontend, Jest supertest para endpoints. ¿Se mockeará algo?]

## Casos de Prueba (Test Matrix)

| ID | Tipo | Descripción (Flujo a probar) | Input Principal | Resultado Esperado | Estado |
|---|---|---|---|---|---|
| TC-01 | Happy Path | Login exitoso de usuario admin | Credenciales correctas | Status 200, JWT devuelto, redirección a dashboard | Pendiente |
| TC-02 | Edge Case | Login con password incorrecto | Password vacío o erróneo | Status 401, mensaje seguro (no revela si el usuario existe) | Pendiente |
| TC-03 | Security | Inyección SQL en campo email | `' OR 1=1 --` | Status 400 u 401, no bypass de DB | Pendiente |
| TC-04 | Functional | Token expirado al hacer POST | JWT timestamp antiguo | Status 401, evento de logout automático | Pendiente |

## Instrucciones para el Ejecutor Automático
[Si estos tests se van a programar (como scripts k6 o cypress), deja aquí directrices concretas como selectores `data-testid` requeridos o endpoints de la API involucrados.]

## Requisitos de Evidencia
- Se requieren logs de consola para errores (Status 4xx/5xx).
- Se requiere screenshot de Cypress para el caso crítico TC-01.
