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
exports.BatchMailScheduler = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const batch_service_1 = require("../service/batch.service");
const expression_generation_service_1 = require("../../expression/service/expression-generation.service");
let BatchMailScheduler = class BatchMailScheduler {
    batchService;
    expressionGenerator;
    constructor(batchService, expressionGenerator) {
        this.batchService = batchService;
        this.expressionGenerator = expressionGenerator;
    }
    async handleCron() {
        await this.batchService.sendTestEmails();
    }
};
exports.BatchMailScheduler = BatchMailScheduler;
__decorate([
    (0, schedule_1.Cron)('*/1 * * * *'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BatchMailScheduler.prototype, "handleCron", null);
exports.BatchMailScheduler = BatchMailScheduler = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [batch_service_1.BatchMailService,
        expression_generation_service_1.ExpressionGenerationService])
], BatchMailScheduler);
//# sourceMappingURL=batch.scheduler.js.map