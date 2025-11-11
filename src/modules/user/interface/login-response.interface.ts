import { User } from '../entities/user.entity';

export interface ILoginResponse {
  accessToken: string;
  refreshToken: string;
  usuario: User;
  expiresIn?: number;
}
