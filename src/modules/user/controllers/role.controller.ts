import { Controller, Get, Post, Body, Patch, Param, Delete, HttpCode, HttpStatus } from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';

@Controller('roles')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  /**
   * POST /roles - Crear un nuevo rol
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createRoleDto: CreateRoleDto) {
    return this.roleService.create(createRoleDto);
  }

  /**
   * GET /roles - Obtener todos los roles
   */
  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  /**
   * GET /roles/active - Obtener roles activos
   */
  @Get('active')
  findActive() {
    return this.roleService.findActive();
  }

  /**
   * GET /roles/:id - Obtener un rol por ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.roleService.findOne(id);
  }

  /**
   * GET /roles/name/:name - Obtener un rol por nombre
   */
  @Get('name/:name')
  findByName(@Param('name') name: string) {
    return this.roleService.findByName(name);
  }

  /**
   * PATCH /roles/:id - Actualizar un rol
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateRoleDto: UpdateRoleDto) {
    return this.roleService.update(id, updateRoleDto);
  }

  /**
   * DELETE /roles/:id - Desactivar un rol (soft delete)
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.roleService.remove(id);
  }

  /**
   * DELETE /roles/:id/permanent - Eliminar un rol permanentemente
   */
  @Delete(':id/permanent')
  delete(@Param('id') id: string) {
    return this.roleService.delete(id);
  }
}
