import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
import { runSeeders, SeederOptions } from 'typeorm-extension';
import 'tsconfig-paths/register'; // 🔑 Importante para resolver paths

// Cargar variables de entorno PRIMERO
config();

console.log('🔧 Configuración de conexión:');
console.log(`   Host: ${process.env.DB_HOST}`);
console.log(`   Port: ${process.env.DB_PORT}`);
console.log(`   Database: ${process.env.DB_DATABASE}`);
console.log(`   Username: ${process.env.DB_USERNAME}`);

const options: DataSourceOptions & SeederOptions = {
  type: 'mongodb',
  url: `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}/${process.env.DB_DATABASE || 'user_service_db'}?authSource=admin`,
  entities: ['src/**/*.entity{.ts,.js}'],
  factories: ['src/seeding/*.factory{.ts,.js}'],
  seeds: ['src/seeding/main.seeder{.ts,.js}'],
  synchronize: true, // Importante: debe ser true para MongoDB
  logging: true, // Activar para ver qué está pasando
};

const AppDataSource = new DataSource(options);
AppDataSource.initialize()
  .then(async () => {
    console.log('✅ Data Source has been initialized!');
    await AppDataSource.synchronize(true);
    console.log('🌱 Ejecutando seeders...');
    await runSeeders(AppDataSource);
    console.log('✅ Seeders ejecutados exitosamente!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error durante el seeding:', error);
    process.exit(1);
  });
