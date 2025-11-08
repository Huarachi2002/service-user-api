import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: MongoRepository<User>,
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
    // Verificar si el email ya existe
    const existingEmail = await this.userRepository.findOne({
      where: { email: createUserDto.email },
    });

    if (existingEmail) {
      throw new ConflictException(`El email '${createUserDto.email}' ya está registrado`);
    }

    // Verificar si el username ya existe
    const existingUsername = await this.userRepository.findOne({
      where: { username: createUserDto.username },
    });

    if (existingUsername) {
      throw new ConflictException(`El nombre de usuario '${createUserDto.username}' ya existe`);
    }

    // Hashear la contraseña
    const hashedPassword = await this.hashPassword(createUserDto.password);

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword,
      roles: createUserDto.roles || ['user'], // Rol por defecto
    });

    return await this.userRepository.save(user);
  }

  /**
   * Obtener todos los usuarios
   */
  async findAll(): Promise<User[]> {
    return await this.userRepository.find();
  }

  /**
   * Obtener usuarios activos
   */
  async findActive(): Promise<User[]> {
    return await this.userRepository.find({
      where: { isActive: true },
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
   * Buscar usuario por email
   */
  async findByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new NotFoundException(`Usuario con email '${email}' no encontrado`);
    }

    return user;
  }

  /**
   * Buscar usuario por username
   */
  async findByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { username },
    });

    if (!user) {
      throw new NotFoundException(`Usuario '${username}' no encontrado`);
    }

    return user;
  }

  /**
   * Verificar si existe un usuario por email (para validación desde API Gateway)
   */
  async existsByEmail(email: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { email },
    });
    return !!user;
  }

  /**
   * Verificar si existe un usuario por username
   */
  async existsByUsername(username: string): Promise<boolean> {
    const user = await this.userRepository.findOne({
      where: { username },
    });
    return !!user;
  }

  /**
   * Actualizar un usuario
   */
  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // Si se cambia el email, verificar que no exista
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingEmail = await this.userRepository.findOne({
        where: { email: updateUserDto.email },
      });

      if (existingEmail) {
        throw new ConflictException(`El email '${updateUserDto.email}' ya está registrado`);
      }
    }

    // Si se cambia el username, verificar que no exista
    if (updateUserDto.username && updateUserDto.username !== user.username) {
      const existingUsername = await this.userRepository.findOne({
        where: { username: updateUserDto.username },
      });

      if (existingUsername) {
        throw new ConflictException(`El nombre de usuario '${updateUserDto.username}' ya existe`);
      }
    }

    // Si se actualiza la contraseña, hashearla
    if (updateUserDto.password) {
      updateUserDto.password = await this.hashPassword(updateUserDto.password);
    }

    Object.assign(user, updateUserDto);
    return await this.userRepository.save(user);
  }

  /**
   * Actualizar último login
   */
  async updateLastLogin(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.lastLogin = new Date();
    return await this.userRepository.save(user);
  }

  /**
   * Asignar roles a un usuario
   */
  async assignRoles(id: string, roles: string[]): Promise<User> {
    const user = await this.findOne(id);
    user.roles = roles;
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
  async remove(id: string): Promise<{ message: string }> {
    const user = await this.findOne(id);
    user.isActive = false;
    await this.userRepository.save(user);
    return { message: `Usuario '${user.username}' desactivado correctamente` };
  }

  /**
   * Eliminar un usuario permanentemente
   */
  async delete(id: string): Promise<{ message: string }> {
    const user = await this.findOne(id);
    await this.userRepository.delete(user._id);
    return { message: `Usuario '${user.username}' eliminado permanentemente` };
  }
}
