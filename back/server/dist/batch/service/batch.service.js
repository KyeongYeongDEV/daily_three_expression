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
exports.BatchMailService = void 0;
const common_1 = require("@nestjs/common");
let BatchMailService = class BatchMailService {
    mailSender;
    expressionPort;
    expressionDeliveryPort;
    userPort;
    authService;
    constructor(mailSender, expressionPort, expressionDeliveryPort, userPort, authService) {
        this.mailSender = mailSender;
        this.expressionPort = expressionPort;
        this.expressionDeliveryPort = expressionDeliveryPort;
        this.userPort = userPort;
        this.authService = authService;
    }
    async sendEmails() {
        try {
            const users = await this.userPort.findAllUsersEmail();
            const startEid = await this.expressionDeliveryPort.findStartExpressionId();
            const expressions = await this.expressionPort.findThreeExpressionsByStartId(startEid);
            if (!expressions || expressions.length !== 3) {
                console.warn('[SKIP] 표현 3개를 정상적으로 불러오지 못했습니다. 메일 전송 중단');
                return;
            }
            const usersWithUuid = await this.authService.createUuidTokenForEmails(users);
            const todayLastDeliveriedId = expressions[2].e_id;
            await this.mailSender.sendExpression(usersWithUuid, expressions, todayLastDeliveriedId);
        }
        catch (error) {
            console.error('Error sending test emails:', error);
            throw new Error('Failed to send test emails');
        }
    }
};
exports.BatchMailService = BatchMailService;
exports.BatchMailService = BatchMailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('SendMailPort')),
    __param(1, (0, common_1.Inject)('ExpressionPort')),
    __param(2, (0, common_1.Inject)('ExpressionDeliveryPort')),
    __param(3, (0, common_1.Inject)('UserPort')),
    __param(4, (0, common_1.Inject)('AuthServicePort')),
    __metadata("design:paramtypes", [Object, Object, Object, Object, Object])
], BatchMailService);
//# sourceMappingURL=batch.service.js.map