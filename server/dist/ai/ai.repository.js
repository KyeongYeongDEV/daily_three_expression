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
exports.AiRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
let AiRepository = class AiRepository {
    dataSource;
    constructor(dataSource) {
        this.dataSource = dataSource;
    }
    async checkDuplicate(vector) {
        const rows = await this.dataSource.query('SELECT expression, embedding FROM expression_embeddings');
        for (const row of rows) {
            const existing = JSON.parse(row.embedding);
            const similarity = this.cosineSimilarity(existing, vector);
            if (similarity > 0.9)
                return true;
        }
        return false;
    }
    async saveExpression(expression, vector) {
        await this.dataSource.query('INSERT INTO expression_embeddings (expression, embedding) VALUES (?, ?)', [expression, JSON.stringify(vector)]);
    }
    cosineSimilarity(a, b) {
        const dot = a.reduce((sum, val, i) => sum + val * b[i], 0);
        const normA = Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
        const normB = Math.sqrt(b.reduce((sum, val) => sum + val * val, 0));
        return dot / (normA * normB);
    }
};
exports.AiRepository = AiRepository;
exports.AiRepository = AiRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], AiRepository);
//# sourceMappingURL=ai.repository.js.map