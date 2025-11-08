import { IsString, IsEmail, IsOptional, MinLength, IsArray, IsBoolean } from 'class-validator';

export class UpdateUserDto {
  @IsEmail({}, { message: 'El email debe ser válido' })
  @IsOptional()
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(3, { message: 'El nombre de usuario debe tener al menos 3 caracteres' })
  username?: string;

  @IsString()
  @IsOptional()
  @MinLength(6, { message: 'La contraseña debe tener al menos 6 caracteres' })
  password?: string;

  @IsString()
  @IsOptional()
  firstName?: string;

  @IsString()
  @IsOptional()
  lastName?: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  avatar?: string;

  @IsArray()
  @IsOptional()
  roles?: string[];

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsBoolean()
  @IsOptional()
  isEmailVerified?: boolean;
}
