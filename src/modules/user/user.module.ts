import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Role } from './entities/role.entity';
import { UserService } from './services/user.service';
import { RoleService } from './services/role.service';
import { UserController } from './controllers/user.controller';
import { RoleController } from './controllers/role.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Role]),
  ],
  controllers: [UserController, RoleController],
  providers: [UserService, RoleService],
  exports: [UserService, RoleService], // Exportar para uso en otros módulos
})
export class UserModule {}
