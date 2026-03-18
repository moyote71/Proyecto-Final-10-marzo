---
description: Flujo Principal Operativo para Nuevas Funcionalidades
---

# Workflow: Feature Flow

Este flujo orquesta la interacción entre subagentes para cumplir el SSDLC cuando se solicita desarrollar una Feature nueva en el ecommerce.

## Precondiciones
- El repositorio está en la rama `develop` limpia.
- El Orchestrator recibe el ticket o requerimiento.

## Secuencia de Ejecución

1. **Clasificación y Refinamiento (Fase 1 y 2)**
   - Actor: `Orchestrator` & `Spec-Writer`
   - Acción: `Spec-Writer` recibe el input ambiguo, aplica el modelo STRIDE y redacta como Historia SMART. Se verifica que sea del tamaño adecuado.

2. **Diseño Guiado por Especificación (Fase 3)**
   - Actor: `Spec-Writer`
   - Acción: Genera un archivo en `/docs/specs/YYYY-MM-DD-feature-[nombre].md` detallando UI (si aplica), APIs involucradas, criterios de aceptación (CAs) y controles de seguridad.
   - Guardado: Commit en `develop` y creación de rama `feature/[nombre]`.

3. **Skill Audit y Asignación (Fase 5)**
   - Actor: `Orchestrator`
   - Acción: El orquestador lee los `skills` disponibles e instruye si hace falta crear Helpers (utilities) antes de empezar y asigna a los builders correspondientes.

4. **Implementación Segura (Fase 6)**
   - Actores: `Backend-Builder` y `Frontend-Builder` (pueden ser paralelos o en cascada según la dependencia).
   - Componentes Intermedios: Se invoca al `Anti-Hallucination-Reviewer` implícitamente por el operador local para no insertar dependencias falsas. Todo código IA-generado es validado contra la realidad física del repo.

5. **Aseguramiento y Pruebas (Fases 7 y 8)**
   - Actor: `QA-Test-Designer` & The Builders.
   - Acción: Se corren linters, auditorías `npm audit`, SAST y los Unit/Integration tests escritos durante el desarrollo, más las pruebas funcionales documentadas de los CAs.

6. **Revisión Paritaria (Pull Request - Fase 9)**
   - Actor: `Code-Reviewer` & `Security-Reviewer`
   - Acción: Evalúan el diff de la rama actual contra `develop`. Buscan fallos de calidad, deudas arquitectónicas, secrets harcodeados, XSS/SQLi predecibles.
   - Salida: Aprobación o solicitudes de cambio de vuelta a los Builders.

7. **Cierre y Documentación (Fase 10)**
   - Actor: `Docs-Keeper` & `Orchestrator`
   - Acción: Actualización de READMEs, llenado de "Resultados" y "Deuda Técnica" en el Spec, extracción a backlogs y Merge final a `develop`.

---
*Nota Pedagógica: Si en el desarrollo interviene un alumno, el Orchestrator pausa en la fase de PR para invitar al alumno a cuestionar por qué se tomaron las decisiones (Trade-offs).*
