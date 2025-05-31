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
    constructor(mailSender) {
        this.mailSender = mailSender;
    }
    async sendTestEmails() {
        try {
            await this.mailSender.sendExpression();
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
    __metadata("design:paramtypes", [Object])
], BatchMailService);
//# sourceMappingURL=batch.service.js.map