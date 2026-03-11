# Registro de Decisiones Técnicas - Backend QA

## Decisión: Cambio de Testing de Integración a Mocking de Persistencia

### Fecha
2026-02-26

### Contexto
Se intentó implementar pruebas de integración pura utilizando `mongodb-memory-server` para levantar una base de datos real en memoria durante los tests. Sin embargo, el entorno de ejecución (Mac x86_64) arrojó errores sistémicos persistentes (`SIGABRT` y `Unknown system error -88`) al intentar ejecutar los binarios de MongoDB (versiones 7.0, 6.0 y 5.0).

### Decisión
Pivotar la estrategia de testing hacia el uso de **Mocks de Mongoose**. 

### Justificación
1. **Fiabilidad**: Los mocks no dependen de binarios externos ni del sistema operativo, garantizando que los tests pasen consistentemente en cualquier entorno local.
2. **Velocidad**: Los tests mockeados son órdenes de magnitud más rápidos.
3. **Foco**: Permite validar lo más importante en este momento: los controladores, el balanceo de carga, las validaciones y el manejo de errores (Fase 1 completada con éxito).

### Consecuencias
- Los tests no validarán restricciones de base de datos a nivel de motor (ej. índices únicos reales), pero sí validarán la lógica del controlador y las llamadas a los métodos de Mongoose (`create`, `find`, etc.).
- Se utilizará `vi.mock` de Vitest para interceptar las llamadas a los modelos.
