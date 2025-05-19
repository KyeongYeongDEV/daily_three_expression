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
exports.ExpressionDeliveryRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const expression_entity_1 = require("../entities/expression.entity");
let ExpressionDeliveryRepository = class ExpressionDeliveryRepository {
    datasource;
    constructor(datasource) {
        this.datasource = datasource;
    }
    async findDeliveriedExpressionsByUid(u_id) {
        return await this.datasource
            .getRepository(expression_entity_1.ExpressionEntity)
            .createQueryBuilder('expression')
            .innerJoin('expression.deliveries', 'delivery')
            .where('delivery.u_id = :u_id', { u_id })
            .getMany();
    }
};
exports.ExpressionDeliveryRepository = ExpressionDeliveryRepository;
exports.ExpressionDeliveryRepository = ExpressionDeliveryRepository = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource])
], ExpressionDeliveryRepository);
//# sourceMappingURL=expression-delivery.repository.js.map