import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { RoleService } from './role.service';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,

    private readonly roleService: RoleService,
  ) {}

  /**
   * Hashear contraseña
   */
  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  /**
   * Crear un nuevo usuario
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    // Verificar si el username ya existe
    const existingUsername = await this.userRepository.findOne({
      where: { nombreUsuario: createUserDto.nombreUsuario },
    });

    if (existingUsername) {
      throw new ConflictException(
        `El nombre de usuario '${createUserDto.nombreUsuario}' ya existe`,
      );
    }

    const rol = await this.roleService.findOne(createUserDto.idRol);

    // Hashear la contraseña
    const hashedPassword = await this.hashPassword(createUserDto.contrasena);

    const user = this.userRepository.create({
      nombreUsuario: createUserDto.nombreUsuario,
      contrasena: hashedPassword,
      rol: rol,
    });

    return await this.userRepository.save(user);
  }

  /**
   * Obtener todos los usuarios
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  async findByIdPaciente(idPaciente: number): Promise<User> {
    console.log('Buscando usuario con idPaciente:', idPaciente);
    const user = await this.userRepository.findOne({
      where: { idPaciente: idPaciente },
    });
    console.log('Usuario encontrado:', user);
    if (!user) {
      throw new NotFoundException(`Usuario con idPaciente '${idPaciente}' no encontrado`);
    }
    return user;
  }

  /**
   * Obtener usuarios activos
   */
  async findActive(): Promise<User[]> {
    return await this.userRepository.find({
      where: { activo: true },
    });
  }

  /**
   * Buscar un usuario por ID
   */
  async findOne(id: string): Promise<User> {
    if (!ObjectId.isValid(id)) {
      throw new BadRequestException('ID de usuario no válido');
    }

    const user = await this.userRepository.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con ID '${id}' no encontrado`);
    }

    return user;
  }

  /**
   * Buscar usuario por username
   */
  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { nombreUsuario: username },
    });

    if (!user) {
      throw new NotFoundException(`Usuario '${username}' no encontrado`);
    }

    return user;
  }

  /**
   * Verificar si existe un usuario por username
   */
  async existsByUsername(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { nombreUsuario: username },
    });
    return !!user;
  }

  /**
   * Actualizar un usuario
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Si se cambia el username, verificar que no exista
    if (updateUserDto.nombreUsuario && updateUserDto.nombreUsuario !== user.nombreUsuario) {
      const existingUsername = await this.userRepository.findOne({
        where: { nombreUsuario: updateUserDto.nombreUsuario },
      });

      if (existingUsername) {
        throw new ConflictException(
          `El nombre de usuario '${updateUserDto.nombreUsuario}' ya existe`,
        );
      }
    }

    // Si se actualiza la contraseña, hashearla
    if (updateUserDto.contrasena) {
      updateUserDto.contrasena = await this.hashPassword(updateUserDto.contrasena);
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  /**
   * Asignar roles a un usuario
   */
  async assignRoles(id: string, idRol: string): Promise<User> {
    const user = await this.findOne(id);
    const rol = await this.roleService.findOne(idRol);
    user.rol = rol;
    return await this.userRepository.save(user);
  }

  /**
   * Verificar contraseña (útil para validaciones)
   */
  async validatePassword(plainPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  /**
   * Eliminar un usuario (soft delete - desactivar)
   */
  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.activo = false;
    return await this.userRepository.save(user);
  }
}
