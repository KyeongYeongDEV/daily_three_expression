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
const expression_controller_1 = require("./adapter/in/expression.controller");
const expression_service_1 = require("./service/expression.service");
const expression_entity_1 = require("./domain/expression.entity");
const expression_port_1 = require("./port/expression.port");
const expression_delivery_port_1 = require("./port/expression-delivery.port");
const expression_adapter_1 = require("./adapter/out/expression.adapter");
const expression_delivery_adapter_1 = require("./adapter/out/expression-delivery.adapter");
let ExpressionModule = class ExpressionModule {
};
exports.ExpressionModule = ExpressionModule;
exports.ExpressionModule = ExpressionModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([expression_entity_1.ExpressionEntity])],
        controllers: [expression_controller_1.ExpressionController],
        providers: [
            expression_service_1.ExpressionService,
            expression_adapter_1.TypeOrmExpressionAdapter,
            expression_delivery_adapter_1.TypeOrmExpressionDeliveryAdapter,
            {
                provide: expression_port_1.EXPRESSION_PORT,
                useExisting: expression_adapter_1.TypeOrmExpressionAdapter,
            },
            {
                provide: expression_delivery_port_1.EXPRESSION_DELIVERY_PORT,
                useExisting: expression_delivery_adapter_1.TypeOrmExpressionDeliveryAdapter,
            },
        ],
        exports: [expression_service_1.ExpressionService],
    })
], ExpressionModule);
//# sourceMappingURL=expression.module.js.map