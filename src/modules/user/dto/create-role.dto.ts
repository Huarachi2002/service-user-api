import { IsString, IsBoolean } from 'class-validator';

export class CreateRoleDto {
  @IsString()
  descripcion: string;

  @IsBoolean()
  estado: boolean = true;
}
