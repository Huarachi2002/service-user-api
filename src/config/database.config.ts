import { registerAs } from '@nestjs/config';

export default registerAs('database', () => ({
  type: process.env.DB_TYPE || 'mongodb',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT, 10) || 27017,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE || 'user_service_db',
  synchronize: process.env.NODE_ENV === 'development', // Solo en desarrollo
  logging: process.env.NODE_ENV === 'development',
  useUnifiedTopology: true,
  useNewUrlParser: true,
}));
