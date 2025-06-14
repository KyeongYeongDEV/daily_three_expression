"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_controller_1 = require("./adpater/in/user.controller");
const user_service_1 = require("./service/user.service");
const user_entity_1 = require("./domain/user.entity");
const user_adapter_1 = require("./adpater/out/user.adapter");
const redis_adpter_1 = require("../auth/adapter/out/redis.adpter");
const config_module_1 = require("../common/config/config.module");
let UserModule = class UserModule {
};
exports.UserModule = UserModule;
exports.UserModule = UserModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity]),
            config_module_1.RedisConfigModule
        ],
        controllers: [user_controller_1.UserController],
        providers: [
            user_service_1.UserService,
            user_adapter_1.UserAdapter,
            redis_adpter_1.RedisAdapter,
            {
                provide: 'UserPort',
                useExisting: user_adapter_1.UserAdapter,
            },
            {
                provide: 'RedisPort',
                useExisting: redis_adpter_1.RedisAdapter,
            },
        ],
        exports: [user_service_1.UserService],
    })
], UserModule);
//# sourceMappingURL=user.module.js.map