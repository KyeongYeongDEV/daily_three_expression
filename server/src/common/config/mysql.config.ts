// src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ExpressionEntity } from 'src/expression/entities/expression.entity';
import { User } from 'src/user/entities/user.entity';
import { ExpressionDeliveryEntity } from 'src/expression/entities/expression-delivery.entity';

export const typeOrmConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'mysql',
    host: configService.get<string>('DB_HOST'),
    port: parseInt(configService.get<string>('DB_PORT') || '3306', 10),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    entities: [ExpressionEntity, User, ExpressionDeliveryEntity],
    synchronize: true, //TODO 배포시 false
    charset: 'utf8mb4',
    logging: true,
  };
};
