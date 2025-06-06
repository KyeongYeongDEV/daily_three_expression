"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MailerAdapter = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = __importStar(require("nodemailer"));
const config_1 = require("@nestjs/config");
const expression_mail_template_1 = require("../../templates/expression-mail.template");
const verify_code_template_1 = require("../../templates/verify-code.template");
let MailerAdapter = class MailerAdapter {
    configService;
    expressionPort;
    expressionDeliveryPort;
    userPort;
    transporter;
    constructor(configService, expressionPort, expressionDeliveryPort, userPort) {
        this.configService = configService;
        this.expressionPort = expressionPort;
        this.expressionDeliveryPort = expressionDeliveryPort;
        this.userPort = userPort;
        this.transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: this.configService.get('MAIL_USER'),
                pass: this.configService.get('MAIL_PASS'),
            },
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
            rateLimit: 5,
        });
    }
    getYesterdayAndStart() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const yesterday = new Date(today);
        yesterday.setDate(today.getDate() - 1);
        return { today, yesterday };
    }
    async sendExpression() {
        const users = await this.userPort.findAllUsersEmail();
        const { today, yesterday } = this.getYesterdayAndStart();
        const startEid = await this.expressionDeliveryPort.findStartExpressionId();
        const expressions = await this.expressionPort.findThreeExpressionsByStartId(startEid);
        const html = (0, expression_mail_template_1.buildExpressionMailTemplate)(expressions);
        const todayLastDliveriedId = startEid + 3;
        const mailSender = this.configService.get('MAIL_USER');
        for (const user of users) {
            const info = await this.transporter.sendMail({
                from: `"하삼영" ${mailSender}`,
                to: user.email,
                subject: '[하삼영] 오늘의 표현 3개입니다!',
                html,
            });
            await this.expressionDeliveryPort.saveExpressionDeliveried(user.u_id, todayLastDliveriedId, 'success');
            console.log(`✅ Email sent to ${user}:`, info.messageId);
        }
    }
    async sendEmailVerificationCode(to, code) {
        const html = (0, verify_code_template_1.buildVerificationCodeTemplate)(code);
        const info = await this.transporter.sendMail({
            from: `"하삼영" <${this.configService.get('MAIL_USER')}>`,
            to,
            subject: '[하삼영] 이메일 인증 코드입니다.',
            html,
        });
        console.log('✅ 인증 코드 메일 전송 완료:', info.messageId);
        return info.accepted.length > 0;
    }
};
exports.MailerAdapter = MailerAdapter;
exports.MailerAdapter = MailerAdapter = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('ExpressionPort')),
    __param(2, (0, common_1.Inject)('ExpressionDeliveryPort')),
    __param(3, (0, common_1.Inject)('UserPort')),
    __metadata("design:paramtypes", [config_1.ConfigService, Object, Object, Object])
], MailerAdapter);
//# sourceMappingURL=mailer.adapter.js.map