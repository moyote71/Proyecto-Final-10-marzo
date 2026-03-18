# Historias de Usuario (USER_STORIES.md)

Este documento consolida las historias de usuario necesarias para cerrar la brecha entre el frontend y el backend, y saldar la deuda técnica funcional (P0 a P3).

---

## ÉPICA 1: Seguridad y Autenticación Real

**ID:** US-001  
**Título:** Login con Seguridad Real  
**Como** usuario registrado  
**Quiero** autenticarme mediante mi email y contraseña interactuando con el backend real  
**Para** acceder a mis datos personales de forma segura y proteger mi sesión.

**Criterios de aceptación:**
- El sistema debe llamar a `POST /api/auth/login`.
- Al recibir el JWT, debe guardarse en `localStorage`.
- Todas las peticiones HTTP subsecuentes deben inyectar automáticamente el Bearer token (interceptor).
- El sistema debe decodificar o almacenar el objeto `user` retornado para mostrar el nombre.

**Definición de terminado:** 
- Login falso eliminado; el backend entrega token y datos de usuario correctamente.
- Interceptor Axios funcional.

**Dependencias técnicas:** [API-004], [APP-001], [APP-002]  
**Prioridad:** Crítico (P0)  
**Estado actual:** Implementado (Refactorizado en Fase 5)

---

**ID:** US-002  
**Título:** Protección de Sesión y Expiración  
**Como** usuario autenticado  
**Quiero** que mi sesión se mantenga viva si sigo usando la app, o que me redirija al login si expira  
**Para** no recibir errores incomprensibles ni perder contexto.

**Criterios de aceptación:**
- Si un request falla con código `401`, la app debe intentar usar el `refreshToken` llamando a `/api/auth/refresh`.
- Si el refresh falla, el sistema borra los tokens locales y redirige a `/login`.
- Si el request falla con `403`, mostrar un mensaje de "Acceso denegado".

**Definición de terminado:** 
- Interceptor de respuesta captura el 401 y orquesta el refresco o el cierre de sesión limpio.

**Dependencias técnicas:** [API-013], [APP-009]  
**Prioridad:** Bajo (P3)  
**Estado actual:** No implementado

---

## ÉPICA 2: Persistencia del E-Commerce (Checkout)

**ID:** US-003  
**Título:** Persistencia de Orden en DB  
**Como** cliente  
**Quiero** que mi pedido final se procese en el servidor  
**Para** asegurar inventario y poder consultar mi historial real de compras.

**Criterios de aceptación:**
- El botón "Confirmar y pagar" invoca `POST /api/orders` enviando productos, direcciones y pagos desde el estado global.
- El cálculo de total (subtotal + impuestos + envío) debe coincidir y mostrarse visualmente correcto antes de pagar.
- La orden no debe crearse localmente de forma desconectada.

**Definición de terminado:** 
- Orden guardada en la base de datos MongoDB; redirección a confirmación leyendo el ID devuelto por la API.

**Dependencias técnicas:** [APP-004], [APP-003]  
**Prioridad:** Crítico (P0)  
**Estado actual:** Implementado (Refactorizado en Fase 5)

---

## ÉPICA 3: Migración de Mocks Interfaz a API Real

**ID:** US-004  
**Título:** Catálogo Real de Categorías  
**Como** comprador  
**Quiero** ver las categorías de productos directamente desde la base de datos central  
**Para** que la navegación refleje el stock y la organización actual del negocio.

**Criterios de aceptación:**
- El servicio `categoryService.js` no debe leer JSON locales.
- Debe llamar a `GET /api/categories`.
- Menús y componentes de filtro deben usar la lista devuelta por backend.

**Definición de terminado:** 
- Endpoint llamado en montaje de la aplicación, archivo stub de JSON eliminado.

**Dependencias técnicas:** [APP-005]  
**Prioridad:** Alto (P1)  
**Estado actual:** No implementado

---

**ID:** US-005  
**Título:** Direcciones de Envío Centralizadas  
**Como** cliente autenticado  
**Quiero** seleccionar o agregar direcciones de envío que queden guardadas en mi cuenta  
**Para** no tener que escribirlas nuevamente en compras futuras desde otro dispositivo.

**Criterios de aceptación:**
- Al abrir Checkout o Perfil, recuperar las direcciones llamando a `GET /api/shipping-addresses/user/:userId`.
- Al agregar nueva, invocar `POST /api/shipping-addresses`.
- No usar `shipping-address.json`.

**Definición de terminado:** 
- Servicio de shipping usa operaciones CRUD reales.

**Dependencias técnicas:** [APP-006]  
**Prioridad:** Alto (P1)  
**Estado actual:** No implementado

---

**ID:** US-006  
**Título:** Medios de Pago Centralizados  
**Como** cliente autenticado  
**Quiero** elegir o registrar mis tarjetas o métodos de pago desde el backend  
**Para** lograr una experiencia de pago segura y consistente en todo mi perfil.

**Criterios de aceptación:**
- Recuperar medios de pago guardados usando `GET /api/payment-methods/user/:userId`.
- Creación de nuevo método mediante `POST /api/payment-methods`.
- Integrarlo en el flujo de Checkout (Paso 2).

**Definición de terminado:** 
- Falso almacenamiento json eliminado, se lee la información persistida en DB.

**Dependencias técnicas:** [APP-006]  
**Prioridad:** Alto (P1)  
**Estado actual:** No implementado

---

**ID:** US-007  
**Título:** Detalle de Producto Conectado Directamente  
**Como** comprador  
**Quiero** al abrir un producto que la app busque su información fresca directamente en la base de datos  
**Para** estar seguro de que estoy viendo el precio y el stock actualizado.

**Criterios de aceptación:**
- La vista de detalle de producto no debe buscar en un arreglo precargado (usando timeout mock).
- Debe llamar específicamente a `GET /api/products/:id`.

**Definición de terminado:** 
- `getProductById` en `productService.js` ejecuta `http.get`.

**Dependencias técnicas:** [APP-007]  
**Prioridad:** Medio (P2)  
**Estado actual:** No implementado
