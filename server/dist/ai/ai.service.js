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
exports.AiService = void 0;
const common_1 = require("@nestjs/common");
const ai_repository_1 = require("./ai.repository");
const openai_1 = require("openai");
const config_1 = require("@nestjs/config");
let AiService = class AiService {
    aiRepository;
    configService;
    openAi;
    constructor(aiRepository, configService) {
        this.aiRepository = aiRepository;
        this.configService = configService;
        this.openAi = new openai_1.default({
            apiKey: this.configService.get('OPENAI_API_KEY'),
        });
    }
    async generateAndSaveIfUnique(prompt) {
        const expressions = await this.generateFromGPT(prompt);
        const results = [];
        for (const expression of expressions) {
            const vector = await this.getEmbedding(expression);
            const isDup = await this.aiRepository.checkDuplicate(vector);
            if (!isDup) {
                await this.aiRepository.saveExpression(expression, vector);
                results.push(expression);
            }
        }
        return results;
    }
    async generateFromGPT(prompt) {
        const completion = await this.openAi.chat.completions.create({
            model: 'gpt-4-turbo',
            messages: [
                { role: 'system', content: 'You must ONLY respond with a JSON array of 3 English expressions. No explanation.' },
                { role: 'user', content: prompt },
            ],
        });
        const response = completion.choices[0].message?.content;
        try {
            return JSON.parse(response ?? '[]');
        }
        catch (e) {
            console.error('❌ JSON 파싱 실패! GPT 응답:', response);
            return [];
        }
    }
    async getEmbedding(text) {
        const result = await this.openAi.embeddings.create({
            model: 'text-embedding-3-small',
            input: text,
        });
        return result.data[0].embedding;
    }
};
exports.AiService = AiService;
exports.AiService = AiService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [ai_repository_1.AiRepository,
        config_1.ConfigService])
], AiService);
//# sourceMappingURL=ai.service.js.map