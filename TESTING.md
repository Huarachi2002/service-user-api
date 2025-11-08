# 🧪 Colección de Pruebas - Servicio de Usuario

Esta colección contiene ejemplos de peticiones para probar el servicio.

## Variables

- `BASE_URL`: http://localhost:3001/api/v1

---

## 👥 USUARIOS

### 1. Crear Usuario

```http
POST {{BASE_URL}}/users
Content-Type: application/json

{
  "email": "juan.perez@example.com",
  "username": "juanperez",
  "password": "password123",
  "firstName": "Juan",
  "lastName": "Pérez",
  "phone": "+1234567890",
  "roles": ["user"]
}
```

**Respuesta esperada:** 201 Created

### 2. Listar Todos los Usuarios

```http
GET {{BASE_URL}}/users
```

### 3. Listar Usuarios Activos

```http
GET {{BASE_URL}}/users/active
```

### 4. Obtener Usuario por ID

```http
GET {{BASE_URL}}/users/{userId}
```

### 5. Buscar Usuario por Email

```http
GET {{BASE_URL}}/users/email/juan.perez@example.com
```

### 6. Buscar Usuario por Username

```http
GET {{BASE_URL}}/users/username/juanperez
```

### 7. Verificar si Existe Email

```http
GET {{BASE_URL}}/users/exists/email?email=juan.perez@example.com
```

**Respuesta esperada:**
```json
{ "exists": true }
```

### 8. Verificar si Existe Username

```http
GET {{BASE_URL}}/users/exists/username?username=juanperez
```

### 9. Actualizar Usuario

```http
PATCH {{BASE_URL}}/users/{userId}
Content-Type: application/json

{
  "firstName": "Juan Carlos",
  "phone": "+9876543210"
}
```

### 10. Asignar Roles a Usuario

```http
PATCH {{BASE_URL}}/users/{userId}/roles
Content-Type: application/json

{
  "roles": ["user", "moderator"]
}
```

### 11. Actualizar Último Login

```http
PATCH {{BASE_URL}}/users/{userId}/last-login
```

### 12. Desactivar Usuario (Soft Delete)

```http
DELETE {{BASE_URL}}/users/{userId}
```

### 13. Eliminar Usuario Permanentemente

```http
DELETE {{BASE_URL}}/users/{userId}/permanent
```

---

## 🎭 ROLES

### 1. Crear Rol

```http
POST {{BASE_URL}}/roles
Content-Type: application/json

{
  "name": "editor",
  "description": "Editor de contenido",
  "permissions": ["read", "write", "edit_content"]
}
```

### 2. Listar Todos los Roles

```http
GET {{BASE_URL}}/roles
```

### 3. Listar Roles Activos

```http
GET {{BASE_URL}}/roles/active
```

### 4. Obtener Rol por ID

```http
GET {{BASE_URL}}/roles/{roleId}
```

### 5. Buscar Rol por Nombre

```http
GET {{BASE_URL}}/roles/name/admin
```

### 6. Actualizar Rol

```http
PATCH {{BASE_URL}}/roles/{roleId}
Content-Type: application/json

{
  "description": "Administrador del sistema con todos los permisos",
  "permissions": ["read", "write", "delete", "manage_all"]
}
```

### 7. Desactivar Rol (Soft Delete)

```http
DELETE {{BASE_URL}}/roles/{roleId}
```

### 8. Eliminar Rol Permanentemente

```http
DELETE {{BASE_URL}}/roles/{roleId}/permanent
```

---

## 📊 Casos de Prueba

### Test 1: Registro Completo de Usuario

1. Verificar que el email no existe
2. Verificar que el username no existe
3. Crear el usuario
4. Verificar que se creó correctamente

### Test 2: Validación de Email Duplicado

1. Crear usuario con email `test@example.com`
2. Intentar crear otro usuario con el mismo email
3. Debe retornar error 409 Conflict

### Test 3: Gestión de Roles

1. Crear roles: admin, user, moderator
2. Crear usuario con rol "user"
3. Asignar rol "moderator" adicional
4. Verificar que tiene ambos roles

### Test 4: Actualización de Usuario

1. Crear usuario
2. Actualizar firstName y lastName
3. Verificar cambios
4. Actualizar contraseña
5. Verificar que la contraseña se hasheó

### Test 5: Soft Delete vs Hard Delete

1. Crear usuario
2. Hacer soft delete (DELETE /users/:id)
3. Verificar que isActive = false
4. Hacer hard delete (DELETE /users/:id/permanent)
5. Verificar que ya no existe

---

## 🔧 Usando curl

### Crear Usuario
```bash
curl -X POST http://localhost:3001/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "username": "testuser",
    "password": "password123",
    "firstName": "Test",
    "lastName": "User",
    "roles": ["user"]
  }'
```

### Verificar Email
```bash
curl "http://localhost:3001/api/v1/users/exists/email?email=test@example.com"
```

### Crear Rol
```bash
curl -X POST http://localhost:3001/api/v1/roles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "custom_role",
    "description": "Rol personalizado",
    "permissions": ["read", "write"]
  }'
```

---

## 🧪 Usando Postman / Insomnia

Puedes importar estas peticiones creando un entorno con:
- Variable: `BASE_URL`
- Valor: `http://localhost:3001/api/v1`

---

## ⚠️ Errores Comunes

### 409 Conflict
- Email o username ya existe
- Intentar crear un rol con nombre duplicado

### 404 Not Found
- ID no válido o recurso no existe

### 400 Bad Request
- Datos de entrada inválidos
- Faltan campos requeridos
- Formato de email incorrecto

### 500 Internal Server Error
- Error de conexión con MongoDB
- Error en el servidor
