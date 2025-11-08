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
  Query 
} from '@nestjs/common';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  /**
   * POST /users - Crear un nuevo usuario
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  /**
   * GET /users - Obtener todos los usuarios
   */
  @Get()
  findAll() {
    return this.userService.findAll();
  }

  /**
   * GET /users/active - Obtener usuarios activos
   */
  @Get('active')
  findActive() {
    return this.userService.findActive();
  }

  /**
   * GET /users/exists/email - Verificar si existe un email
   */
  @Get('exists/email')
  async existsByEmail(@Query('email') email: string) {
    const exists = await this.userService.existsByEmail(email);
    return { exists };
  }

  /**
   * GET /users/exists/username - Verificar si existe un username
   */
  @Get('exists/username')
  async existsByUsername(@Query('username') username: string) {
    const exists = await this.userService.existsByUsername(username);
    return { exists };
  }

  /**
   * GET /users/email/:email - Buscar usuario por email
   */
  @Get('email/:email')
  findByEmail(@Param('email') email: string) {
    return this.userService.findByEmail(email);
  }

  /**
   * GET /users/username/:username - Buscar usuario por username
   */
  @Get('username/:username')
  findByUsername(@Param('username') username: string) {
    return this.userService.findByUsername(username);
  }

  /**
   * GET /users/:id - Obtener un usuario por ID
   */
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  /**
   * PATCH /users/:id - Actualizar un usuario
   */
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  /**
   * PATCH /users/:id/roles - Asignar roles a un usuario
   */
  @Patch(':id/roles')
  assignRoles(@Param('id') id: string, @Body('roles') roles: string[]) {
    return this.userService.assignRoles(id, roles);
  }

  /**
   * PATCH /users/:id/last-login - Actualizar último login
   */
  @Patch(':id/last-login')
  updateLastLogin(@Param('id') id: string) {
    return this.userService.updateLastLogin(id);
  }

  /**
   * DELETE /users/:id - Desactivar un usuario (soft delete)
   */
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }

  /**
   * DELETE /users/:id/permanent - Eliminar un usuario permanentemente
   */
  @Delete(':id/permanent')
  delete(@Param('id') id: string) {
    return this.userService.delete(id);
  }
}
