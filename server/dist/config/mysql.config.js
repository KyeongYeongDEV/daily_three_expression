"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const typeOrmConfig = async (configService) => {
    return {
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT') || '3306', 10),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [__dirname + '/../**/*.entity.{ts,js}'],
        synchronize: true,
        charset: 'utf8mb4',
        logging: true,
    };
};
exports.typeOrmConfig = typeOrmConfig;
//# sourceMappingURL=mysql.config.js.map