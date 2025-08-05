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
const openai_adapter_1 = require("./openai.adapter");
let QdrantAdapter = class QdrantAdapter {
    httpService;
    openaiAdapter;
    expressionPort;
    COLLECTION = 'expressions';
    constructor(httpService, openaiAdapter, expressionPort) {
        this.httpService = httpService;
        this.openaiAdapter = openaiAdapter;
        this.expressionPort = expressionPort;
    }
    async insertEmbedding(id, text) {
        const vector = await this.openaiAdapter.getEmbedding(text);
        if (!vector?.length)
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
        await (0, rxjs_1.firstValueFrom)(this.httpService.put(`http://qdrant-server:6333/collections/${this.COLLECTION}/points`, payload));
    }
    async searchSimilar(text) {
        const vector = await this.openaiAdapter.getEmbedding(text);
        if (!vector?.length)
            return 0;
        const payload = {
            vector,
            limit: 1,
            with_payload: false,
        };
        const res = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`http://qdrant-server:6333/collections/${this.COLLECTION}/points/search`, payload));
        return res.data.result?.[0]?.score ?? 0;
    }
    async deleteAllPoints() {
        const payload = { filter: { must: [] } };
        await (0, rxjs_1.firstValueFrom)(this.httpService.post(`http://qdrant-server:6333/collections/${this.COLLECTION}/points/delete`, payload));
        console.log(`Qdrant 컬렉션 전체 삭제 완료`);
    }
    async syncAllExpressionsToQdrant() {
        const expressions = await this.expressionPort.findAll();
        for (const exp of expressions) {
            await this.insertEmbedding(exp.e_id, exp.expression);
        }
        console.log(`Qdrant 전체 동기화 완료`);
    }
};
exports.QdrantAdapter = QdrantAdapter;
exports.QdrantAdapter = QdrantAdapter = __decorate([
    (0, common_1.Injectable)(),
    __param(2, (0, common_1.Inject)('ExpressionPort')),
    __metadata("design:paramtypes", [axios_1.HttpService,
        openai_adapter_1.OpenaiAdapter, Object])
], QdrantAdapter);
//# sourceMappingURL=qdrant.adapter.js.map