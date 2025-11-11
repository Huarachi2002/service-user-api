import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { IApiResponse } from 'src/common/interface/api-response.interface';
import { RefreshTokenDto } from '../dto/refreshToken.dto';
import { ValidateTokenDto } from '../dto/validateToken.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() loginDto: LoginDto): Promise<IApiResponse> {
    const result = await this.authService.login(loginDto);
    return {
      statusCode: HttpStatus.OK,
      message: 'Inicio de sesión exitoso',
      data: result,
    };
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refresh(@Body() refreshTokenDto: RefreshTokenDto): Promise<IApiResponse> {
    const result = await this.authService.refreshToken(refreshTokenDto.refreshToken);
    return {
      statusCode: HttpStatus.OK,
      message: 'Token de acceso renovado',
      data: result,
    };
  }

  @Post('validate')
  @HttpCode(HttpStatus.OK)
  async validate(@Body() validateTokenDto: ValidateTokenDto): Promise<IApiResponse> {
    const result = await this.authService.validateToken(validateTokenDto.token);
    return {
      statusCode: HttpStatus.OK,
      message: 'Token válido',
      data: result,
    };
  }
}
