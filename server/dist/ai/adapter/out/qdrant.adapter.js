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
exports.QdrantAdapter = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const ai_service_1 = require("../../service/ai.service");
let QdrantAdapter = class QdrantAdapter {
    httpService;
    aiService;
    expressionPort;
    COLLECTION = 'expressions';
    constructor(httpService, aiService, expressionPort) {
        this.httpService = httpService;
        this.aiService = aiService;
        this.expressionPort = expressionPort;
    }
    async insertEmbedding(id, text) {
        const vector = await this.aiService.getEmbedding(text);
        if (!vector || vector.length === 0)
            return;
        const payload = {
            points: [
                {
                    id,
                    vector,
                    payload: { id },
                },
            ],
        };
        await (0, rxjs_1.firstValueFrom)(this.httpService.put(`http://localhost:6333/collections/${this.COLLECTION}/points`, payload));
    }
    async trySaveIfNotSimilar(expression) {
        const similarity = await this.searchSimilar(expression.expression);
        if (similarity > 0.9) {
            const result = await this.expressionPort.saveExpressionBlackList(expression.expression);
            console.warn(`⚠️ 중복 표현 스킵: ${expression.expression}`);
            return result.expression;
        }
        const saved = await this.expressionPort.save(expression);
        await this.insertEmbedding(saved.e_id, expression.expression);
        console.log(`✅ ${saved.e_id} 저장 완료: ${expression.expression}`);
        return `✅ 저장됨: ${expression.expression}`;
    }
    async searchSimilar(text) {
        const vector = await this.aiService.getEmbedding(text);
        if (!vector || vector.length === 0)
            return 0;
        const payload = {
            vector,
            limit: 1,
            with_payload: false,
        };
        const res = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`http://localhost:6333/collections/${this.COLLECTION}/points/search`, payload));
        return res.data.result?.[0]?.score ?? 0;
    }
    async syncAllExpressionsToQdrant() {
        const expressions = await this.expressionPort.findAll();
        for (const exp of expressions) {
            const embedding = await this.aiService.getEmbedding(exp.expression);
            if (!embedding || embedding.length === 0)
                continue;
            const payload = {
                points: [
                    {
                        id: exp.e_id,
                        vector: embedding,
                        payload: { id: exp.e_id },
                    },
                ],
            };
            await (0, rxjs_1.firstValueFrom)(this.httpService.put(`http://localhost:6333/collections/${this.COLLECTION}/points`, payload));
            console.log(`✅ Qdrant 업로드 완료: ${exp.e_id}`);
        }
        console.log(`🎉 총 ${expressions.length}개 표현 동기화 완료`);
    }
    async deleteAllPoints() {
        const payload = {
            filter: {
                must: [],
            },
        };
        await (0, rxjs_1.firstValueFrom)(this.httpService.post(`http://localhost:6333/collections/${this.COLLECTION}/points/delete`, payload));
        console.log(`🧹 Qdrant '${this.COLLECTION}' 컬렉션 전체 삭제 완료`);
    }
};
exports.QdrantAdapter = QdrantAdapter;
exports.QdrantAdapter = QdrantAdapter = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)('ExpressionPort')),
    __metadata("design:paramtypes", [axios_1.HttpService,
        ai_service_1.AiService, Object])
], QdrantAdapter);
//# sourceMappingURL=qdrant.adapter.js.map