"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const batch_service_1 = require("./service/batch.service");
const mailer_adapter_1 = require("./adapter/out/mailer.adapter");
const batch_scheduler_1 = require("./scheduler/batch.scheduler");
const user_entity_1 = require("../user/domain/user.entity");
const expression_entity_1 = require("../expression/domain/expression.entity");
const expression_adapter_1 = require("../expression/adapter/out/expression.adapter");
const typeorm_user_adapter_1 = require("../user/adpater/out/typeorm-user.adapter");
const ai_module_1 = require("../ai/ai.module");
const expression_module_1 = require("../expression/expression.module");
let BatchModule = class BatchModule {
};
exports.BatchModule = BatchModule;
exports.BatchModule = BatchModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([user_entity_1.UserEntity, expression_entity_1.ExpressionEntity]),
            ai_module_1.AiModule,
            (0, common_1.forwardRef)(() => expression_module_1.ExpressionModule),
        ],
        providers: [
            batch_service_1.BatchMailService,
            mailer_adapter_1.MailerAdapter,
            batch_scheduler_1.BatchMailScheduler,
            {
                provide: 'ExpressionPort',
                useExisting: expression_adapter_1.TypeOrmExpressionAdapter,
            },
            {
                provide: 'UserPort',
                useClass: typeorm_user_adapter_1.TypeOrmUserAdapter,
            },
            {
                provide: 'SendMailPort',
                useClass: mailer_adapter_1.MailerAdapter,
            },
        ],
    })
], BatchModule);
//# sourceMappingURL=batch.module.js.map