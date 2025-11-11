import { IsString, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nombreUsuario: string;

  @IsString()
  contrasena: string;

  @IsBoolean()
  activo?: boolean = true;

  @IsString()
  idRol: string;
}
