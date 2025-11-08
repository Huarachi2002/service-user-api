import { IsString, IsNotEmpty, IsArray, IsOptional, IsBoolean } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  @IsNotEmpty({ message: 'El nombre del rol es requerido' })
  name: string;

  @IsString()
  @IsNotEmpty({ message: 'La descripción es requerida' })
  description: string;

  @IsArray()
  @IsOptional()
  permissions?: string[];
}
