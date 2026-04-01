# SPEC: Integración de Frontend a API Real (P0 Backlog Fix)
**Fecha:** 2026-03-24
**Autor:** Orchestrator/Builder AI
**Status:** DRAFT

## 1. Definición del Problema
De acuerdo a la auditoría del proyecto (`BACKLOG_CONSOLIDADO.md`), el Frontend padece de una falsa sensación de integración. Múltiples servicios (`category`, `shipping`, `payment`, `user`) consumen arrays de datos estáticos en JSON locales. Además, el Contexto del Carrito almacena todos los items en `localStorage`, ignorando por completo la infraestructura de backend construida (`/cart`).

## 2. Objetivos Principales
- Remover todos los json mockeados dentro del flujo de `services` en React.
- Mapear peticiones de FrontEnd a los correspondientes Controladores funcionales de Express.
- Persistir la sesión de shopping-cart en MongoDB y recuperar dicho carrito cuando el usuario hace login.

## 3. Modelo STRIDE (Análisis de Amenazas de Alto Nivel)
| Amenaza (STRIDE) | Riesgo en Flujo Anterior | Mitigación en Nuevo Flujo |
| :--- | :--- | :--- |
| **Spoofing** | El `CartContext` confía ciegamente en `localStorage`, alguien podría suplantar estado e inyectar payloads. | Validaremos productos contra base de datos en el controlador unificado de órdenes. |
| **Tampering** | Edición manual de costos en `cartItems` desde el panel de DevTools local. | La fuente de la verdad para el precio devuelto será MongoDB. Modificar el cliente no afectará transacciones reales. |
| **Information Repudiation** | Desconocemos si el usuario preparó su carrito o si cambió de dispositivo. | Se habilita rastreabilidad (`Cart.user`) desde el controlador backend. |

## 4. Diseño Técnico (Frontend-First)

### 4.1 Sustitución de Capa de Datos (Mocks)
Los servicios en `src/services/*.js` se conectarán nativamente a `http.js` exportado (Axios con Interceptors). No hay que alterar los Componentes UI, ya que los componentes consumirán las mismas firmas de las promesas de los servicios.

### 4.2 Arquitectura del Carrito
El `CartContext.jsx` actuará como un caché reactivo:
1. Al montarse, si detecta un `authToken`, debe disparar un `getCart()` en segundo plano e hidratar el state.
2. Al ejecutar `addToCart()`, se actualiza UI optimísticamente e invoca `http.post('/cart')`. En caso de fallo HTTP, se realiza rollback en la UI visual (con notificación de error).
3. Si el usuario no tiene inicio de sesión, el carrito se deshabilitará o forzará redirección. (Para no entrar al scope P3 de "Carts temporales anónimos").

## 5. Casos de Prueba y Criterios de "Done"
- [ ] Eliminar los archivos JSON muertos en `data/` si la UI ya no los referencia.
- [ ] El Frontend no debe lanzar errores 500 al renderizar vistas que antes eran síncronas/mockeadas.
- [ ] Cerrar y re-abrir sesión debe recuperar correctamente los productos del carrito agregados en la sesión pre-desconexión.
