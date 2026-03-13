# PROYECTO: ECOMMERCE-REACT - Auditoría, Diagnóstico y Specs

Este documento consolida el estado actual del proyecto, identifica brechas críticas y establece la hoja de ruta para la normalización y finalización del desarrollo.

---

# 0. Auditoría de documentación existente

## 0.1 Inventario de documentos revisados
1. `README.md` (Raíz): Visión general y stack.
2. `SPEC.md` (Raíz): Especificaciones técnicas generadas por IA (V1.0).
3. `TECHNICAL_DEBT.md` (Raíz): Registro de deudas P0-P3.
4. `IMPLEMENTATION_PLAN.md` (Raíz): Checkpoints de progreso.
5. `ecommerce-api/AGENTS.md`: Guía de referencia de la API.
6. `ecommerce-api/AGENTS.testing.md`: Protocolos de prueba backend.
7. `ecommerce-app/AGENTS.testing.md`: Protocolos de prueba frontend (Cypress).
8. `ecommerce-app/README.md`: Documentación específica de React.

## 0.2 Documentación vigente y aprovechable
- **`TECHNICAL_DEBT.md`**: Es el documento más honesto. Identifica claramente que la seguridad del frontend es falsa y que hay inconsistencias de persistencia.
- **`IMPLEMENTATION_PLAN.md`**: Útil para rastrear qué falta, especialmente en la integración de endpoints.
- **`ecommerce-api/AGENTS.testing.md`**: Define bien qué debería probarse, aunque la implementación de los tests sea parcial.

## 0.3 Documentación desactualizada pero recuperable
- **`SPEC.md`**: Aunque detalla modelos y endpoints, no refleja las correcciones pendientes en `cartRoutes.js` (duplicados) ni los `ReferenceError` detectados por falta del parámetro `next`.
- **`AGENTS.md` (Backend)**: Lista endpoints que el propio `TECHNICAL_DEBT.md` señala como no documentados o mal nombrados (ej. `/cart` vs `/carts`).

## 0.4 Documentación obsoleta o contradictoria
- **`SPEC.md` (Sección Auth Frontend)**: Describe `btoa` como mecanismo de token. Esto es obsoleto desde el momento en que se definió que el backend usaría JWT real.
- **`ecommerce-app/utils/auth.js`**: El código actual documentado es un "puente" falso que debe eliminarse.

## 0.5 Documentación duplicada o redundante
- Existen dos `README.md` con información solapada.
- `SPEC.md` repite mucha información que ya está en `AGENTS.md` del backend. Se recomienda consolidar.

## 0.6 Recomendación por documento
| Documento | Etiqueta | Acción |
|---|---|---|
| `README.md` | Actualizar | Unificar con versión del app y simplificar. |
| `SPEC.md` | Consolidar | Fusionar con el nuevo Spec (Fase 2 de este reporte). |
| `TECHNICAL_DEBT.md` | Conservar | Mantener como log histórico hasta saldar deudas. |
| `IMPLEMENTATION_PLAN.md` | Conservar | Seguir usando para ejecución de tareas. |
| `AGENTS.md` | Actualizar | Corregir rutas y parámetros tras auditoría de código. |

## 0.7 Riesgos de mantener documentación incorrecta
- **Desvío en el desarrollo**: Seguir asumiendo que el carrito es `/carts` cuando es `/cart` llevará a fallos de integración.
- **Falsa sensación de seguridad**: Confiar en el `SPEC.md` respecto al auth podría ocultar la vulnerabilidad crítica del frontend.

## 0.8 Propuesta de estructura documental limpia
1. `/docs/specs.md` (Lo que el sistema es/hace).
2. `/docs/api-guide.md` (Referencia técnica endpoints).
3. `/docs/testing-plan.md` (QA unificado).
4. `BACKLOG.md` (Lo que falta por hacer).

---

# 1. Diagnóstico del proyecto actual

## 1.1 Resumen ejecutivo
El proyecto es una plataforma funcional al 60%. El backend está "técnicamente completo" en términos de rutas, pero con fallos de estabilidad críticos (ReferenceErrors). El frontend es visualmente robusto pero estructuralmente frágil, operando como una isla que simula persistencia mediante `localStorage` y mocks.

## 1.2 Estado del backend
- **Implementado**: 12+ modelos de Mongoose, controladores para casi todo el flujo ecommerce.
- **Parcial**: Rutas de `users`, `reviews`, `wishlist` están creadas pero no montadas en el router principal (`routes/index.js`).
- **Crítico**: Al menos 15 métodos en controladores fallarán en tiempo de ejecución por no declarar el parámetro `next` usado en los `catch`.

## 1.3 Estado del frontend
- **Implementado**: UI completa (Home, Cart, Checkout, Login, Profile) con React 19 y Tailwind.
- **Parcial**: Integración de productos (lee de API real).
- **Hipótesis**: Los componentes asumen datos en formatos que el backend aún no entrega (ej. el backend no devuelve `user` en el login).

## 1.4 Estado de persistencia de datos
- **Usa localStorage**: Carrito, Autenticación (Fake JWT), Direcciones de envío, Órdenes, Wishlist, Tema.
- **Usa Base de Datos**: Solo Productos (Lectura).
- **Desalineado**: El flujo de Checkout es 100% local; el servidor nunca se entera de las compras.

## 1.5 Flujos funcionales detectados
1. **Navegación**: Operativa.
2. **Carrito**: Operativo localmente.
3. **Checkout**: Simulado (guarda en localStorage).
4. **Auth**: Simulado (credenciales hardcodeadas).

## 1.6 Riesgos técnicos y funcionales
- **Pérdida de datos**: Al no persistir órdenes en DB, cualquier limpieza de caché borra el historial del negocio.
- **Seguridad**: JWT falso permite bypass total de "protección" de rutas.

## 1.7 Supuestos e hipótesis pendientes de validar
- ¿El backend soporte el cálculo de impuestos/envío o el frontend debe enviarlo ya calculado?
- ¿Existen scripts de carga de datos iniciales (`seed`) completos para todas las colecciones? (Se detectó carpeta `seed` pero no se verificó contenido).

---

# 2. Spec del proyecto

## 2.1 Descripción general del sistema
Plataforma de comercio electrónico B2C que permite a los usuarios navegar productos, gestionar un carrito de compras y realizar pedidos. Incluye un panel básico de perfil y gestión de direcciones/pagos.

## 2.2 Objetivo del producto
Proveer una experiencia de compra fluida y moderna, asegurando la consistencia entre la interfaz de usuario y la persistencia en el servidor.

## 2.3 Problema que resuelve
Centraliza la gestión de inventario y pedidos en una base de datos distribuida, eliminando la dependencia de almacenamiento local volátil.

## 2.4 Alcance actual
- Navegación de productos desde API real.
- Gestión de carrito en memoria/local.
- UI completa para Checkout y Perfil.
- Backend con modelos robustos y validaciones.

## 2.5 Alcance objetivo
- Integración 100% de persistencia (Cart, Orders, Addresses, Payments) con el Backend.
- Seguridad de grado industrial con JWT real y roles.
- Sincronización de estado global del frontend con el backend.

## 2.6 Módulos del sistema

### Módulo: Autenticación
- **Propósito**: Gestión de sesiones y roles.
- **Estado actual**: Simulado en frontend (btoa). Implementado en backend (JWT).
- **Gaps**: Frontend no envía credenciales al backend; el backend no incluye el objeto `user` en el login.

### Módulo: Carrito
- **Propósito**: Almacenamiento temporal de intención de compra.
- **Estado actual**: 100% localStorage. Backend tiene rutas pero no se usan.
- **Gaps**: El carrito se pierde al cambiar de navegador/dispositivo; falta sync inicial.

### Módulo: Checkout y Órdenes
- **Propósito**: Conversión y registro de compras.
- **Estado actual**: Frontend guarda en local. Backend valida stock y crea órdenes correctamente.
- **Gaps**: El frontend no llama al endpoint `POST /api/orders`. Riesgo de inconsistencia de stock (el frontend no sabe si el stock se agotó hasta que intenta pagar, pero ni siquiera intenta).

## 2.7 Arquitectura funcional actual
- **Flujo de datos**: Mayoritariamente unidireccional (Server -> UI para productos) o local (UI -> LocalStorage).
- **Fuente de verdad**: Fragmentada (DB para productos, LocalStorage para el resto).

## 2.8 Arquitectura técnica actual
- **Frontend**: React 19, Context API para estado global (Cart, Theme). Axios para HTTP.
- **Backend**: Express 5 (Alpha/Beta features), Mongoose.
- **Persistencia**: Híbrido inconsistente.

## 2.9 Inconsistencias detectadas
- **JWT**: El backend espera un Bearer Token real; el frontend genera uno falso.
- **Total de Orden**: `Checkout.jsx` accede a `total`, pero `CartContext` solo provee `getTotalPrice()`. El total siempre es `undefined` visualmente.
- **Rutas API**: El backend usa `/cart`, el frontend y algunas docs asumen `/carts`.

## 2.10 Reglas funcionales del sistema
- Envío gratuito a partir de $1000 MXN.
- Tasa de IVA fija al 16%.
- Cancelación de órdenes solo disponible para el administrador o antes del envío.

## 2.11 Reglas técnicas del sistema
- Validación estricta de IDs de MongoDB (ObjectId).
- Respuestas estandarizadas con códigos de error 400, 401, 403, 404, 500.

## 2.12 Deuda técnica identificada
- Falta de interceptores de Axios para inyectar tokens.
- Rutas de backend (`wishlist`, `reviews`) creadas pero no expuestas.
- Falta de validación de propiedad en órdenes (un usuario puede ver órdenes de otros si sabe el ID).

## 2.13 Riesgos
- **Seguridad**: Bypass fácil de rutas protegidas.
- **Consistencia**: Un usuario puede comprar algo que ya no tiene stock porque el frontend no valida antes del paso final.

## 2.14 Recomendaciones de normalización
1. **Unificación de Auth**: Migrar `utils/auth.js` para usar el endpoint real y habilitar el interceptor de token.
2. **Migración de Cart**: Implementar un efecto en `CartProvider` que sincronice con la DB si el usuario está autenticado.
3. **Validación de Checkout**: Reemplazar el guardado local por una llamada a `POST /api/orders`.

## 2.15 Propuesta de documentación final
- `ARCHITECTURE.md`
- `API_REFERENCE.md` (Corregida y testeada)
- `DEBT_LOG.md`
- `USER_MANUAL.md`

---

# 3. Backlog estructurado

## 3.1 Épicas
1. **Persistencia e Integración**: Sincronizar frontend y backend.
2. **Seguridad y Perfiles**: Blindar auth y gestión de usuarios.
3. **Calidad y Pruebas**: Asegurar estabilidad (Cypress/Vitest).

## 3.2 Backlog Priorizado

| Item | Tarea | Prioridad | Clasificación |
|---|---|---|---|
| 001 | Corregir `authMiddleware` (Status 401 no 403) | Crítico | Bug / Seguridad |
| 002 | Implementar Interceptor de Auth en Axios | Crítico | Alineación F/B |
| 003 | Integrar Login real en Frontend | Crítico | Feature faltante |
| 004 | Integrar `POST /api/orders` en Checkout | Crítico | Feature faltante |
| 005 | Corregir bug `total` en Checkout UI | Alto | Bug |
| 006 | Eliminar código duplicado en `cartRoutes.js` | Medio | Refactor |
| 007 | Migrar Categorías y Direcciones a API real | Medio | Deuda técnica |
| 008 | Implementar `data-testid` para Cypress | Bajo | Documentación / QA |

---

# 4. Historias de usuario

**ID:** US-001  
**Título:** Login con Seguridad Real  
**Como** usuario registrado  
**Quiero** autenticarme mediante mi email y contraseña  
**Para** acceder a mis datos personales y que mis compras queden registradas a mi nombre.

**Criterios de aceptación:**
- El sistema debe llamar a `POST /api/auth/login`.
- Al recibir el JWT, debe guardarse en `localStorage`.
- Si el token expira, el sistema debe redirigir a `/login`.

**ID:** US-002  
**Título:** Persistencia de Orden en DB  
**Como** cliente  
**Quiero** que mi pedido se guarde en el servidor  
**Para** poder consultar mi historial de compras en cualquier momento.

**Criterios de aceptación:**
- El botón "Confirmar y pagar" debe llamar a `POST /api/orders`.
- La orden no debe crearse si el backend devuelve error de stock.

---

# 5. Plan de limpieza documental

## 5.1 Documentos a conservar
- `TECHNICAL_DEBT.md` (Como referencia de progreso).
- `IMPLEMENTATION_PLAN.md` (Actualizado).

## 5.2 Documentos a actualizar
- `README.md`: Eliminar advertencias de "estado incompleto" conforme se cierren items.
- `AGENTS.md`: Reflejar rutas reales (`/cart` vs `/carts`).

## 5.3 Documentos a eliminar
- Folder `ecommerce-api/scr`: Es un error tipográfico, debe borrarse tras asegurar que no hay archivos únicos (solo tiene `models` vacío).
- Notas sueltas redundantes.

## 5.4 Orden recomendado
1. Consolidar este Spec como fuente única de verdad.
2. Limpiar `ecommerce-api/scr`.
3. Actualizar `AGENTS.md` con las rutas corregidas.

