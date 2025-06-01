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
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiController = void 0;
const common_1 = require("@nestjs/common");
const openAi_service_1 = require("./service/openAi.service");
const qdrant_adapter_1 = require("./adapter/out/qdrant.adapter");
let AiController = class AiController {
    aiService;
    qdrant;
    constructor(aiService, qdrant) {
        this.aiService = aiService;
        this.qdrant = qdrant;
    }
    async testGenerate() {
    }
    async syncAllExpressionsToQdrant() {
        this.qdrant.syncAllExpressionsToQdrant();
        return { message: '모든 표현식이 Qdrant에 동기화되었습니다.' };
    }
    async generateUniqueExpressions() {
    }
    async deleteAllExpressionsFromQdrant() {
        await this.qdrant.deleteAllPoints();
        return { message: '모든 표현식이 Qdrant에서 삭제되었습니다.' };
    }
};
exports.AiController = AiController;
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "testGenerate", null);
__decorate([
    (0, common_1.Post)('save/all/expressions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "syncAllExpressionsToQdrant", null);
__decorate([
    (0, common_1.Post)('generate'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "generateUniqueExpressions", null);
__decorate([
    (0, common_1.Delete)('all/expressions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AiController.prototype, "deleteAllExpressionsFromQdrant", null);
exports.AiController = AiController = __decorate([
    (0, common_1.Controller)('ai'),
    __param(1, (0, common_1.Inject)('QdrantPort')),
    __metadata("design:paramtypes", [typeof (_a = typeof openAi_service_1.AiService !== "undefined" && openAi_service_1.AiService) === "function" ? _a : Object, qdrant_adapter_1.QdrantAdapter])
], AiController);
//# sourceMappingURL=ai.controller.js.map