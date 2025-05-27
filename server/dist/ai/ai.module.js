"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
const common_1 = require("@nestjs/common");
const ai_controller_1 = require("./ai.controller");
const ai_service_1 = require("./service/ai.service");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const expression_entity_1 = require("../expression/domain/expression.entity");
const qdrant_adapter_1 = require("./adapter/out/qdrant.adapter");
const axios_1 = require("@nestjs/axios");
const expression_adapter_1 = require("../expression/adapter/out/expression.adapter");
const expression_module_1 = require("../expression/expression.module");
const expression_black_list_entity_1 = require("../expression/domain/expression-black-list.entity");
let AiModule = class AiModule {
};
exports.AiModule = AiModule;
exports.AiModule = AiModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                expression_entity_1.ExpressionEntity,
                expression_black_list_entity_1.ExpressionBlackListEntity,
            ]),
            config_1.ConfigModule,
            axios_1.HttpModule,
            (0, common_1.forwardRef)(() => expression_module_1.ExpressionModule),
        ],
        controllers: [ai_controller_1.AiController],
        providers: [
            ai_service_1.AiService,
            qdrant_adapter_1.QdrantAdapter,
            {
                provide: 'QdrantPort',
                useClass: qdrant_adapter_1.QdrantAdapter,
            },
            {
                provide: 'ExpressionPort',
                useClass: expression_adapter_1.TypeOrmExpressionAdapter,
            },
        ],
        exports: [
            ai_service_1.AiService,
            {
                provide: 'QdrantPort',
                useClass: qdrant_adapter_1.QdrantAdapter,
            },
            {
                provide: 'ExpressionPort',
                useClass: expression_adapter_1.TypeOrmExpressionAdapter,
            },
        ]
    })
], AiModule);
;
//# sourceMappingURL=ai.module.js.map