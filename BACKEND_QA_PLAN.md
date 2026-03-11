# Backend QA Plan: ECOMMERCE-REACT

> **Responsable**: QA Senior AI  
> **Estado**: Propuesta Inicial  
> **Fecha**: 2026-02-26

---

## 1. Objetivos del Plan

Garantizar la integridad, seguridad y fiabilidad del backend mediante una pirámide de pruebas automatizadas, corrigiendo las deficiencias críticas detectadas en la fase de análisis inicial.

1. **Bug-Free Core**: Eliminar errores de runtime (como el fallo de `next`) antes de la entrega.
2. **Integridad de Datos**: Validar que los modelos de Mongoose y las rutas cumplan con las reglas de negocio.
3. **Seguridad**: Verificar que la autenticación JWT y los roles (Admin/User) funcionen correctamente.
4. **Escalabilidad**: Asegurar que nuevos cambios no rompan funcionalidades existentes (Regression Testing).

---

## 2. Estrategia y Niveles de Prueba

### A. Pruebas Unitarias (Unit Testing)
- **Foco**: Controladores y Middlewares en aislamiento.
- **Herramientas**: Jest + Mocks.
- **Alcance**: 
  - Lógica de transformación de datos.
  - Generación de JWT y hashing de contraseñas.
  - Middlewares de validación de `express-validator`.

### B. Pruebas de Integración (Integration Testing)
- **Foco**: Ciclos de vida completos de la API.
- **Herramientas**: Jest + Supertest + MongoDB Memory Server.
- **Alcance**:
  - Persistencia real en una base de datos in-memory.
  - Flujos de Auth (Register -> Login -> Private Route).
  - Flujo de Órdenes (Creación -> Validación de Stock -> Cálculo de Total).

### C. Pruebas de Seguridad (Security Testing)
- **Alcance**:
  - Acceso denegado a rutas `/admin` para usuarios sin rol apropiado.
  - Expiración de tokens JWT.
  - Inyección de datos inválidos en campos de búsqueda.

---

## 3. Matriz de Pruebas (Test Matrix)

| Módulo | Escenario | Tipo | Resultado Esperado | Prioridad |
|---|---|---|---|---|
| **Auth** | Registro con email duplicado | Integración | 400 Bad Request: "User already exist" | 🔴 Crítico |
| **Auth** | Login con contraseña incorrecta | Unitario | 400 Bad Request: "Invalid credentials" | 🔴 Crítico |
| **Auth** | Registro satisfactorio y hash de password | Integración | 201 Created + Pass no legible en DB | 🔴 Crítico |
| **Middleware** | Acceso a ruta privada sin Token | Integración | 401 Unauthorized | 🔴 Crítico |
| **Middleware** | Cliente intentando crear producto | Integración | 403 Forbidden (Admin only) | 🟠 Alta |
| **Products** | Búsqueda por rango de precio (min/max) | Integración | 200 OK + Productos dentro del rango | 🟠 Alta |
| **Products** | Crear producto con campos faltantes | Integración | 422 Unprocessable Entity (Validation) | 🟠 Alta |
| **Orders** | Crear pedido y calcular IVA + Envío | Integración | 201 Created + TotalPrice consistente | 🔴 Crítico |
| **Orders** | Cancelar orden ya entregada | Unitario | 400 Bad Request (Regla de negocio) | 🟡 Media |
| **Cart** | Agregar producto a carrito inexistente | Integración | 200 OK + Se crea nuevo carrito | 🟠 Alta |
| **Error Handling** | Error forzado en controlador | Unitario | 500 OK + Log en `error.log` (Fix `next`) | 🔴 Crítico |

---

## 4. Stack de Herramientas y Configuración

| Herramienta | Propósito |
|---|---|
| **Jest** | Test Runner y aserciones. |
| **Supertest** | Simulación de peticiones HTTP sin levantar el servidor real. |
| **MongoDB Memory Server** | Base de datos MongoDB real en RAM para evitar ruidos entre tests. |
| **Bcryptjs** | (Opcional) si bcrypt nativo da problemas en entornos de CI. |

### Pasos de Implementación Técnica:
1. **Fix de Infraestructura**: Incluir el parámetro `next` en todos los controladores.
2. **Setup**: Instalar dependencias y crear `test/setup.js`.
3. **Mocks**: Crear un mock factory para JWT y perfiles de usuario.
4. **CI/CD**: Configurar script de `npm test` para que falle el build si los tests no pasan.

---

## 5. Plan de Ejecución

1. **Fase 1 (Limpieza)**: Resolver `ReferenceError: next is not defined` en el código fuente.
2. **Fase 2 (Cimientos)**: Implementar tests de integración para `authRoutes`.
3. **Fase 3 (Lógica)**: Implementar tests unitarios para cálculo de órdenes y validación de stock.
4. **Fase 4 (Cobertura)**: Alcanzar un mínimo de **80% de cobertura** en lógica de negocio.

---

## 6. Próximos Pasos Recomendados

> [!IMPORTANT]
> Se recomienda empezar por la corrección del middleware de error y los controladores, ya que actualmente cualquier fallo en los tests dispararía un error de runtime que ocultaría la verdadera causa del fallo (root cause).
