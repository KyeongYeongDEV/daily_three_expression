"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthModule = void 0;
const common_1 = require("@nestjs/common");
const auth_service_1 = require("./service/auth.service");
const auth_controller_1 = require("./adapter/in/auth.controller");
const jwt_config_1 = require("../common/config/jwt.config");
const jwt_1 = require("@nestjs/jwt");
const jwt_adapter_1 = require("./adapter/out/jwt.adapter");
const redis_adpter_1 = require("./adapter/out/redis.adpter");
const user_module_1 = require("../user/user.module");
const config_module_1 = require("../common/config/config.module");
let AuthModule = class AuthModule {
};
exports.AuthModule = AuthModule;
exports.AuthModule = AuthModule = __decorate([
    (0, common_1.Module)({
        imports: [
            jwt_1.JwtModule.register(jwt_config_1.jwtConfig),
            config_module_1.RedisConfigModule,
            user_module_1.UserModule,
        ],
        providers: [
            auth_service_1.AuthService,
            redis_adpter_1.RedisAdapter,
            {
                provide: 'RedisPort',
                useExisting: redis_adpter_1.RedisAdapter,
            },
            jwt_adapter_1.JwtAdapter,
            {
                provide: 'JwtPort',
                useExisting: jwt_adapter_1.JwtAdapter,
            },
        ],
        controllers: [auth_controller_1.AuthController],
        exports: ['RedisPort', 'JwtPort']
    })
], AuthModule);
//# sourceMappingURL=auth.module.js.map