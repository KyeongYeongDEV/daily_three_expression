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
Object.defineProperty(exports, "__esModule", { value: true });
exports.QdrantAdapter = void 0;
const axios_1 = require("@nestjs/axios");
const common_1 = require("@nestjs/common");
const rxjs_1 = require("rxjs");
const ai_service_1 = require("../../service/ai.service");
let QdrantAdapter = class QdrantAdapter {
    httpService;
    aiService;
    COLLECTION = 'expressions';
    constructor(httpService, aiService) {
        this.httpService = httpService;
        this.aiService = aiService;
    }
    async searchSimilar(text) {
        const vector = await this.aiService.getEmbedding(text);
        const payload = {
            vector,
            limit: 1,
            with_payload: false,
        };
        const res = await (0, rxjs_1.firstValueFrom)(this.httpService.post(`http://localhost:6333/collections/${this.COLLECTION}/points/search`, payload));
        return res.data.result?.[0]?.score ?? 0;
    }
    async insertEmbedding(id, text) {
        const vector = await this.aiService.getEmbedding(text);
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
};
exports.QdrantAdapter = QdrantAdapter;
exports.QdrantAdapter = QdrantAdapter = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [axios_1.HttpService,
        ai_service_1.AiService])
], QdrantAdapter);
//# sourceMappingURL=qdrant.adapter.js.map