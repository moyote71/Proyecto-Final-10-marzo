# Guía de Pruebas Backend con Vitest - Soluciones Mac

Esta guía detalla la infraestructura de pruebas para `ecommerce-api`, diseñada para asegurar la integridad de la lógica de negocio sin depender de una base de datos real.

## 1. Configuración del Entorno

El proyecto utiliza **Vitest** y **Supertest** para pruebas de integración rápidas y confiables.

### Scripts Disponibles (`package.json`)
```bash
# Ejecutar todos los tests
npm test

# Interfaz visual de Vitest
npm run test:ui

# Reporte de cobertura de código
npm run test:coverage
```

### Configuración Global (`vitest.config.js`)
Define el timeout de hooks y el archivo de setup global:
```javascript
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: ['./src/tests/setup.js'],
    hookTimeout: 30000,
  },
});
```

---

## 2. Estrategia de Mocks (Mongoose Infrastructure)

Debido a restricciones de binarios en algunos entornos, utilizamos **Mocks Avanzados** en lugar de `mongodb-memory-server`.

### El Patrón `exec()`
Mongoose utiliza encadenamiento de métodos (ej: `find().populate().sort()`). Para probar esto, nuestro mock en `src/tests/setup.js` devuelve objetos que simulan este comportamiento:

```javascript
// Ejemplo de uso en un test
Product.find().exec.mockResolvedValue([mockProduct]);
```

> [!TIP]
> Si el controlador usa `await Model.find()`, el mock automáticamente resuelve la promesa a través de su implementación de `.then()`.

---

## 3. Guía de Pruebas de Integración

### Autenticación (`auth.test.js`)
Verifica el flujo de JWT y validación de usuarios.
- **Registro**: Valida duplicados y formato de campos (422/400).
- **Login**: Verifica contraseñas con bcrypt mockeado (200/400).

### Inventario y Órdenes (`order.test.js`)
Prueba la lógica más compleja: el descuento de stock atómico.
- **Éxito**: Crea la orden y simula el descuento de stock.
- **Fallo**: Retorna 400 si el stock mockeado es insuficiente.

---

## 4. Matriz de API Endpoints Verificados

| Módulo | Endpoint | Método | Status | Lógica Clave |
| :--- | :--- | :--- | :--- | :--- |
| **Auth** | `/api/auth/register` | `POST` | 201 | Encriptación y validación |
| **Auth** | `/api/auth/login` | `POST` | 200 | Generación de JWT |
| **Products**| `/api/products` | `GET` | 200 | Paginación de resultados |
| **Products**| `/api/products/search`| `GET` | 200 | Filtros dinámicos |
| **Orders** | `/api/orders` | `POST` | 201 | Reserva de stock y auth |

---
**Nota**: Todos los tests inyectan automáticamente el entorno `NODE_ENV=test`, lo que deshabilita middlewares intrusivos como el rate limiter en `app.js`.
