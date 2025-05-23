"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const ioredis_1 = require("@nestjs-modules/ioredis");
const typeorm_1 = require("@nestjs/typeorm");
const user_module_1 = require("./user/user.module");
const admin_module_1 = require("./admin/admin.module");
const ai_module_1 = require("./ai/ai.module");
const batch_module_1 = require("./batch/batch.module");
const expression_module_1 = require("./expression/expression.module");
const mailer_module_1 = require("./mailer/mailer.module");
const expression_entity_1 = require("./expression/domain/expression.entity");
const user_entity_1 = require("./user/domain/user.entity");
const expression_delivery_entity_1 = require("./expression/domain/expression-delivery.entity");
const mysql_config_1 = require("./common/config/mysql.config");
const auth_module_1 = require("./auth/auth.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: mysql_config_1.typeOrmConfig,
            }),
            typeorm_1.TypeOrmModule.forFeature([
                expression_entity_1.ExpressionEntity,
                user_entity_1.UserEntity,
                expression_delivery_entity_1.ExpressionDeliveryEntity,
            ]),
            ioredis_1.RedisModule.forRootAsync({
                imports: [config_1.ConfigModule],
                inject: [config_1.ConfigService],
                useFactory: (configService) => ({
                    type: 'single',
                    options: {
                        host: configService.get('REDIS_HOST') || 'localhost',
                        port: parseInt(configService.get('REDIS_PORT') || '6379', 10),
                    },
                }),
            }),
            user_module_1.UserModule,
            admin_module_1.AdminModule,
            ai_module_1.AIModule,
            batch_module_1.BatchModule,
            mailer_module_1.MailerModule,
            expression_module_1.ExpressionModule,
            auth_module_1.AuthModule,
        ],
        providers: [],
        controllers: [],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map