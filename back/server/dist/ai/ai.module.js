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
const ai_controller_1 = require("./adapter/In/ai.controller");
const openai_adapter_1 = require("./adapter/out/openai.adapter");
const config_1 = require("@nestjs/config");
const typeorm_1 = require("@nestjs/typeorm");
const expression_entity_1 = require("../expression/domain/expression.entity");
const qdrant_adapter_1 = require("./adapter/out/qdrant.adapter");
const axios_1 = require("@nestjs/axios");
const expression_adapter_1 = require("src/expression/adapter/out/expression.adapter");
const expression_module_1 = require("src/expression/expression.module");
const expression_black_list_entity_1 = require("src/expression/domain/expression-black-list.entity");
const gemini_adapter_1 = require("./adapter/out/gemini.adapter");
const ai_service_1 = require("./service/ai.service");
const commom_module_1 = require("src/common/commom.module");
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
            commom_module_1.CommonModule,
            (0, common_1.forwardRef)(() => expression_module_1.ExpressionModule),
        ],
        controllers: [ai_controller_1.AiController],
        providers: [
            openai_adapter_1.OpenaiAdapter,
            gemini_adapter_1.GeminiAdapter,
            ai_service_1.AiService,
            qdrant_adapter_1.QdrantAdapter,
            {
                provide: 'QdrantPort',
                useClass: qdrant_adapter_1.QdrantAdapter,
            },
            {
                provide: 'ExpressionPort',
                useClass: expression_adapter_1.ExpressionAdapter,
            },
            {
                provide: 'GeminiPort',
                useClass: gemini_adapter_1.GeminiAdapter,
            },
            {
                provide: 'OpenaiPort',
                useClass: openai_adapter_1.OpenaiAdapter,
            },
        ],
        exports: [
            openai_adapter_1.OpenaiAdapter,
            ai_service_1.AiService,
            {
                provide: 'QdrantPort',
                useClass: qdrant_adapter_1.QdrantAdapter,
            },
            {
                provide: 'ExpressionPort',
                useClass: expression_adapter_1.ExpressionAdapter,
            },
            {
                provide: 'GeminiPort',
                useClass: gemini_adapter_1.GeminiAdapter,
            },
            {
                provide: 'OpenaiPort',
                useClass: openai_adapter_1.OpenaiAdapter,
            },
        ]
    })
], AiModule);
;
//# sourceMappingURL=ai.module.js.map