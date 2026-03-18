---
description: Plantilla oficial para Pull Requests
---

## Descripción General
[Qué hace este PR y por qué es necesario, en 2-3 líneas]

## Archivo Spec Vinculado
`/docs/specs/[nombre-del-spec].md`

## Tipo de Cambio
*(Marca con una `x`)*
- [ ] 🚀 Nueva funcionalidad (Feature)
- [ ] 🐛 Corrección de error (Bugfix)
- [ ] ♻️ Refactorización (Sin cambios funcionales)
- [ ] 🔒 Parche de seguridad
- [ ] 📝 Documentación
- [ ] ⚙️ Infraestructura o Configuración

## Criterios de Aceptación (Copar del Spec)
- [ ] CA-1: [Desc] ✅
- [ ] CA-2: [Desc] ✅

## Quality Gates (Subagentes)
*(Debe ser verificado por el ejecutor antes de solicitar Code Review)*
- [ ] **Linting & Formato:** 0 errores.
- [ ] **Tests Unitarios:** Pasan todos los tests locales.
- [ ] **Security (Zero Trust):** Sin dependencias riesgosas, no hay secrets en código.
- [ ] **Vibe Coding Checks:** No se inventaron librerías, todos los archivos importados existen en el disco.

## Notas para el Code Reviewer
[Indica al reviwer si hay algún área que requiera especial atención, posibles deudas técnicas asumidas, o decisiones arquitectónicas raras].

## Evidencias (Screenshots / Logs)
[Pega aquí evidencias de terminal o capturas de UI funcionales comprobando el CA].
