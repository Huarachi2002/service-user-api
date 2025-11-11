import { Role } from 'src/modules/user/entities/role.entity';
import { User } from 'src/modules/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export default class MainSeeder implements Seeder {
  public async run(dataSource: DataSource, factoryManager: SeederFactoryManager): Promise<any> {
    console.log('Iniciando el proceso de seeding...');

    // 1. Seeder para roles (datos fijos)
    await this.seedRoles(dataSource);

    // 2. Seeder para usuario admin (datos fijos)
    await this.seedUser(dataSource);

    console.log('Proceso de seeding completado.');
  }

  private async seedRoles(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(Role);

    const count = await repository.count();
    if (count > 0) {
      console.log('Los roles ya han sido sembrados. Saltando este paso.');
      return;
    }

    const roles = [
      { descripcion: 'ADMIN', estado: true },
      { descripcion: 'USER_REPORT', estado: true },
      { descripcion: 'USER_SOLICITUD', estado: true },
      { descripcion: 'USER_AUDIT', estado: true },
      { descripcion: 'PATIENT', estado: true },
    ];
    for (const roleData of roles) {
      const role = repository.create(roleData);
      await repository.save(role);
    }
    console.log(`Seeding de Rol completado.`);
  }

  private async seedUser(dataSource: DataSource): Promise<void> {
    const repository = dataSource.getRepository(User);

    const count = await repository.count();
    if (count > 0) {
      console.log('Los usuarios ya han sido sembrados. Saltando este paso.');
      return;
    }

    const rolAdmin = await dataSource
      .getRepository(Role)
      .findOne({ where: { descripcion: 'ADMIN' } });

    const rolPatient = await dataSource
      .getRepository(Role)
      .findOne({ where: { descripcion: 'PATIENT' } });

    const rolUserReport = await dataSource
      .getRepository(Role)
      .findOne({ where: { descripcion: 'USER_REPORT' } });
    
    const rolUserSolicitud = await dataSource
      .getRepository(Role)
      .findOne({ where: { descripcion: 'USER_SOLICITUD' } });

    const rolUserAudit = await dataSource
      .getRepository(Role)
      .findOne({ where: { descripcion: 'USER_AUDIT' } });

    const contrasenaHash = require('bcrypt').hashSync('admin123', 10);
    const contrasenaPatientHash = require('bcrypt').hashSync('123', 10);
    const contranseaUserHash = require('bcrypt').hashSync('user123', 10);
    const users = [
      { nombreUsuario: 'admin', contrasena: contrasenaHash, rol: rolAdmin, idPaciente: null, tokenFcm: null, activo: true },
      { nombreUsuario: 'paciente1', contrasena: contrasenaPatientHash, rol: rolPatient, idPaciente: null, tokenFcm: null, activo: true  },
      { nombreUsuario: 'paciente2', contrasena: contrasenaPatientHash, rol: rolPatient, idPaciente: null, tokenFcm: null, activo: true  },
      { nombreUsuario: 'paciente3', contrasena: contrasenaPatientHash, rol: rolPatient, idPaciente: null, tokenFcm: null, activo: true  },
      { nombreUsuario: 'ureport', contrasena: contranseaUserHash, rol: rolUserReport, idPaciente: null, tokenFcm: null, activo: true  },
      { nombreUsuario: 'usolicitud', contrasena: contranseaUserHash, rol: rolUserSolicitud, idPaciente: null, tokenFcm: null, activo: true },
      { nombreUsuario: 'uaudit', contrasena: contranseaUserHash, rol: rolUserAudit, idPaciente: null, tokenFcm: null, activo: true },
    ];

    for (const userData of users) {
      const user = repository.create(userData);
      await repository.save(user);
    }

    console.log(`Seeding de Usuario completado.`);
  }
}
