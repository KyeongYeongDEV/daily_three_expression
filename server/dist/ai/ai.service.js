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
function decodeUnicode(str) {
    return str.replace(/\\u[\dA-F]{4}/gi, (match) => String.fromCharCode(parseInt(match.replace(/\\u/g, ''), 16)));
}
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
    async generateAndSaveIfUnique() {
        const expressions = await this.generateFromGPT();
        const results = [];
        if (!Array.isArray(expressions)) {
            console.error('❗ GPT 응답이 배열이 아닙니다:', expressions);
            return [];
        }
        for (const expression of expressions) {
            const text = expression.expression ?? expression;
            const vector = await this.getEmbedding(text);
            const isDup = await this.aiRepository.checkDuplicate(vector);
            if (!isDup) {
                await this.aiRepository.saveExpression(expression, vector);
                results.push(text);
            }
        }
        return results;
    }
    async generateFromGPT() {
        const discriptions = this.configService.get('OPENAI_DESCRIPTION');
        const content = this.configService.get('OPENAI_CONTENT');
        const prompts = this.configService.get('OPENAI_PROMPT');
        const functions = [
            {
                name: 'returnExpressions',
                description: discriptions,
                parameters: {
                    type: 'object',
                    properties: {
                        expressions: {
                            type: 'array',
                            items: {
                                type: 'object',
                                properties: {
                                    category: { type: 'string' },
                                    expression: { type: 'string' },
                                    example1: { type: 'string' },
                                    example2: { type: 'string' },
                                    translation_expression: { type: 'string' },
                                    translation_example1: { type: 'string' },
                                    translation_example2: { type: 'string' },
                                },
                                required: [
                                    'category',
                                    'expression',
                                    'example1',
                                    'example2',
                                    'translation_expression',
                                    'translation_example1',
                                    'translation_example2'
                                ],
                            },
                        },
                    },
                    required: ['expressions'],
                },
            },
        ];
        const completion = await this.openAi.chat.completions.create({
            model: 'gpt-4-1106-preview',
            messages: [
                {
                    role: 'system',
                    content: content,
                },
                { role: 'user', content: prompts },
            ],
            functions,
            function_call: { name: 'returnExpressions' },
        });
        let response = completion.choices[0].message?.function_call?.arguments ?? '{}';
        console.log(response);
        try {
            response = decodeUnicode(response);
            const parsed = JSON.parse(response);
            return parsed.expressions ?? [];
        }
        catch (e) {
            console.error('❌ JSON 파싱 실패 (function call 응답):', response);
            return [];
        }
    }
    async getEmbedding(text) {
        if (typeof text !== 'string' || !text.trim()) {
            throw new Error(`❌ getEmbedding input 오류: '${text}'`);
        }
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