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
exports.ExpressionDelivery = void 0;
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../../user/entities/user.entity");
const expression_entity_1 = require("./expression.entity");
let ExpressionDelivery = class ExpressionDelivery {
    ue_id;
    transmitted_at;
    delivery_status;
    user;
    expression;
};
exports.ExpressionDelivery = ExpressionDelivery;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ExpressionDelivery.prototype, "ue_id", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'date' }),
    __metadata("design:type", Date)
], ExpressionDelivery.prototype, "transmitted_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ type: 'enum', enum: ['success', 'failed', 'pending'], default: 'pending' }),
    __metadata("design:type", String)
], ExpressionDelivery.prototype, "delivery_status", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => user_entity_1.User, (user) => user.deliveries),
    (0, typeorm_1.JoinColumn)({ name: 'u_id' }),
    __metadata("design:type", user_entity_1.User)
], ExpressionDelivery.prototype, "user", void 0);
__decorate([
    (0, typeorm_1.ManyToOne)(() => expression_entity_1.ExpressionEntity, (expression) => expression.deliveries),
    (0, typeorm_1.JoinColumn)({ name: 'e_id' }),
    __metadata("design:type", expression_entity_1.ExpressionEntity)
], ExpressionDelivery.prototype, "expression", void 0);
exports.ExpressionDelivery = ExpressionDelivery = __decorate([
    (0, typeorm_1.Entity)('expression_delivery')
], ExpressionDelivery);
//# sourceMappingURL=expression-delivery.entity.js.map