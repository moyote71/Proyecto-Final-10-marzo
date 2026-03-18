# INDEX.md — Índice Maestro de Documentación del Proyecto

El siguiente índice es el punto de partida oficial para cualquier desarrollador, subagente o IA que opere en este repositorio. Presenta la jerarquía canónica de archivos y su propósito. 

**Toda documentación técnica debe converger hacia este árbol.** La jerarquía se respeta a cabalidad por el `Docs-Keeper` tras cada iteración.

---

## 🌳 Árbol Canónico de Documentación

### Gobernanza y Reglas Supremas
*Los estatutos y convenciones obligatorias que rigen todo el desarrollo.*
- [`/docs/GOVERNANCE.md`](./GOVERNANCE.md): Sistema operativo y mantenimiento documental (Quién, Cómo, Cuándo).
- [`/docs/INDEX.md`](./INDEX.md): Este archivo que estás leyendo.

### Sistema de Agentes (SSDLC y Operaciones)
*Definiciones del modelo "Vibe Coding" o de integración con sistemas AI (Ubicados en `.agents/`).*
- `/.agents/orchestrator.md`: Controlador general del desarrollo.
- `/.agents/roles/`: (Spec-writer, Builders, Reviewers, etc.)
- `/.agents/workflows/ssdlc.md`: Workflow principal base del ciclo de vida segura.
- `/.agents/checklists/`: Definiciones de completitud (DoD).
- `/.agents/templates/`: Plantillas para PRs, Casos de Prueba, y Decisiones Técnicas (ADR).

### Especificaciones y Requerimientos
*Requisitos de negocio traducidos a contratos ejecutables por Builders.*
- [`/docs/specs/user-stories.md`](./specs/user-stories.md): Historial de necesidades del cliente y requisitos de alto nivel.
- `/docs/specs/*.md`: Specifications Driven Design. Cada nueva feature o hotfix debe tener su archivo datado aquí antes de programarse.

### Contratos Técnicos (APIs / DB)
*Fuente de verdad de comunicación entre cliente y servidor.*
- [`/docs/contracts/api-reference.md`](./contracts/api-reference.md): (Ex `AGENTS.md`) - Lista de todos los endpoints, status codes, DTOs y requisitos de seguridad.

### Planes de Pruebas (QA)
*Cómo rompemos y validamos el sistema.*
- [`/docs/test-plans/api-test-plan.md`](./test-plans/api-test-plan.md): Matriz de pruebas Supertest/Vitest y de rendimiento de k6 para el Backend.
- [`/docs/test-plans/frontend-test-plan.md`](./test-plans/frontend-test-plan.md): Configuración de flujos End-To-End (Cypress) y testIDs requeridos.

### Operaciones (Runbooks)
*Mantenimiento activo y hojas de ruta para el equipo.*
- [`/docs/runbooks/technical-debt.md`](./runbooks/technical-debt.md): Listado ordenado de deuda técnica P0-P3, pendientes imperativos de arreglar.
- [`/docs/runbooks/active-implementation-plan.md`](./runbooks/active-implementation-plan.md): Rastreo de items completados durante ejecuciones de sprint/fase.

### Revisiones Técnicas y Seguridad
*Logs de evolución del sistema.*
- `/docs/adrs/`: Archivos para Architecture Decision Records (Toda gran decisión de diseño tomada).
- `/docs/threat-models/`: Archivos detallados de modelos tipo STRIDE sobre la arquitectura.

### Archivo Histórico
*Lo que ya no rige, pero guarda conocimiento.*
- [`/docs/archive/2026-03-project-audit.md`](./archive/2026-03-project-audit.md): La auditoría técnica inicial antes de instaurar GOVERNANCE.

---

> _**Para Subagentes:** Si alguna de las descripciones que rigen este índice cambia, asegúrate de hacer un "bump" en este archivo y de reflejar la nueva ruta en la estructura._
