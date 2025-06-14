import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { ExpressionEntity } from 'src/expression/domain/expression.entity';
import { UserEntity } from 'src/user/domain/user.entity';
import { ExpressionDeliveryEntity } from 'src/expression/domain/expression-delivery.entity';
import { ExpressionBlackListEntity } from 'src/expression/domain/expression-black-list.entity';

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
    ],
    synchronize: true, // 배포시 false
    logging: true,
    ssl: false,
  };
};
