---
name: API Best Practices - RESTful Design & Production Ready
description: Guía para diseñar y desarrollar APIs RESTful profesionales y production-ready. Cubre principios REST, versionado, documentación con Swagger/OpenAPI, seguridad, rate limiting, caching y monitoring.
scope: backend
trigger: cuando se diseñen APIs REST, se mencione API design, RESTful principles, API documentation, o production-ready APIs
tools: view, file_create, str_replace, bash_tool
version: 1.0.0
---

# API Best Practices - RESTful Design & Production Ready

## 🎯 Propósito

Guía para diseñar APIs RESTful profesionales y production-ready. Cubre principios REST, versionado, documentación OpenAPI, seguridad, rate limiting, caching y monitoring.

## 🔧 Cuándo Usar Esta Skill

- Diseñar nuevas APIs REST desde cero
- Refactorizar APIs existentes
- Implementar versionado de APIs
- Documentar APIs con OpenAPI/Swagger
- Configurar rate limiting y throttling
- Implementar caching strategies
- Preparar APIs para producción

## 📚 Principios REST

1. **Client-Server** — Separación de responsabilidades
2. **Stateless** — No se guarda estado del cliente en servidor
3. **Cacheable** — Responses deben indicar si son cacheables
4. **Uniform Interface** — URLs consistentes y predecibles
5. **Layered System** — Cliente no sabe si habla con servidor final

### Niveles de Madurez Richardson

```
Level 0: Single URI, Single Method (RPC)
Level 1: Multiple URIs, Single Method
Level 2: Multiple URIs + HTTP Verbs ← Mínimo aceptable
Level 3: HATEOAS (Hypermedia)
```

## 🎨 Diseño de URLs

```
✅ BIEN — Recursos en plural, sustantivos
GET    /api/v1/users
POST   /api/v1/users
GET    /api/v1/users/123
PUT    /api/v1/users/123
DELETE /api/v1/users/123

✅ BIEN — Relaciones anidadas
GET    /api/v1/users/123/orders
POST   /api/v1/users/123/orders

❌ MAL — Verbos en URLs
GET    /api/v1/getUsers
POST   /api/v1/createUser

✅ BIEN — Query params para filtros, búsqueda, paginación
GET /api/v1/users?role=admin&status=active
GET /api/v1/products?page=2&limit=20&sort=-created_at
GET /api/v1/products?search=laptop&fields=id,name,price
```

## 📊 HTTP Methods y Status Codes

### HTTP Methods

| Método | Uso | Idempotente |
|--------|-----|------------|
| `GET` | Obtener recursos | ✅ |
| `POST` | Crear recurso | ❌ |
| `PUT` | Actualizar completo | ✅ |
| `PATCH` | Actualizar parcial | ✅ |
| `DELETE` | Eliminar recurso | ✅ |

### Status Codes

```
200 OK              — GET, PUT, PATCH exitosos
201 Created         — POST exitoso (incluir Location header)
204 No Content      — DELETE exitoso
400 Bad Request     — Validación falló
401 Unauthorized    — No autenticado
403 Forbidden       — Sin permisos
404 Not Found       — Recurso no existe
409 Conflict        — Email duplicado, conflicto de estado
422 Unprocessable   — Validación de negocio falló
429 Too Many Reqs   — Rate limit excedido
500 Server Error    — Error no manejado
```

### Formato de Responses Consistente

```json
// 200 OK
{
  "id": 123,
  "name": "John Doe",
  "email": "john@example.com",
  "createdAt": "2024-01-01T00:00:00Z"
}

// 400 Bad Request
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Email is required" }
    ]
  }
}

// 404 Not Found
{
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "User not found with id: 999"
  }
}

// 429 Too Many Requests
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Too many requests. Try again in 60 seconds.",
    "retryAfter": 60
  }
}
```

## 📄 Versionado

**URL Path (Recomendado):**
```
GET /api/v1/users
GET /api/v2/users
```

### Breaking vs Non-Breaking Changes

| Non-Breaking ✅ | Breaking ❌ |
|----------------|------------|
| Agregar nuevo endpoint | Cambiar URL de endpoint |
| Agregar campo opcional | Remover campo de response |
| Agregar campo en response | Cambiar tipo de dato |
| Hacer required → optional | Hacer optional → required |

## 📖 Paginación

### Offset-based Pagination

```
GET /api/v1/users?page=2&limit=20

{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 20,
    "total": 150,
    "totalPages": 8,
    "hasNext": true,
    "hasPrevious": true
  },
  "links": {
    "first": "/api/v1/users?page=1&limit=20",
    "prev":  "/api/v1/users?page=1&limit=20",
    "next":  "/api/v1/users?page=3&limit=20",
    "last":  "/api/v1/users?page=8&limit=20"
  }
}
```

### Cursor-based Pagination (grandes datasets)

```
GET /api/v1/posts?cursor=abc123&limit=20

{
  "data": [...],
  "pagination": {
    "nextCursor": "def456",
    "prevCursor": "xyz789",
    "hasNext": true
  }
}
```

## 🔐 Seguridad

### Rate Limiting Headers

```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1641024000

// Al excederse:
HTTP/1.1 429 Too Many Requests
Retry-After: 60
```

### Configuración CORS

```javascript
app.use(cors({
  origin: ['https://app.example.com'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400,
}));
```

### Security Headers

```
Content-Security-Policy: default-src 'self'
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Strict-Transport-Security: max-age=31536000; includeSubDomains
```

### Rate Limiting en Express

```javascript
const rateLimit = require('express-rate-limit');

app.use('/api/', rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: { error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' } },
  headers: true,
}));
```

## 💾 Caching

```
// Cache público 1 hora
Cache-Control: public, max-age=3600

// Sin cache
Cache-Control: no-store, no-cache, must-revalidate

// Cache privado (solo browser)
Cache-Control: private, max-age=300

// ETag para conditional requests
ETag: "33a64df551425fcc55e4d42a148795d9f25f89d4"
```

**Conditional Request:**
```
// Cliente envía:
GET /api/v1/users/123
If-None-Match: "33a64df..."

// Sin cambios → 304 Not Modified (sin body)
// Con cambios  → 200 OK con nuevo ETag
```

## 📝 Documentación OpenAPI/Swagger

```yaml
openapi: 3.0.0
info:
  title: My API
  version: 1.0.0

servers:
  - url: https://api.example.com/v1
    description: Production

paths:
  /users:
    get:
      summary: List all users
      tags: [Users]
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 20 }
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                type: object
                properties:
                  data:
                    type: array
                    items: { $ref: '#/components/schemas/User' }
                  pagination: { $ref: '#/components/schemas/Pagination' }
        '401': { $ref: '#/components/responses/Unauthorized' }
      security: [{ bearerAuth: [] }]

    post:
      summary: Create a new user
      tags: [Users]
      requestBody:
        required: true
        content:
          application/json:
            schema: { $ref: '#/components/schemas/CreateUserRequest' }
      responses:
        '201':
          description: Created
          content:
            application/json:
              schema: { $ref: '#/components/schemas/User' }

components:
  schemas:
    User:
      type: object
      properties:
        id: { type: integer, example: 123 }
        name: { type: string, example: John Doe }
        email: { type: string, format: email }
        createdAt: { type: string, format: date-time }

    CreateUserRequest:
      type: object
      required: [name, email, password]
      properties:
        name: { type: string, minLength: 3, maxLength: 50 }
        email: { type: string, format: email }
        password: { type: string, minLength: 6 }

    Pagination:
      type: object
      properties:
        page: { type: integer }
        limit: { type: integer }
        total: { type: integer }
        totalPages: { type: integer }

  responses:
    Unauthorized:
      description: Unauthorized
      content:
        application/json:
          schema:
            type: object
            properties:
              error:
                type: object
                properties:
                  code: { type: string, example: UNAUTHORIZED }
                  message: { type: string }

  securitySchemes:
    bearerAuth:
      type: http
      scheme: bearer
      bearerFormat: JWT
```

## 📊 Monitoring y Health Check

### Health Check Endpoint

```json
// GET /health
{
  "status": "healthy",
  "version": "1.2.3",
  "timestamp": "2024-01-01T12:00:00Z",
  "checks": {
    "database": "healthy",
    "cache": "healthy",
    "externalApi": "degraded"
  },
  "uptime": 86400
}
```

### Structured Logging

```json
{
  "timestamp": "2024-01-01T12:00:00Z",
  "level": "info",
  "method": "GET",
  "path": "/api/v1/users/123",
  "statusCode": 200,
  "responseTime": 45,
  "userId": 456,
  "ip": "192.168.1.1"
}
```

### Métricas Clave

| Métrica | Descripción |
|---------|-------------|
| Request Rate | Requests por segundo |
| Error Rate | % de 4xx y 5xx |
| Latency | P50, P95, P99 |
| Availability | Uptime % |

## ⚠️ Errores Comunes y Soluciones

| Error | Causa | Solución |
|-------|-------|----------|
| Inconsistent responses | Cada endpoint diferente | Estandarizar formato |
| Verbos en URLs | No seguir REST | Usar recursos + HTTP verbs |
| N+1 queries | Falta eager loading | Optimizar con joins/populate |
| Sin versionado | Breaking changes sin aviso | Implementar /v1/ desde el inicio |
| Sin paginación | Retornar miles de items | Siempre paginar listas |
| Sin rate limiting | Abuso de API | Implementar throttling |

## 📋 Checklist Production-Ready

- [ ] Versionado implementado (`/v1/`)
- [ ] Paginación en endpoints de lista
- [ ] Filtros y ordenamiento
- [ ] Rate limiting configurado
- [ ] Authentication / Authorization
- [ ] CORS configurado correctamente
- [ ] Error handling consistente
- [ ] Logging estructurado (sin secrets/PII)
- [ ] Documentación OpenAPI actualizada
- [ ] Health check endpoint (`/health`)
- [ ] Security headers (Helmet)
- [ ] Input validation completa
- [ ] Load testing realizado

## 🔄 REST vs GraphQL vs gRPC

| Feature | REST | GraphQL | gRPC |
|---------|------|---------|------|
| **Best for** | CRUD apps | Queries complejas | Microservices |
| **Learning curve** | Fácil | Media | Alta |
| **Over/Under-fetching** | Común | No | No |
| **Caching** | Built-in HTTP | Custom | Custom |
| **Browser support** | Nativo | Nativo | No directo |

---

*Versión: 1.0.0 | Scope: backend | Standards: REST Level 2+, OpenAPI 3.0*
