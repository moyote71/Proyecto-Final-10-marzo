---
description: Definition of Done - Frontend
---

# Definition of Done: Frontend (React)

Antes de considerar una tarea en el frontend (UI) como terminada y pasarla a PR, el Frontend-Builder debe cumplir estos estatutos:

## Obligatorio: Funcionalidad
- [ ] La UI cumple 100% con los Criterios de Aceptación del Spec asociados.
- [ ] La app compila y levanta localmente sin warnings ni errores de React/Vite en consola.
- [ ] Navegación funciona correctamente (sin renders innecesarios / ciclos infinitos en `useEffect`).

## Obligatorio: UI/UX & Código Limpio
- [ ] Se reutilizaron componentes del Design System existente si aplicaba.
- [ ] No hay código CSS "inline" hackeado; se usó Tailwind o las clases globales correctas.
- [ ] El responsive web design funciona (móvil y desktop).
- [ ] Accesibilidad mínima (alt tags en imágenes, botones con aria-labels si carecen de texto).
- [ ] No quedaron remanentes de "Vibe Coding" sucio: no hay `console.log("here")`, ni `TODO: arreglar esto después` sin ticket asignado.

## Obligatorio: Integración API
- [ ] El manejo de errores API (loaders y fallos 4xx/5xx) está contemplado en la UI (feedback visual al usuario).
- [ ] Las llamadas a la API usan las rutas y variables de entorno correctas, sin IP's quemadas (`localhost`).

## Obligatorio: Verificaciones Automáticas
- [ ] Linter ejecutado sin errores: `npm run lint`.
- [ ] Pruebas unitarias de frontend (si existen) pasan exitosamente.
