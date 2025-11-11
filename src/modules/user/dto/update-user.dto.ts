import { IsString, IsOptional, IsBoolean, IsNumber } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  @IsOptional()
  nombreUsuario?: string;

  @IsString()
  @IsOptional()
  contrasena?: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;

  @IsNumber()
  @IsOptional()
  idPaciente?: number;

  @IsString()
  @IsOptional()
  tokenFcm?: string;

  @IsString()
  @IsOptional()
  idRol?: string;
}
