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
exports.ExpressionDeliveryAdapter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const expression_delivery_entity_1 = require("../../domain/expression-delivery.entity");
const typeorm_2 = require("@nestjs/typeorm");
let ExpressionDeliveryAdapter = class ExpressionDeliveryAdapter {
    expressionDeliveryRepository;
    constructor(expressionDeliveryRepository) {
        this.expressionDeliveryRepository = expressionDeliveryRepository;
    }
    async findDeliveriedExpressionsByUid(u_id) {
        const deliveredExpressions = await this.expressionDeliveryRepository
            .createQueryBuilder('delivery')
            .innerJoinAndSelect('delivery.expression', 'expression')
            .innerJoin('delivery.user', 'user')
            .where('user.u_id = :u_id', { u_id })
            .getMany();
        return deliveredExpressions.map(delivery => delivery.expression);
    }
    async findStartExpressionId(today, yesterday) {
        const result = await this.expressionDeliveryRepository
            .createQueryBuilder('delivery')
            .select('delivery.e_id', 'e_id')
            .where('delivery.transmitted_at >= :yesterdayStart', { yesterdayStart: yesterday })
            .andWhere('delivery.transmitted_at < :todayStart', { todayStart: today })
            .andWhere('delivery.delivery_status = :status', { status: 'success' })
            .orderBy('delivery.ue_id', 'ASC')
            .getRawOne();
        return result ? result.e_id : 0;
    }
    async saveExpressionDeliveried(u_id, e_id, deliveryStatus) {
        await this.expressionDeliveryRepository.save({
            transmitted_at: new Date(),
            delivery_status: deliveryStatus,
            u_id: u_id,
            e_id: e_id,
        });
    }
};
exports.ExpressionDeliveryAdapter = ExpressionDeliveryAdapter;
exports.ExpressionDeliveryAdapter = ExpressionDeliveryAdapter = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(expression_delivery_entity_1.ExpressionDeliveryEntity)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ExpressionDeliveryAdapter);
//# sourceMappingURL=expression-delivery.adapter.js.map