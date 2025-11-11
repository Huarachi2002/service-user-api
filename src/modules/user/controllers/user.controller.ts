import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
  HttpStatus,
  Query,
  Put,
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { IApiResponse } from 'src/common/interface/api-response.interface';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * POST /users - Crear un nuevo usuario
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createUserDto: CreateUserDto): Promise<IApiResponse> {
    const user = await this.userService.create(createUserDto);
    return {
      statusCode: HttpStatus.CREATED,
      message: 'Usuario creado con éxito',
      data: user,
    };
  }

  /**
   * GET /users - Obtener todos los usuarios
   */
  @Get()
  async findAll(): Promise<IApiResponse> {
    const users = await this.userService.findAll();
    return {
      statusCode: HttpStatus.OK,
      message: 'Usuarios encontrados con éxito',
      data: users,
    };
  }

  /**
   * GET /users/active - Obtener usuarios activos
   */
  @Get('active')
  async findActive(): Promise<IApiResponse> {
    const users = await this.userService.findActive();
    return {
      statusCode: HttpStatus.OK,
      message: 'Usuarios activos encontrados con éxito',
      data: users,
    };
  }

  /**
   * GET /users/exists/username - Verificar si existe un username
   */
  @Get('exists/username')
  async existsByUsername(@Query('username') username: string): Promise<IApiResponse> {
    const exists = await this.userService.existsByUsername(username);
    return {
      statusCode: HttpStatus.OK,
      message: 'Verificación de existencia de nombre de usuario realizada con éxito',
      data: exists,
    };
  }

  /**
   * GET /users/username/:username - Buscar usuario por username
   */
  @Get('username/:username')
  async findByUsername(@Param('username') username: string): Promise<IApiResponse> {
    const user = await this.userService.findByUsername(username);
    return {
      statusCode: HttpStatus.OK,
      message: 'Usuario encontrado con éxito',
      data: user,
    };
  }

  /**
   * GET /users/:id - Obtener un usuario por ID
   */
  @Get(':id')
  async findOne(@Param('id') id: string): Promise<IApiResponse> {
    const user = await this.userService.findOne(id);
    return {
      statusCode: HttpStatus.OK,
      message: 'Usuario encontrado con éxito',
      data: user,
    };
  }

  /**
   * PATCH /users/:id - Actualizar un usuario
   */
  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<IApiResponse> {
    const user = await this.userService.update(id, updateUserDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Usuario actualizado con éxito',
      data: user,
    };
  }

  /**
   * PATCH /users/:id/roles - Asignar roles a un usuario
   */
  @Put(':id/roles')
  async assignRoles(@Param('id') id: string, @Body('idRol') idRol: string): Promise<IApiResponse> {
    const user = await this.userService.assignRoles(id, idRol);
    return {
      statusCode: HttpStatus.OK,
      message: 'Roles asignados con éxito',
      data: user,
    };
  }

  /**
   * DELETE /users/:id - Desactivar un usuario (soft delete)
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
}
