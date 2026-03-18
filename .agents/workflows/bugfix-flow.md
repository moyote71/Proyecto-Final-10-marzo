---
description: Flujo Operativo para Corrección de Bugs
---

# Workflow: Bugfix Flow

Este flujo orquesta la interacción entre subagentes para resolver bugs de manera estructurada y preventiva, asegurando que el error no vuelva a ocurrir.

## Precondiciones
- El bug ha sido reportado con pasos de reproducción claros o logs evidenciables.
- El repositorio está en la rama `develop` limpia.

## Secuencia de Ejecución

1. **Reproducción y Aislamiento (Fase 1 y 2)**
   - Actores: `QA-Test-Designer` & `Orchestrator`
   - Acción: `QA` intenta reproducir el bug localmente o mediante un test que falla (Test Driven Bugfixing). Si no se puede reproducir, se devuelve al usuario pidiendo más info.
   - Guardado: Se redacta el ticket/historia indicando el Expect vs Actual behavior.

2. **Diagnóstico y Spec Correctivo (Fase 3)**
   - Actor: `Spec-Writer`
   - Acción: Redacta un Spec corto (`/docs/specs/YYYY-MM-DD-bugfix-[nombre].md`) que describe la causa raíz, la mitigación propuesta y el nuevo Criterio de Aceptación (el fix del test previo). No se toca código aún.

3. **Implementación del Fix (Fases 4 a 6)**
   - Actor: `Backend-Builder` o `Frontend-Builder` (según donde esté el bug)
   - Acción: Crea rama `bugfix/[nombre]`, implementa la solución y se asegura de que el test rojo ahora esté verde.
   - Seguridad: `Anti-Hallucination-Reviewer` verifica que el parche no asuma datos o contextos que no existen.

4. **Verificación Estricta (Fase 7 y 8)**
   - Actor: `QA-Test-Designer`
   - Acción: Ejecuta toda la suite de tests (regression testing) para asegurar que el parche no rompió otras áreas del sistema.

5. **Revisión Paritaria (Fase 9)**
   - Actor: `Code-Reviewer`
   - Acción: Revisa que la corrección no sea un "parche sucio" o hardcoding, sino una solución sistémica.

6. **Cierre de Deuda y Documentación (Fase 10)**
   - Actor: `Docs-Keeper`
   - Acción: Si el bug fue causado por una mala configuración o malentendido arquitectónico, actualiza los Docs o crea un ADR preventivo. Cierra el Spec como `DONE`. Mergea a `develop`.
