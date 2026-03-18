---
description: Checklist Obligatorio para Pull Requests
---

# PR Checklist (Para Revisores y Builders)

Todo PR debe ser revisado contra esta lista **antes** del merge a `develop`.

## 1. Verificación del Subagente Implementador (Builder)
- [ ] Comprobé que mi código compila y funciona localmente.
- [ ] Llené toda la plantilla del PR (`.agents/templates/pr-template.md`).
- [ ] Adjunté evidencia (logs, pantallazos) probando el "Happy Path".
- [ ] Verifiqué el DoD correspondiente (Frontend o Backend).
- [ ] Revisé mi propio diff en Github CLI/UI para asegurar que no hay archivos basura.

## 2. Verificación del Code-Reviewer
- [ ] El código resuelve el requerimiento del Spec asignado (ni más, ni menos).
- [ ] La arquitectura es consistente (los controladores controlan, los servicios tienen lógica, los componentes de UI son tontos).
- [ ] El código es legible y los nombres de variables/funciones son auto-descriptivos.
- [ ] Evaluados los performance tradeoffs (no hay N+1 queries feos, no hay re-renders masivos).

## 3. Verificación de Security-Reviewer
- [ ] No hay credenciales quemadas en el diff.
- [ ] Todas las rutas protegidas tienen su middleware de Auth.
- [ ] Todas las variables de entorno nuevas fueron documentadas en `.env.example`.

## 4. Verificación de Docs-Keeper / Orchestrator
- [ ] El documento Spec original fue actualizado en su sección "Resultados".
- [ ] Toda nueva deuda técnica detectada en el PR se formalizó como un ticket nuevo en el backlog.
- [ ] Si se cambió un endpoint, se actualizó la colección de Postman / README.
