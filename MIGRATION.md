# 🔄 Guía de Migración de Datos - MongoDB

## Problema

MongoDB es **schemaless**, lo que significa que no sincroniza automáticamente los cambios en las entidades como lo haría una base de datos SQL. Cuando cambias los campos en tus entidades TypeORM:

- Los **documentos nuevos** se guardan con los campos actualizados ✅
- Los **documentos existentes** mantienen los campos antiguos ❌

## Soluciones

---

## ✅ **Solución 1: Usar el Script de Migración (Recomendado)**

### Ejecutar el script:

```powershell
npm run migrate
```

Este script:
- ✅ Actualiza roles con el nuevo esquema
- ✅ Actualiza usuarios con el nuevo esquema
- ✅ Elimina campos obsoletos
- ✅ Agrega campos faltantes con valores por defecto
- ✅ Renombra campos antiguos

---

## 🛠️ **Solución 2: Migración Manual con MongoDB Shell**

### 1. Conectar a MongoDB

```bash
# Con Docker
docker exec -it user-service-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin

# O localmente
mongosh -u admin -p admin123 --authenticationDatabase admin
```

### 2. Seleccionar la base de datos

```javascript
use user_service_db
```

### 3. Migrar Roles

```javascript
// Ver roles actuales
db.roles.find().pretty()

// Actualizar todos los roles
db.roles.updateMany(
  {},
  {
    $set: {
      estado: true,
      updatedAt: new Date()
    },
    $unset: {
      name: "",
      description: "",
      permissions: "",
      isActive: ""
    }
  }
)

// Verificar cambios
db.roles.find().pretty()
```

### 4. Migrar Usuarios

```javascript
// Ver usuarios actuales
db.users.find().pretty()

// Actualizar todos los usuarios
db.users.updateMany(
  {},
  {
    $set: {
      activo: true,
      idPaciente: null,
      tokenFcm: null,
      updatedAt: new Date()
    },
    $rename: {
      username: "nombreUsuario",
      password: "contrasena",
      isActive: "activo"
    },
    $unset: {
      email: "",
      firstName: "",
      lastName: "",
      phone: "",
      avatar: "",
      roles: "",
      isEmailVerified: "",
      lastLogin: ""
    }
  }
)

// Verificar cambios
db.users.find().pretty()
```

---

## 🔍 **Solución 3: Verificar y Limpiar Datos Individualmente**

### Ver documentos problemáticos

```javascript
// Ver usuarios con campos antiguos
db.users.find({ email: { $exists: true } }).pretty()
db.users.find({ username: { $exists: true } }).pretty()

// Ver roles con campos antiguos
db.roles.find({ name: { $exists: true } }).pretty()
```

### Actualizar documento específico

```javascript
// Actualizar un usuario específico por ID
db.users.updateOne(
  { _id: ObjectId("673117d91fadf1c22ce6cf5c") },
  {
    $set: {
      nombreUsuario: "usuario_actualizado",
      activo: true
    },
    $unset: {
      email: "",
      username: ""
    }
  }
)
```

---

## 🗑️ **Solución 4: Eliminar y Recrear (Desarrollo)**

**⚠️ CUIDADO: Esto eliminará todos los datos**

```javascript
// Eliminar todas las colecciones
db.users.drop()
db.roles.drop()

// Reiniciar el servicio NestJS
// Los nuevos datos se crearán con el esquema correcto
```

En PowerShell:
```powershell
# Detener el servicio
# Eliminar datos desde MongoDB
docker-compose down -v  # Esto elimina los volúmenes

# Reiniciar
docker-compose up -d
npm run start:dev
```

---

## 🔧 **Solución 5: Migración con Mongoose (Alternativa)**

Si prefieres usar Mongoose en lugar de TypeORM, puedes crear un script:

```javascript
// migrate-mongoose.js
const { MongoClient } = require('mongodb');

const uri = 'mongodb://admin:admin123@localhost:27017/user_service_db?authSource=admin';

async function migrate() {
  const client = new MongoClient(uri);
  
  try {
    await client.connect();
    const db = client.db('user_service_db');
    
    // Migrar roles
    await db.collection('roles').updateMany({}, {
      $set: { estado: true },
      $unset: { name: "", description: "", permissions: "", isActive: "" }
    });
    
    // Migrar usuarios
    await db.collection('users').updateMany({}, {
      $set: { activo: true, idPaciente: null, tokenFcm: null },
      $rename: { username: "nombreUsuario", password: "contrasena" },
      $unset: { email: "", firstName: "", lastName: "" }
    });
    
    console.log('✅ Migración completada');
  } finally {
    await client.close();
  }
}

migrate();
```

Ejecutar:
```powershell
node migrate-mongoose.js
```

---

## 📊 **Verificar la Migración**

### Desde MongoDB Shell

```javascript
// Verificar estructura de usuarios
db.users.findOne()

// Verificar que NO existan campos antiguos
db.users.find({ email: { $exists: true } }).count()
db.users.find({ username: { $exists: true } }).count()

// Verificar estructura de roles
db.roles.findOne()

// Verificar que NO existan campos antiguos
db.roles.find({ name: { $exists: true } }).count()
```

### Desde Mongo Express (Web UI)

1. Abre `http://localhost:8081`
2. Usuario: `admin`, Contraseña: `admin`
3. Navega a `user_service_db`
4. Revisa las colecciones `users` y `roles`

### Desde el Servicio NestJS

```powershell
# Listar usuarios
curl http://localhost:3001/api/v1/users

# Listar roles
curl http://localhost:3001/api/v1/roles
```

---

## 🎯 **Pasos Recomendados**

1. **Hacer backup de la base de datos** (importante!)
   ```bash
   mongodump --uri="mongodb://admin:admin123@localhost:27017/user_service_db?authSource=admin" --out=backup
   ```

2. **Ejecutar el script de migración**
   ```powershell
   npm run migrate
   ```

3. **Verificar los cambios**
   ```javascript
   use user_service_db
   db.users.findOne()
   db.roles.findOne()
   ```

4. **Probar el servicio**
   ```powershell
   npm run start:dev
   ```

5. **Crear nuevos usuarios/roles de prueba**
   ```powershell
   curl -X POST http://localhost:3001/api/v1/roles -H "Content-Type: application/json" -d '{"descripcion":"Admin"}'
   ```

---

## 🔄 **Para Futuras Migraciones**

Cuando cambies el esquema en el futuro:

1. Crea un nuevo script de migración
2. Documenta los cambios
3. Prueba en desarrollo primero
4. Haz backup antes de aplicar en producción
5. Ejecuta la migración
6. Verifica los resultados

---

## 🆘 **Si Algo Sale Mal**

### Restaurar backup

```bash
mongorestore --uri="mongodb://admin:admin123@localhost:27017/user_service_db?authSource=admin" backup/user_service_db
```

### Resetear todo (solo desarrollo)

```powershell
docker-compose down -v
docker-compose up -d
npm run start:dev
```

---

## 📝 **Resumen**

**El problema:** MongoDB no actualiza automáticamente documentos existentes

**La solución más fácil:**
```powershell
npm run migrate
```

**Alternativa rápida:** Usar MongoDB Shell con `updateMany()`

**Para desarrollo:** Eliminar y recrear las colecciones

---

## 💡 **Buenas Prácticas**

- ✅ Siempre hacer backup antes de migrar
- ✅ Probar migraciones en desarrollo primero
- ✅ Documentar cada cambio de esquema
- ✅ Usar valores por defecto apropiados
- ✅ Considerar compatibilidad con versiones anteriores
- ✅ Verificar la migración después de ejecutarla
