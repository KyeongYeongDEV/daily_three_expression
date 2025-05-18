"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.typeOrmConfig = void 0;
const expression_entity_1 = require("../../expression/entities/expression.entity");
const user_entity_1 = require("../../user/entities/user.entity");
const expression_delivery_entity_1 = require("../../expression/entities/expression_delivery.entity");
const typeOrmConfig = async (configService) => {
    return {
        type: 'mysql',
        host: configService.get('DB_HOST'),
        port: parseInt(configService.get('DB_PORT') || '3306', 10),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        entities: [expression_entity_1.ExpressionEntity, user_entity_1.User, expression_delivery_entity_1.ExpressionDelivery],
        synchronize: true,
        charset: 'utf8mb4',
        logging: true,
    };
};
exports.typeOrmConfig = typeOrmConfig;
//# sourceMappingURL=mysql.config.js.map