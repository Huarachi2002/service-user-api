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
      where: { descripcion: createRoleDto.descripcion },
    });

    if (existingRole) {
      throw new ConflictException(`El rol '${createRoleDto.descripcion}' ya existe`);
    }

    const role = this.roleRepository.create({
      ...createRoleDto,
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
      where: { estado: true },
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
      where: { descripcion: name },
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

    // Si se intenta cambiar la descripción, verificar que no exista otro rol con esa descripción
    if (updateRoleDto.descripcion && updateRoleDto.descripcion !== role.descripcion) {
      const existingRole = await this.roleRepository.findOne({
        where: { descripcion: updateRoleDto.descripcion },
      });

      if (existingRole) {
        throw new ConflictException(`El rol '${updateRoleDto.descripcion}' ya existe`);
      }
    }

    Object.assign(role, updateRoleDto);
    return await this.roleRepository.save(role);
  }

  /**
   * Eliminar un rol (soft delete - desactivar)
   */
  async remove(id: string): Promise<Role> {
    const role = await this.findOne(id);
    role.estado = false;
    return await this.roleRepository.save(role);
  }
}
