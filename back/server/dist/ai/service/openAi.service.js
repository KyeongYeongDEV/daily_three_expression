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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpenAiService = void 0;
const common_1 = require("@nestjs/common");
const openai_1 = __importDefault(require("openai"));
const config_1 = require("@nestjs/config");
const openAI_helper_1 = require("../../common/helpers/openAI.helper");
let OpenAiService = class OpenAiService {
    expressionPort;
    configService;
    openAi;
    constructor(expressionPort, configService) {
        this.expressionPort = expressionPort;
        this.configService = configService;
        this.openAi = new openai_1.default({
            apiKey: this.configService.get('OPENAI_API_KEY'),
        });
    }
    async getExpressionFromGPT() {
        try {
            const content = this.configService.get('OPENAI_CONTENT');
            let prompt = this.configService.get('OPENAI_PROMPT');
            const blacklist = await this.expressionPort.findTop5BlacklistedExpressions();
            if (blacklist.length > 0) {
                const exclusions = blacklist.map(exp => `- "${exp}"`).join('\n');
                prompt += `Absolutely avoid using any of the following expressions:\n${exclusions}`;
            }
            const completion = await this.openAi.chat.completions.create({
                model: 'gpt-4-1106-preview',
                temperature: 0.7,
                messages: [
                    { role: 'system', content },
                    { role: 'user', content: prompt },
                ],
                functions: openAI_helper_1.functions,
                function_call: { name: 'returnExpressions' },
            });
            let raw = completion.choices[0].message?.function_call?.arguments ?? '{}';
            const cleaned = raw
                .replace(/\\n/g, '')
                .replace(/\\"/g, '"')
                .replace(/\\u[\dA-F]{4}/gi, '')
                .trim();
            const parsed = JSON.parse(cleaned);
            const validExpressions = (parsed.expressions ?? []).filter((e) => e.translation_expression?.trim() &&
                e.translation_example1?.trim() &&
                e.translation_example2?.trim());
            console.log('✅ GPT 응답 파싱 성공:', validExpressions);
            return validExpressions;
        }
        catch (error) {
            console.error('❌ GPT 응답 파싱 실패:', error instanceof Error ? error.message : error);
            return [];
        }
    }
    async getEmbedding(text) {
        try {
            if (typeof text !== 'string' || !text.trim()) {
                throw new Error(`❌ getEmbedding input 오류: '${text}'`);
            }
            const result = await this.openAi.embeddings.create({
                model: 'text-embedding-3-small',
                input: text,
            });
            return result.data[0].embedding;
        }
        catch (error) {
            console.error('❌ 임베딩 실패:', error);
            return [];
        }
    }
};
exports.OpenAiService = OpenAiService;
exports.OpenAiService = OpenAiService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ExpressionPort')),
    __metadata("design:paramtypes", [Object, config_1.ConfigService])
], OpenAiService);
//# sourceMappingURL=openAi.service.js.map