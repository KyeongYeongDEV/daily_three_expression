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
    expressionPort;
    userPort;
    mailSender;
    constructor(expressionPort, userPort, mailSender) {
        this.expressionPort = expressionPort;
        this.userPort = userPort;
        this.mailSender = mailSender;
    }
    async sendTestEmails() {
        const users = await this.userPort.findAllUsersEmail();
        const expressions = await this.expressionPort.findThreeExpressionsByStartId(1);
        const html = `
    <h3>🔥 오늘의 표현</h3>
    <ul>
      ${expressions
            .map((e) => `
            <li><b>${e.expression}</b> - ${e.translation_expression}</li>
            <li>${e.example1} - ${e.translation_example1}</li>
            <li>${e.example2} - ${e.translation_example2}</li>
            <br/>
          `)
            .join('')}
    </ul>
  `;
        for (const user of users) {
            await this.mailSender.send(user, '오늘의 표현 3개입니다!', html);
        }
    }
};
exports.BatchMailService = BatchMailService;
exports.BatchMailService = BatchMailService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('ExpressionPort')),
    __param(1, (0, common_1.Inject)('UserPort')),
    __param(2, (0, common_1.Inject)('SendMailPort')),
    __metadata("design:paramtypes", [Object, Object, Object])
], BatchMailService);
//# sourceMappingURL=batch.service.js.map