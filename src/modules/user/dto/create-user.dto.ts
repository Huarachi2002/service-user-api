import { IsString, IsBoolean, IsNumber } from 'class-validator';

export class CreateUserDto {
  @IsString()
  nombreUsuario: string;

  @IsString()
  contrasena: string;

  @IsBoolean()
  activo?: boolean = true;

  @IsNumber()
  idPaciente?: number;

  @IsString()
  tokenFcm?: string;

  @IsString()
  idRol: string;
}
