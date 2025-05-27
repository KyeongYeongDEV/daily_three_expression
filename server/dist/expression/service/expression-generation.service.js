"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionGenerationService = void 0;
const common_1 = require("@nestjs/common");
const ai_service_1 = require("../../ai/service/ai.service");
let ExpressionGenerationService = class ExpressionGenerationService {
    aiService;
    expressionPort;
    qdrant;
    constructor(aiService, expressionPort, qdrant) {
        this.aiService = aiService;
        this.expressionPort = expressionPort;
        this.qdrant = qdrant;
    }
    MAX_RETRY = 10;
    TARGET_COUNT = 3;
    async runExpressionGenerationBatch() {
        console.log('✅ Batch Expression Generation started');
        let savedCount = 0;
        for (let attempt = 0; attempt < this.MAX_RETRY; attempt++) {
            const candidates = await this.aiService.getExpressionFromGPT();
            for (const exp of candidates) {
                const similarity = await this.qdrant.searchSimilar(exp.expression);
                if (similarity > 0.9) {
                    console.log(`⚠️ 중복 표현 스킵: ${exp.expression}`);
                    continue;
                }
                const saved = await this.expressionPort.save(exp);
                await this.qdrant.insertEmbedding(saved.e_id, exp.expression);
                console.log(`✅ ${saved.e_id} 저장 완료: ${exp.expression}`);
                savedCount++;
            }
            if (savedCount >= this.TARGET_COUNT) {
                console.log(`🎉 ${savedCount}개 표현 저장 완료`);
                return;
            }
            console.log(`🔁 아직 ${savedCount}/${this.TARGET_COUNT} 저장됨 → GPT 재요청`);
        }
        console.warn(`❗최대 ${this.MAX_RETRY}회 시도했지만 ${savedCount}개만 저장됨`);
    }
};
exports.ExpressionGenerationService = ExpressionGenerationService;
exports.ExpressionGenerationService = ExpressionGenerationService = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('ExpressionPort')),
    __param(2, (0, common_1.Inject)('QdrantPort')),
    __metadata("design:paramtypes", [ai_service_1.AiService, Object, Object])
], ExpressionGenerationService);
//# sourceMappingURL=expression-generation.service.js.map