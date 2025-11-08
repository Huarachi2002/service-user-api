# Guía de Configuración - Servicio de Usuario

## 📋 Requisitos Previos

- Node.js 18+ 
- npm o yarn
- MongoDB 6+ (local o Docker)
- Git

## 🔧 Pasos de Instalación

### 1. Clonar e Instalar Dependencias

```bash
# Navegar al proyecto
cd service-user

# Instalar dependencias
npm install
```

### 2. Configurar MongoDB

#### Opción A: Usar Docker (Recomendado)

```bash
# Iniciar MongoDB con Docker Compose
docker-compose up -d

# Verificar que esté corriendo
docker-compose ps
```

Esto iniciará:
- **MongoDB** en puerto `27017`
- **Mongo Express** (interfaz web) en `http://localhost:8081`
  - Usuario: `admin`
  - Contraseña: `admin`

#### Opción B: MongoDB Local

Si tienes MongoDB instalado localmente:

```bash
# Iniciar MongoDB
mongod --dbpath /path/to/data

# O con servicio del sistema
sudo systemctl start mongodb
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env` basado en `.env.example`:

```bash
# En Windows PowerShell
Copy-Item .env.example .env

# En Linux/Mac
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales:

```env
# DATABASE CONFIGURATION
DB_TYPE=mongodb
DB_HOST=localhost
DB_PORT=27017
DB_USERNAME=admin
DB_PASSWORD=admin123
DB_DATABASE=user_service_db

# APPLICATION CONFIGURATION
PORT=3001
NODE_ENV=development

# API GATEWAY CONFIGURATION
API_GATEWAY_URL=http://localhost:3000
```

### 4. Ejecutar el Servicio

```bash
# Modo desarrollo (con hot-reload)
npm run start:dev

# Modo producción
npm run build
npm run start:prod
```

### 5. Verificar que Funciona

El servicio debería estar corriendo en `http://localhost:3001/api/v1`

```bash
# Probar endpoint
curl http://localhost:3001/api/v1/users

# O abrir en el navegador
http://localhost:3001/api/v1/users
```

## 🌱 Datos Iniciales (Seed)

Para crear roles y usuarios de prueba, puedes usar el script de seed:

1. Asegúrate de que el servicio esté corriendo
2. El seed se ejecutará automáticamente en el primer inicio

O manualmente con MongoDB:

```javascript
// Conectar a MongoDB
mongosh

// Usar la base de datos
use user_service_db

// Crear rol admin
db.roles.insertOne({
  name: "admin",
  description: "Administrador del sistema",
  permissions: ["read", "write", "delete", "manage_users", "manage_roles"],
  isActive: true,
  createdAt: new Date(),
  updatedAt: new Date()
})

// Crear usuario admin (contraseña: admin123 hasheada)
db.users.insertOne({
  email: "admin@example.com",
  username: "admin",
  password: "$2b$10$K7L1qJ1V8J8V8J8V8J8V8uXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx",
  firstName: "Admin",
  lastName: "System",
  roles: ["admin"],
  isActive: true,
  isEmailVerified: true,
  createdAt: new Date(),
  updatedAt: new Date()
})
```

## 🧪 Probar el Servicio

### Crear un Usuario

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

### Listar Usuarios

```bash
curl http://localhost:3001/api/v1/users
```

### Crear un Rol

```bash
curl -X POST http://localhost:3001/api/v1/roles \
  -H "Content-Type: application/json" \
  -d '{
    "name": "moderator",
    "description": "Moderador de contenido",
    "permissions": ["read", "write", "moderate"]
  }'
```

## 🔍 Herramientas de Monitoreo

### Mongo Express (Web UI)

Si usaste Docker Compose, puedes acceder a Mongo Express:

- URL: `http://localhost:8081`
- Usuario: `admin`
- Contraseña: `admin`

### MongoDB Compass (Desktop App)

Conecta con:
```
mongodb://admin:admin123@localhost:27017/user_service_db?authSource=admin
```

## 🐛 Solución de Problemas

### Error: Cannot connect to MongoDB

1. Verifica que MongoDB esté corriendo:
   ```bash
   docker-compose ps
   ```

2. Verifica las credenciales en `.env`

3. Verifica el puerto:
   ```bash
   netstat -an | findstr 27017
   ```

### Error: Port 3001 already in use

Cambia el puerto en `.env`:
```env
PORT=3002
```

### Error: Module not found

Reinstala dependencias:
```bash
rm -rf node_modules package-lock.json
npm install
```

## 📚 Siguiente Paso: Integración con API Gateway

Para integrar con tu API Gateway:

1. Configura la URL del API Gateway en `.env`
2. El API Gateway debería poder hacer peticiones a:
   - `http://localhost:3001/api/v1/users`
   - `http://localhost:3001/api/v1/roles`

3. Desde el API Gateway podrás:
   - Verificar si existe un usuario antes de registrar
   - Obtener información de roles para autorización
   - Validar credenciales
   - Actualizar último login

## 🔐 Seguridad

**⚠️ IMPORTANTE para Producción:**

1. Cambia las credenciales de MongoDB
2. Usa variables de entorno seguras
3. Desactiva `synchronize: true` en producción
4. Implementa rate limiting
5. Usa HTTPS
6. Implementa autenticación entre microservicios (JWT interno)

## 📖 Recursos Adicionales

- [Documentación de NestJS](https://docs.nestjs.com/)
- [TypeORM con MongoDB](https://typeorm.io/mongodb)
- [Validación con class-validator](https://github.com/typestack/class-validator)
- Ver `TESTING.md` para ejemplos de peticiones HTTP
