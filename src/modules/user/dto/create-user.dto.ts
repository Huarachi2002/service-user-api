import { IsString, IsEmail, IsNotEmpty, MinLength, IsOptional, IsArray, IsBoolean } from 'class-validator';

export class CreateUserDto {
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsNotEmpty({ message: 'El email es requerido' })
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre de usuario es requerido' })
  @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
  username: string;

  @IsString()
  @IsNotEmpty({ message: 'La contraseña es requerida' })
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password: string;

  @IsString()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  firstName: string;

  @IsString()
  @IsNotEmpty({ message: 'El apellido es requerido' })
  lastName: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsArray()
  @IsOptional()
  roles?: string[];
}
