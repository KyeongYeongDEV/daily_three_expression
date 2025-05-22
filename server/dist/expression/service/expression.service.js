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
exports.ExpressionService = void 0;
const common_1 = require("@nestjs/common");
const expression_port_1 = require("../port/expression.port");
const expression_delivery_port_1 = require("../port/expression-delivery.port");
const response_helper_1 = require("../../common/helpers/response.helper");
let ExpressionService = class ExpressionService {
    expressionPort;
    expressionDeliveryPort;
    constructor(expressionPort, expressionDeliveryPort) {
        this.expressionPort = expressionPort;
        this.expressionDeliveryPort = expressionDeliveryPort;
    }
    async getAllExpressions() {
        try {
            const result = await this.expressionPort.findAll();
            return response_helper_1.ResponseHelper.success(result, '모든 표현들 조회를 성공했습니다.');
        }
        catch (error) {
            console.error('[getAllExpressions]' + error);
            return response_helper_1.ResponseHelper.fail('모든 표현들 조회 중 에러가 발생했습니다.');
        }
    }
    async getExpressionById(id) {
        try {
            const result = await this.expressionPort.findById(id);
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
            const result = await this.expressionPort.findThreeExpressionsByStartId(id);
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
            const result = await this.expressionPort.findThreeExpressionsByStartIdAndCategory(id, category);
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
    async getDeliveriedExpressionsByUid(id) {
        try {
            const result = await this.expressionDeliveryPort.findDeliveriedExpressionsByUid(id);
            return response_helper_1.ResponseHelper.success(result, `${id}에 전송된 모든 표현 조회에 성공했습니다.`);
        }
        catch (error) {
            console.error('[getDeliveriedExpressionsByUid]', error);
            return response_helper_1.ResponseHelper.fail(`${id}에 전송된 모든 표현 조회에 실패했습니다.`);
        }
    }
    async createNewExpression(input) {
        return this.expressionPort.save(input);
    }
};
exports.ExpressionService = ExpressionService;
exports.ExpressionService = ExpressionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(expression_port_1.EXPRESSION_PORT)),
    __param(1, (0, common_1.Inject)(expression_delivery_port_1.EXPRESSION_DELIVERY_PORT)),
    __metadata("design:paramtypes", [Object, Object])
], ExpressionService);
//# sourceMappingURL=expression.service.js.map