# GOVERNANCE.md — Política Operativa y de Documentación

Este documento establece las reglas obligatorias de mantenimiento, creación y archivo de documentación, así como los protocolos para el uso seguro de IA (Vibe Coding) en este proyecto. **Todos los subagentes y desarrolladores humanos deben acatar estas reglas sin excepción.**

## 1. Sistema Operativo Documental

### 1.1 ¿Dónde se crea cada artefacto?
- **Features/Bugs (Specs):** `/docs/specs/[fecha]-[tipo]-[nombre].md`
- **Decisiones Técnicas (ADRs):** `/docs/adrs/[numero]-[titulo].md`
- **Contratos API:** `/docs/contracts/api-reference.md`
- **Testing Plans:** `/docs/test-plans/[frontend|api]-test-plan.md`
- **Workflows SSDLC:** `.agents/workflows/`
- **Roles:** `.agents/roles/`
- **Checklists:** `.agents/checklists/`

### 1.2 Reglas de Modificación
- **¿Quién actualiza?:** El `Docs-Keeper` (o el orquestador si asume la función). Ningún Builder debe modificar un test-plan ni un ADR por su cuenta.
- **¿Cuándo se actualiza?:** Obligatoriamente en la Fase 10 (Cierre de Spec). No se autoriza el merge a `develop` si la documentación técnica no refleja el nuevo estado.
- **¿Qué validación debe pasar?:** Revisión del `Code-Reviewer` y `Anti-Hallucination-Reviewer` para garantizar que la documentación sea empíricamente cierta.

### 1.3 Reglas de Archivamiento (Deprecation Policy)
- **Nunca se borra** documentación técnica sustancial.
- En su lugar: se mueve a `/docs/archive/`, prefijando el nombre con `[YYYY-MM-DD]-[nombre original].md`.
- Y se marca en la cabecera: `> **[ARCHIVADO]**: Este documento ha sido reemplazado por [Link]`.

## 2. Precedencia Documental (Fuente de Verdad)

En caso de contradicción, la prioridad absoluta (de mayor a menor) es:
1. **El Código Fuente (Branch `develop`)**: La última palabra la tiene el código corriendo.
2. **`GOVERNANCE.md` (Este documento)**: Reglas operativas supremas.
3. **`docs/specs/*.md` activos**: Los requerimientos formales recientes aplastan la deuda técnica vieja.
4. **`docs/contracts/api-reference.md`**: El diseño de la API.
5. **`.agents/workflows/*.md`**: Flujos operativos.
6. **Los planes de prueba (`docs/test-plans/`)**.
7. **Documentos en `/docs/archive/` (Ignorar como fuente de verdad)**.

## 3. Protocolos de Expansión

### Protocolo para agregar nuevos Subagentes
1. Crear el `.agents/roles/[nuevo-rol].md` con propósitos, inputs y "Done" claros.
2. Actualizar `.agents/workflows/[flow].md` para incluir dónde interviene.
3. El `Orchestrator` debe poder instanciarlo.

### Protocolo para modificar Workflows
Cualquier modificación al SSDLC requiere documentar la decisión en un `ADR`.

## 4. Vibe Coding & Reglas IA
Con el fin de evitar alucinaciones, la IA operando en este repo debe cumplir estrictamente:

- **Regla 0 - No inventar lo inexistente:** Verificar siempre contra archivos reales (`list_dir`, `view_file`) antes de proponer código o afirmar que algo ya se configuró.
- **Regla 1 - Dependencias:** No proponer instalar ni usar paquetes no verificados en el `package.json` actual.
- **Regla 2 - No mutación silenciosa:** Prohibido cambiar archivos arquitectónicos (como `server.js` o configuraciones core) bajo el pretexto de un "bugfix" sin advertirlo antes.
- **Regla 3 - Cierre con Evidencia:** Nunca marcar un _Spec_ como DONE si la evidencia funcional (logs de test, outputs de CLI) no ha sido verificada.
- **Regla 4 - Borradores Expuestos:** Todo trabajo "en progreso" o "prueba de concepto" debe estar en el Spec o en ramas separadas, jamás mezclado en `develop`.
