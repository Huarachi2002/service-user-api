import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { LoginDto } from '../dto/login.dto';
import { ILoginResponse } from '../interface/login-response.interface';
import { User } from '../entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(loginDto: LoginDto): Promise<ILoginResponse> {
    console.log('Login DTO:', loginDto);
    const user = await this.userService.findByUsername(loginDto.nombreUsuario);
    console.log('Found User:', user);
    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const isPasswordValid = await this.userService.validatePassword(
      loginDto.contrasena,
      user.contrasena,
    );
    console.log('Is Password Valid:', isPasswordValid);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const tokenFcm = loginDto.tokenFcm;
    console.log('Token FCM:', tokenFcm);
    if (tokenFcm) {
      user.tokenFcm = tokenFcm;
    }

    const payload = {
      sub: user._id.toString(),
      nombreUsuario: user.nombreUsuario,
      rol: user.rol?.descripcion,
    };

    const accessToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_SECRET'),
      expiresIn: this.configService.get('JWT_EXPIRATION', '1h'),
    });

    const refreshToken = this.jwtService.sign(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      expiresIn: this.configService.get('JWT_REFRESH_EXPIRATION', '7d'),
    });

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { contrasena, ...userWithoutPassword } = user;

    return {
      accessToken,
      refreshToken,
      usuario: userWithoutPassword as User,
      expiresIn: 3600, // 1 hora en segundos
    };
  }

  async refreshToken(
    refreshToken: string,
  ): Promise<{ accessToken: string; refreshToken: string; expiresIn: number }> {
    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('JWT_REFRESH_SECRET'),
      });

      const user = await this.userService.findOne(payload.sub);

      if (!user || !user.activo) {
        throw new UnauthorizedException('Usuario no autorizado');
      }

      const newPayload = {
        sub: user._id.toString(),
        nombreUsuario: user.nombreUsuario,
        rol: user.rol?.descripcion,
      };

      const accessToken = this.jwtService.sign(newPayload, {
        secret: this.configService.get<string>('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_EXPIRATION', '1h'),
      });

      return {
        accessToken,
        refreshToken,
        expiresIn: 3600,
      };
    } catch (error) {
      throw new UnauthorizedException('Refresh token inválido o expirado');
    }
  }

  async validateToken(token: string): Promise<any> {
    try {
      const payload = this.jwtService.verify(token, {
        secret: this.configService.get<string>('JWT_SECRET'),
      });

      const user = await this.userService.findOne(payload.sub);

      if (!user || !user.activo) {
        throw new UnauthorizedException('Usuario no autorizado');
      }

      return {
        userId: payload.sub,
        nombreUsuario: payload.nombreUsuario,
        rol: payload.rol,
      };
    } catch (error) {
      throw new UnauthorizedException('Token inválido o expirado');
    }
  }
}
