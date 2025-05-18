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
exports.QdrantService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const axios_1 = require("axios");
let QdrantService = class QdrantService {
    configService;
    qdrantUrl;
    collectionName;
    constructor(configService) {
        this.configService = configService;
        this.collectionName = this.configService.get('QDRANT_COLLECTION_NAME');
        this.qdrantUrl = this.configService.get('QDRANT_URL');
    }
    async searchSimilarExpression(vector, threshold = 0.95, topK = 5) {
        try {
            const res = await axios_1.default.post(`${this.qdrantUrl}/collections/${this.collectionName}/points/search`, {
                vector,
                top: topK,
                score_threshold: threshold,
            });
            return res.data.result;
        }
        catch (error) {
            console.error(error);
            return [];
        }
    }
    async upserExpressionVector(id, vector, payload) {
        try {
            await axios_1.default.put(`${this.qdrantUrl}/collections/${this.collectionName}/points`, {
                points: [
                    {
                        id,
                        vector,
                        payload,
                    },
                ],
            });
        }
        catch (error) {
            console.error(error);
        }
    }
    async createCollectionIfNotExists() {
        try {
            const res = await axios_1.default.get(`${this.qdrantUrl}/collections`);
            const exists = res.data.result?.some((col) => col.name === this.collectionName);
            if (!exists) {
                await axios_1.default.put(`${this.qdrantUrl}/collections/${this.collectionName}`, {
                    vectors: {
                        size: 1536,
                        distance: 'Cosine'
                    }
                });
                console.log(`[Qdrant] 컬렉션 '${this.collectionName}' 생성 완료 ✅`);
            }
        }
        catch (error) {
            console.error(error);
        }
    }
    async deleteVector(id) {
        try {
            await axios_1.default.post(`${this.qdrantUrl}/collections/${this.collectionName}/points/delete`, {
                points: [id]
            });
        }
        catch (error) {
            console.error(error);
        }
    }
};
exports.QdrantService = QdrantService;
exports.QdrantService = QdrantService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService])
], QdrantService);
//# sourceMappingURL=qdrant.service.js.map