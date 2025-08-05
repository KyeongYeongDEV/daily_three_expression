import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ExpressionEntity } from '../../expression/domain/expression.entity';
import { UserEntity } from '../../user/domain/user.entity';
import { ExpressionDeliveryEntity } from '../../expression/domain/expression-delivery.entity';
import { ExpressionBlackListEntity } from '../../expression/domain/expression-black-list.entity';
import { TestUserEntity } from '../../user/domain/test-user.entity';

export const postgreConfig = async (
  configService: ConfigService,
): Promise<TypeOrmModuleOptions> => {
  return {
    type: 'postgres',
    host: configService.get<string>('POSTGRE_DB_HOST'),
    port: parseInt(configService.get<string>('POSTGRE_DB_PORT') || '5432', 10),
    username: configService.get<string>('POSTGRE_DB_USERNAME'),
    password: configService.get<string>('POSTGRE_DB_PASSWORD'),
    database: configService.get<string>('POSTGRE_DB_DATABASE'),
    entities: [
      ExpressionEntity,
      UserEntity,
      ExpressionDeliveryEntity,
      ExpressionBlackListEntity,
      TestUserEntity,
    ],
    synchronize: true, // 배포시 false
    logging: true,
    ssl: {
      rejectUnauthorized: false, 
    },
  };
};
