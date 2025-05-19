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
exports.ExpressionEntity = void 0;
const typeorm_1 = require("typeorm");
const expression_delivery_entity_1 = require("./expression-delivery.entity");
let ExpressionEntity = class ExpressionEntity {
    e_id;
    expression_number;
    category;
    expression;
    example1;
    example2;
    translation_expression;
    translation_example1;
    translation_example2;
    created_at;
    is_active;
    deliveries;
};
exports.ExpressionEntity = ExpressionEntity;
__decorate([
    (0, typeorm_1.PrimaryGeneratedColumn)(),
    __metadata("design:type", Number)
], ExpressionEntity.prototype, "e_id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", Number)
], ExpressionEntity.prototype, "expression_number", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExpressionEntity.prototype, "category", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExpressionEntity.prototype, "expression", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExpressionEntity.prototype, "example1", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExpressionEntity.prototype, "example2", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExpressionEntity.prototype, "translation_expression", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExpressionEntity.prototype, "translation_example1", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], ExpressionEntity.prototype, "translation_example2", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)({ type: 'timestamp' }),
    __metadata("design:type", Date)
], ExpressionEntity.prototype, "created_at", void 0);
__decorate([
    (0, typeorm_1.Column)({ default: true }),
    __metadata("design:type", Boolean)
], ExpressionEntity.prototype, "is_active", void 0);
__decorate([
    (0, typeorm_1.OneToMany)(() => expression_delivery_entity_1.ExpressionDelivery, (delivery) => delivery.expression),
    __metadata("design:type", Array)
], ExpressionEntity.prototype, "deliveries", void 0);
exports.ExpressionEntity = ExpressionEntity = __decorate([
    (0, typeorm_1.Entity)('expression')
], ExpressionEntity);
//# sourceMappingURL=expression.entity.js.map