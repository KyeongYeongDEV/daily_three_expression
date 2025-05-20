"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpressionModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const expression_controller_1 = require("./expression.controller");
const expression_service_1 = require("./expression.service");
const expression_repository_1 = require("./repository/expression.repository");
const expression_entity_1 = require("./entities/expression.entity");
const expression_delivery_repository_1 = require("./repository/expression-delivery.repository");
let ExpressionModule = class ExpressionModule {
};
exports.ExpressionModule = ExpressionModule;
exports.ExpressionModule = ExpressionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([expression_entity_1.ExpressionEntity])],
        controllers: [expression_controller_1.ExpressionController],
        providers: [expression_service_1.ExpressionService, expression_repository_1.ExpressionRepository, expression_delivery_repository_1.ExpressionDeliveryRepository],
        exports: [expression_repository_1.ExpressionRepository, expression_delivery_repository_1.ExpressionDeliveryRepository],
    })
], ExpressionModule);
//# sourceMappingURL=expression.module.js.map