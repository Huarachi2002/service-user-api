import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Habilitar CORS para comunicación con API Gateway
  app.enableCors({
    origin: process.env.API_GATEWAY_URL || 'http://localhost:3000',
    credentials: true,
  });

  // Habilitar validación global de DTOs
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Elimina propiedades no definidas en los DTOs
      forbidNonWhitelisted: true, // Lanza error si hay propiedades adicionales
      transform: true, // Transforma automáticamente los tipos
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  // Prefijo global para todas las rutas
  app.setGlobalPrefix('api');

  const port = process.env.PORT || 3002;
  await app.listen(port);

  console.log(`🚀 Servicio de Usuario ejecutándose en: http://localhost:${port}/api`);
  console.log(`📚 Endpoints disponibles:`);
  console.log(`   - http://localhost:${port}/api/users`);
  console.log(`   - http://localhost:${port}/api/roles`);
}
bootstrap();
