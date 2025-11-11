import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepositoryToken } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { User } from '../modules/user/entities/user.entity';
import { Role } from '../modules/user/entities/role.entity';

/**
 * Script para migrar datos existentes en MongoDB
 * Actualiza los documentos antiguos con los nuevos campos
 */
async function migrateDatabase() {
  console.log('🔄 Iniciando migración de base de datos...\n');

  const app = await NestFactory.createApplicationContext(AppModule);

  try {
    // Obtener repositorios
    const userRepository = app.get<MongoRepository<User>>(
      getRepositoryToken(User),
    );
    const roleRepository = app.get<MongoRepository<Role>>(
      getRepositoryToken(Role),
    );

    // ========== MIGRACIÓN DE ROLES ==========
    console.log('📝 Migrando roles...');
    const roles = await roleRepository.find();
    let rolesUpdated = 0;

    for (const role of roles) {
      let needsUpdate = false;

      // Agregar campo 'estado' si no existe (valor por defecto: true)
      if (role.estado === undefined || role.estado === null) {
        (role as any).estado = true;
        needsUpdate = true;
      }

      // Eliminar campos antiguos si existen
      if ((role as any).name !== undefined) {
        delete (role as any).name;
        needsUpdate = true;
      }
      if ((role as any).description !== undefined) {
        delete (role as any).description;
        needsUpdate = true;
      }
      if ((role as any).permissions !== undefined) {
        delete (role as any).permissions;
        needsUpdate = true;
      }
      if ((role as any).isActive !== undefined) {
        delete (role as any).isActive;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await roleRepository.save(role);
        rolesUpdated++;
        console.log(`  ✅ Rol actualizado: ${role.descripcion || role._id}`);
      }
    }
    console.log(`✨ ${rolesUpdated} roles actualizados\n`);

    // ========== MIGRACIÓN DE USUARIOS ==========
    console.log('👥 Migrando usuarios...');
    const users = await userRepository.find();
    let usersUpdated = 0;

    for (const user of users) {
      let needsUpdate = false;

      // Agregar campo 'idPaciente' si no existe
      if (user.idPaciente === undefined) {
        (user as any).idPaciente = null;
        needsUpdate = true;
      }

      // Agregar campo 'tokenFcm' si no existe
      if (user.tokenFcm === undefined) {
        (user as any).tokenFcm = null;
        needsUpdate = true;
      }

      // Agregar campo 'activo' si no existe (valor por defecto: true)
      if (user.activo === undefined || user.activo === null) {
        (user as any).activo = true;
        needsUpdate = true;
      }

      // Renombrar campos antiguos si existen
      if ((user as any).email !== undefined) {
        // Si existe email antiguo, mantenerlo como referencia
        delete (user as any).email;
        needsUpdate = true;
      }
      if ((user as any).username !== undefined) {
        (user as any).nombreUsuario = (user as any).username;
        delete (user as any).username;
        needsUpdate = true;
      }
      if ((user as any).password !== undefined) {
        (user as any).contrasena = (user as any).password;
        delete (user as any).password;
        needsUpdate = true;
      }
      if ((user as any).firstName !== undefined) {
        delete (user as any).firstName;
        needsUpdate = true;
      }
      if ((user as any).lastName !== undefined) {
        delete (user as any).lastName;
        needsUpdate = true;
      }
      if ((user as any).phone !== undefined) {
        delete (user as any).phone;
        needsUpdate = true;
      }
      if ((user as any).avatar !== undefined) {
        delete (user as any).avatar;
        needsUpdate = true;
      }
      if ((user as any).roles !== undefined) {
        delete (user as any).roles;
        needsUpdate = true;
      }
      if ((user as any).isActive !== undefined) {
        (user as any).activo = (user as any).isActive;
        delete (user as any).isActive;
        needsUpdate = true;
      }
      if ((user as any).isEmailVerified !== undefined) {
        delete (user as any).isEmailVerified;
        needsUpdate = true;
      }
      if ((user as any).lastLogin !== undefined) {
        delete (user as any).lastLogin;
        needsUpdate = true;
      }

      if (needsUpdate) {
        await userRepository.save(user);
        usersUpdated++;
        console.log(`  ✅ Usuario actualizado: ${user.nombreUsuario || user._id}`);
      }
    }
    console.log(`✨ ${usersUpdated} usuarios actualizados\n`);

    console.log('✅ ¡Migración completada exitosamente!');
    console.log(`   - ${rolesUpdated} roles migrados`);
    console.log(`   - ${usersUpdated} usuarios migrados\n`);

  } catch (error) {
    console.error('❌ Error durante la migración:', error);
    throw error;
  } finally {
    await app.close();
  }
}

// Ejecutar migración
if (require.main === module) {
  migrateDatabase()
    .then(() => {
      console.log('🎉 Proceso completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('💥 Error fatal:', error);
      process.exit(1);
    });
}

export default migrateDatabase;
