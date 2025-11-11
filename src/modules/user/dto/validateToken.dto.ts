import { IsNotEmpty, IsString } from 'class-validator';

export class ValidateTokenDto {
  @IsString()
  @IsNotEmpty({ message: 'El token es obligatorio' })
  token: string;
}
