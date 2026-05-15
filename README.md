# Vendor Service

Microservicio de gestión de proveedores (Vendors). Construido con Node.js, Express y Supabase (PostgreSQL).

## Arquitectura

```
Controller → Service → Repository → Supabase (PostgreSQL)
```

- **Controller**: Maneja request/response HTTP
- **Service**: Validaciones, reglas de negocio, orquestación
- **Repository**: Queries SQL a través de Supabase

## Endpoints

### Internos (requieren autenticación)

| Método | Ruta | Descripción |
|--------|------|-------------|
| POST | `/api/vendors` | Crear proveedor |
| GET | `/api/vendors` | Listar proveedores (filtros: `?status=ACTIVE`) |
| GET | `/api/vendors/:id` | Obtener proveedor por ID |
| PUT | `/api/vendors/:id` | Actualizar proveedor |
| PATCH | `/api/vendors/:id/status` | Cambiar estado del proveedor |
| POST | `/api/vendors/:vendorId/branches` | Crear sucursal |
| GET | `/api/vendors/:vendorId/branches` | Listar sucursales de un proveedor |
| GET | `/api/branches/:id` | Obtener sucursal por ID |
| PUT | `/api/branches/:id` | Actualizar sucursal |
| PATCH | `/api/branches/:id/status` | Cambiar estado de sucursal |
| DELETE | `/api/branches/:id` | Eliminar sucursal |

### Externos (para otros microservicios)

| Método | Ruta | Descripción |
|--------|------|-------------|
| GET | `/api/vendors/:id` | Obtener datos del proveedor |
| GET | `/api/vendors?status=ACTIVE` | Listar proveedores activos |
| GET | `/api/vendors/:id/status` | Obtener solo el estado del proveedor |
| GET | `/api/vendors/:vendorId/branches` | Obtener sucursales de un proveedor |

## Comunicación con auth-service

### 1. Middleware de autenticación (validación de token JWT)

El auth-service expone un endpoint de verificación de token. El vendor-service debe validar cada request interno:

```javascript
// src/middleware/auth.middleware.js
const { httpRequest } = require('../utils/http-client');

async function authMiddleware(req, res, next) {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Token requerido' });
    }

    const { status, data } = await httpRequest(
      `${process.env.AUTH_SERVICE_URL}/api/auth/verify`,
      {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        timeout: 3000,
      }
    );

    if (status !== 200) {
      return res.status(401).json({ success: false, message: 'Token inválido' });
    }

    req.user = data.user; // user_id, role, vendor_id, etc.
    next();
  } catch (error) {
    return res.status(503).json({
      success: false,
      message: 'Servicio de autenticación no disponible',
    });
  }
}
```

### 2. Comunicación service-to-service

Para endpoints externos (entre microservicios), se recomienda usar **API Key interna** en lugar de token JWT de usuario:

```javascript
// Llamada desde otro microservicio al vendor-service
const { httpRequest } = require('../utils/http-client');

async function getVendorStatus(vendorId) {
  const { status, data } = await httpRequest(
    `http://vendor-service:3001/api/vendors/${vendorId}/status`,
    {
      headers: { 'X-Internal-Key': process.env.INTERNAL_API_KEY },
    }
  );
  return data;
}
```

### 3. Flujo de registro (coordinado entre servicios)

1. **vendor-service**: Crea el vendor (`POST /api/vendors`)
2. **vendor-service** (o auth-service): Crea el usuario admin del vendor
3. **auth-service**: Genera JWT y lo retorna al frontend

```
Frontend → auth-service (login) → JWT
Frontend → vendor-service + JWT → auth-service verifica token → vendor-service procesa request
```

### 4. Variables de entorno necesarias

```env
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_KEY=your-supabase-key
PORT=3001
AUTH_SERVICE_URL=http://auth-service:3000
INTERNAL_API_KEY=shared-secret-key-between-services
```

## Estados del Vendor

- `PENDING` - Pendiente de activación
- `ACTIVE` - Activo
- `INACTIVE` - Inactivo
- `SUSPENDED` - Suspendido

## Instalación

```bash
npm install
cp .env.example .env
# configurar variables de entorno
npm run dev
```
