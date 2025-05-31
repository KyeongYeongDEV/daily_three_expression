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
exports.MailerAdapter = void 0;
const common_1 = require("@nestjs/common");
const nodemailer = require("nodemailer");
const config_1 = require("@nestjs/config");
let MailerAdapter = class MailerAdapter {
    configService;
    expressionPort;
    userPort;
    transporter;
    constructor(configService, expressionPort, userPort) {
        this.configService = configService;
        this.expressionPort = expressionPort;
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
    async sendExpression() {
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
            const info = await this.transporter.sendMail({
                from: `"Daily Expression!" <${this.configService.get('MAIL_USER')}>`,
                to: user,
                subject: '오늘의 표현 3개입니다!',
                html,
            });
            console.log(`✅ Email sent: ${user}`, info.messageId);
        }
    }
    async sendEmailVerificationCode(to, code) {
        const html = `
      <h2>이메일 인증 코드</h2>
      <p>아래 코드를 입력해주세요:</p>
      <div style="font-size: 24px; font-weight: bold; color: #007bff;">${code}</div>
    `;
        const info = await this.transporter.sendMail({
            from: `"Daily Expression!" <${this.configService.get('MAIL_USER')}>`,
            to,
            subject: '이메일 인증 코드입니다',
            html,
        });
        console.log('✅ Email sent:', info.messageId);
        return info.accepted.length > 0;
    }
};
exports.MailerAdapter = MailerAdapter;
exports.MailerAdapter = MailerAdapter = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, common_1.Inject)('ExpressionPort')),
    __param(2, (0, common_1.Inject)('UserPort')),
    __metadata("design:paramtypes", [config_1.ConfigService, Object, Object])
], MailerAdapter);
//# sourceMappingURL=mailer.adapter.js.map