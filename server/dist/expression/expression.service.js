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
exports.ExpressionService = void 0;
const common_1 = require("@nestjs/common");
const expression_repository_1 = require("./expression.repository");
const response_helper_1 = require("../common/helpers/response.helper");
let ExpressionService = class ExpressionService {
    expressionRepository;
    constructor(expressionRepository) {
        this.expressionRepository = expressionRepository;
    }
    async getAllExpressions() {
        try {
            const result = await this.expressionRepository.findAll();
            return response_helper_1.ResponseHelper.success(result, '모든 표현들 조회를 성공했습니다.');
        }
        catch (error) {
            console.error('[getAllExpressions]' + error);
            return response_helper_1.ResponseHelper.fail('모든 표현들 조회 중 에러가 발생했습니다.');
        }
    }
    async getExpressionById(id) {
        try {
            const result = await this.expressionRepository.findById(id);
            if (!result) {
                throw new common_1.NotFoundException(`${id}라는 id를 가진 표현은 없습니다.`);
            }
            return response_helper_1.ResponseHelper.success(result, `id : ${id} 조회를 성공했습니다.`);
        }
        catch (error) {
            console.error('[getExpressionById]' + error);
            return response_helper_1.ResponseHelper.fail('하나의 표현 조회 중 에러가 발생했습니다');
        }
    }
    async getThreeExpressionsByStartId(id) {
        try {
            const result = await this.expressionRepository.findThreeExpressionsByStartId(id);
            if (!result) {
                throw new common_1.NotFoundException(`${id}라는 id를 가진 표현은 없습니다.`);
            }
            return response_helper_1.ResponseHelper.success(result, `id ${id}부터 표현 3개 조회를 성공했습니다.`);
        }
        catch (error) {
            console.error(`[getThreeExpressionsByStartId]` + error);
            return response_helper_1.ResponseHelper.fail(`id ${id}부터 표현 3개 조회 중 에러가 발생했습니다.`);
        }
    }
    async getThreeExpressionsByStartIdAndCategory(id, category) {
        try {
            const result = await this.expressionRepository.findThreeExpressionsByStartIdAndCategory(id, category);
            if (!result) {
                throw new common_1.NotFoundException(`${id}라는 id를 가진 표현은 없습니다.`);
            }
            return response_helper_1.ResponseHelper.success(result, `${category}에서 id ${id}로 시작하는 표현 3개 조회를 성공했습니다`);
        }
        catch (error) {
            console.error('[getThreeExpressionsByStartIdAndCategory]', error);
            return response_helper_1.ResponseHelper.fail(`${category}에서 id ${id}로 시작하는 표현 3개 조회 중 에러가 발생했습니다`);
        }
    }
    async createNewExpression(input) {
        return this.expressionRepository.save(input);
    }
};
exports.ExpressionService = ExpressionService;
exports.ExpressionService = ExpressionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [expression_repository_1.ExpressionRepository])
], ExpressionService);
//# sourceMappingURL=expression.service.js.map