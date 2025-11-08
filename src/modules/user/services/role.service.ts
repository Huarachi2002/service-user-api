import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { Role } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: MongoRepository<Role>,
  ) {}

  /**
   * Crear un nuevo rol
   */
  async create(createRoleDto: CreateRoleDto): Promise<Role> {
    // Verificar si el rol ya existe
    const existingRole = await this.roleRepository.findOne({
      where: { name: createRoleDto.name },
    });

    if (existingRole) {
      throw new ConflictException(`El rol '${createRoleDto.name}' ya existe`);
    }

    const role = this.roleRepository.create({
      ...createRoleDto,
      permissions: createRoleDto.permissions || [],
    });

    return await this.roleRepository.save(role);
  }

  /**
   * Obtener todos los roles
   */
  async findAll(): Promise<Role[]> {
    return await this.roleRepository.find();
  }

  /**
   * Obtener roles activos
   */
  async findActive(): Promise<Role[]> {
    return await this.roleRepository.find({
      where: { isActive: true },
    });
  }

  /**
   * Buscar un rol por ID
   */
  async findOne(id: string): Promise<Role> {
    if (!ObjectId.isValid(id)) {
      throw new NotFoundException('ID de rol no válido');
    }

    const role = await this.roleRepository.findOne({
      where: { _id: new ObjectId(id) },
    });

    if (!role) {
      throw new NotFoundException(`Rol con ID '${id}' no encontrado`);
    }

    return role;
  }

  /**
   * Buscar un rol por nombre
   */
  async findByName(name: string): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { name },
    });

    if (!role) {
      throw new NotFoundException(`Rol '${name}' no encontrado`);
    }

    return role;
  }

  /**
   * Actualizar un rol
   */
  async update(id: string, updateRoleDto: UpdateRoleDto): Promise<Role> {
    const role = await this.findOne(id);

    // Si se intenta cambiar el nombre, verificar que no exista otro rol con ese nombre
    if (updateRoleDto.name && updateRoleDto.name !== role.name) {
      const existingRole = await this.roleRepository.findOne({
        where: { name: updateRoleDto.name },
      });

      if (existingRole) {
        throw new ConflictException(`El rol '${updateRoleDto.name}' ya existe`);
      }
    }

    Object.assign(role, updateRoleDto);
    return await this.roleRepository.save(role);
  }

  /**
   * Eliminar un rol (soft delete - desactivar)
   */
  async remove(id: string): Promise<{ message: string }> {
    const role = await this.findOne(id);
    role.isActive = false;
    await this.roleRepository.save(role);
    return { message: `Rol '${role.name}' desactivado correctamente` };
  }

  /**
   * Eliminar un rol permanentemente
   */
  async delete(id: string): Promise<{ message: string }> {
    const role = await this.findOne(id);
    await this.roleRepository.delete(role._id);
    return { message: `Rol '${role.name}' eliminado permanentemente` };
  }
}
