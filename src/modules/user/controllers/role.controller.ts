import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RoleService } from '../services/role.service';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { IApiResponse } from 'src/common/interface/api-response.interface';

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
  async findAll(): Promise<IApiResponse> {
    const roles = await this.roleService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Roles retrieved successfully',
      data: roles,
    };
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
  async findOne(@Param('id') id: string): Promise<IApiResponse> {
    const role = await this.roleService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Role retrieved successfully',
      data: role,
    };
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
}
