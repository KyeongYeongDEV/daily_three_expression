import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { config } from 'dotenv';
import { ExpressionEntity } from './expression/domain/expression.entity';
import { UserEntity } from './user/domain/user.entity';
import { ExpressionDeliveryEntity } from './expression/domain/expression-delivery.entity';
import { ExpressionBlackListEntity } from './expression/domain/expression-black-list.entity';

config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.POSTGRE_DB_HOST,
  port: parseInt(process.env.POSTGRE_DB_PORT || '5432', 10),
  username: process.env.POSTGRE_DB_USERNAME,
  password: process.env.POSTGRE_DB_PASSWORD,
  database: process.env.POSTGRE_DB_DATABASE,
  synchronize: false,
  logging: true,
  entities: [
    ExpressionEntity,
    UserEntity,
    ExpressionDeliveryEntity,
    ExpressionBlackListEntity,
  ],
  migrations: ['src/migrations/*.ts'],
});
