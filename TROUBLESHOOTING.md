# 🔍 Diagnóstico del Problema de Sincronización

## ¿Por qué no veo los cambios en MongoDB?

### 🎯 **Razón Principal: MongoDB es Schema-less**

A diferencia de SQL, MongoDB NO sincroniza esquemas automáticamente. TypeORM con `synchronize: true` funciona diferente en MongoDB:

**En SQL (MySQL, PostgreSQL):**
- ✅ `synchronize: true` crea/modifica tablas automáticamente
- ✅ Agrega columnas nuevas
- ✅ Modifica tipos de datos

**En MongoDB:**
- ❌ `synchronize: true` NO hace nada especial
- ❌ NO actualiza documentos existentes
- ✅ Solo valida que las colecciones existan

---

## 🔄 **Cómo Funciona en MongoDB**

```
Antes (documentos antiguos):
{
  _id: ObjectId("..."),
  email: "test@example.com",        ❌ Campo antiguo
  username: "testuser",              ❌ Campo antiguo  
  password: "hash...",               ❌ Campo antiguo
  firstName: "Test",                 ❌ Campo antiguo
  roles: ["user"]                    ❌ Campo antiguo
}

Después de cambiar la entidad:
{
  _id: ObjectId("..."),
  email: "test@example.com",        ❌ Sigue existiendo!
  username: "testuser",              ❌ Sigue existiendo!
  nombreUsuario: undefined,          ❌ NO se crea automáticamente
  contrasena: undefined,             ❌ NO se crea automáticamente
  rol: undefined                     ❌ NO se crea automáticamente
}

Nuevo documento creado:
{
  _id: ObjectId("..."),
  nombreUsuario: "nuevo",           ✅ Campo nuevo
  contrasena: "hash...",             ✅ Campo nuevo
  rol: { descripcion: "Admin" },     ✅ Campo nuevo
  activo: true,                      ✅ Campo nuevo
  idPaciente: null                   ✅ Campo nuevo
}
```

---

## 🛠️ **Pasos para Solucionar**

### **Paso 1: Verificar si tienes datos**

```powershell
# Desde PowerShell
docker exec -it user-service-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
```

Luego en MongoDB Shell:
```javascript
use user_service_db

// Ver cuántos documentos hay
db.users.countDocuments()
db.roles.countDocuments()

// Ver los documentos
db.users.find().pretty()
db.roles.find().pretty()
```

---

### **Paso 2A: Si NO hay datos (base de datos vacía)**

Simplemente crea nuevos datos y ya tendrán la estructura correcta:

```powershell
# Crear un rol
curl -X POST http://localhost:3001/api/v1/roles `
  -H "Content-Type: application/json" `
  -d '{\"descripcion\":\"Administrador\"}'

# Crear un usuario
curl -X POST http://localhost:3001/api/v1/users `
  -H "Content-Type: application/json" `
  -d '{\"nombreUsuario\":\"admin\",\"contrasena\":\"admin123\",\"idRol\":\"ID_DEL_ROL\"}'
```

---

### **Paso 2B: Si SÍ hay datos antiguos**

#### **Opción 1: Migración Automática**
```powershell
npm run migrate
```

#### **Opción 2: Migración Manual (MongoDB Shell)**

```javascript
use user_service_db

// MIGRAR ROLES
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

// MIGRAR USUARIOS  
db.users.updateMany(
  {},
  {
    $set: {
      activo: true,
      idPaciente: null,
      tokenFcm: null
    },
    $rename: {
      username: "nombreUsuario",
      password: "contrasena"
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

// Verificar
db.users.findOne()
db.roles.findOne()
```

#### **Opción 3: Eliminar y Recrear (Solo Desarrollo)**

```powershell
# Detener servicio
# Ctrl+C en el terminal donde corre

# Eliminar todos los datos
docker exec -it user-service-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin

# En MongoDB Shell:
use user_service_db
db.users.drop()
db.roles.drop()
exit

# Reiniciar servicio
npm run start:dev
```

---

## 🔍 **Verificación Final**

### **1. Verificar desde MongoDB**

```javascript
use user_service_db

// Debería mostrar solo los campos nuevos:
db.users.findOne()
// Campos esperados: nombreUsuario, contrasena, rol, activo, idPaciente, tokenFcm

db.roles.findOne()
// Campos esperados: descripcion, estado
```

### **2. Verificar desde el API**

```powershell
# Listar usuarios
curl http://localhost:3001/api/v1/users

# Listar roles
curl http://localhost:3001/api/v1/roles
```

### **3. Verificar desde Mongo Express**

1. Abrir `http://localhost:8081`
2. Login: `admin` / `admin`
3. Ir a `user_service_db`
4. Ver colecciones `users` y `roles`
5. Verificar que tengan los campos correctos

---

## 📋 **Checklist de Diagnóstico**

- [ ] ¿MongoDB está corriendo? (`docker-compose ps`)
- [ ] ¿El servicio NestJS está conectado? (ver logs)
- [ ] ¿Hay datos en la base de datos? (`db.users.count()`)
- [ ] ¿Los datos tienen campos antiguos? (`db.users.findOne()`)
- [ ] ¿Las entidades TypeORM están correctas?
- [ ] ¿Los servicios están usando los nombres correctos?

---

## 🎯 **Comandos Útiles**

### Ver logs del servicio:
```powershell
# En el terminal donde corre
npm run start:dev
```

### Ver logs de MongoDB:
```powershell
docker logs user-service-mongodb
```

### Conectar a MongoDB:
```powershell
docker exec -it user-service-mongodb mongosh -u admin -p admin123 --authenticationDatabase admin
```

### Backup de datos (antes de migrar):
```powershell
docker exec user-service-mongodb mongodump --username admin --password admin123 --authenticationDatabase admin --db user_service_db --out /tmp/backup

docker cp user-service-mongodb:/tmp/backup ./backup
```

---

## ❓ **Preguntas Frecuentes**

### **P: ¿Por qué el script de migración muestra "0 actualizados"?**
**R:** Porque no hay documentos en la base de datos o ya están actualizados.

### **P: ¿Cada vez que cambio la entidad debo migrar?**
**R:** Sí, en MongoDB debes migrar manualmente los documentos existentes.

### **P: ¿Puedo evitar esto?**
**R:** Opciones:
1. Usar Mongoose en lugar de TypeORM (tiene mejor soporte para MongoDB)
2. Diseñar esquemas flexibles desde el inicio
3. Crear scripts de migración para cada cambio

### **P: ¿Qué pasa si creo un usuario con el esquema antiguo?**
**R:** TypeORM intentará guardar con los campos nuevos, pero fallará si los campos requeridos no existen.

---

## 🚀 **Solución Rápida**

Si solo estás en desarrollo y no te importan los datos:

```powershell
# 1. Detener el servicio (Ctrl+C)

# 2. Eliminar volúmenes de Docker
docker-compose down -v

# 3. Reiniciar MongoDB
docker-compose up -d

# 4. Reiniciar servicio
npm run start:dev

# 5. Crear datos nuevos
# Los nuevos datos tendrán la estructura correcta
```

---

## 📚 **Recursos Adicionales**

- [MongoDB Update Operators](https://docs.mongodb.com/manual/reference/operator/update/)
- [TypeORM MongoDB Support](https://typeorm.io/mongodb)
- Ver `MIGRATION.md` para más detalles
