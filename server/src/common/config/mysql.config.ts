// src/config/typeorm.config.ts
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ExpressionEntity } from 'src/expression/domain/expression.entity';
import { UserEntity } from 'src/user/domain/user.entity';
import { ExpressionDeliveryEntity } from 'src/expression/domain/expression-delivery.entity';

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
    entities: [ExpressionEntity, UserEntity, ExpressionDeliveryEntity],
    synchronize: true, //TODO 배포시 false
    charset: 'utf8mb4',
    logging: true,
  };
};
