import { MongoConnectionOptions } from 'typeorm/driver/mongodb/MongoConnectionOptions.js';

export const mongoConfig: MongoConnectionOptions = {
  type: 'mongodb',
  url:
    process.env.MONGODB_URI ||
    `mongodb://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || 27017}/${process.env.DB_DATABASE || 'user_service_db'}?authSource=admin`,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: true, // Importante para MongoDB
};
