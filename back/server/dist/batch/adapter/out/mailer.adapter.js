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
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #f5f5f5; border-radius: 10px;">
      <h2 style="text-align: center; color: #007bff;">🔥 오늘의 영어 표현 3개</h2>
      ${expressions.map(e => `
        <div style="background: white; padding: 15px; margin-bottom: 10px; border-radius: 8px; box-shadow: 0 1px 4px rgba(0,0,0,0.1);">
          <p><strong>표현:</strong> ${e.expression}</p>
          <p><strong>뜻:</strong> ${e.translation_expression}</p>
          <p><strong>예제 1:</strong> ${e.example1} <br/><strong>해석:</strong> ${e.translation_example1}</p>
          <p><strong>예제 2:</strong> ${e.example2} <br/><strong>해석:</strong> ${e.translation_example2}</p>
        </div>
      `).join('')}
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://little-spectrum-92b.notion.site/1f281d8a13f08072b5eed89fec38b6a6?pvs=105" target="_blank"
          style="display: inline-block; padding: 12px 24px; background-color: #007bff; color: white; text-decoration: none; border-radius: 6px; font-weight: bold;">
          건의사항 작성하러 가기
        </a>
      </div>
  
      <p style="text-align: center; font-size: 12px; color: #888; margin-top: 20px;">
        © 하삼영 | 하루 3개의 패턴 영어
      </p>
    </div>
  `;
        for (const user of users) {
            const info = await this.transporter.sendMail({
                from: `"하삼영" <${this.configService.get('MAIL_USER')}>`,
                to: user,
                subject: '[하삼영] 오늘의 표현 3개입니다!',
                html,
            });
            console.log(`✅ Email sent to ${user}:`, info.messageId);
        }
    }
    async sendEmailVerificationCode(to, code) {
        const html = `
      <div style="font-family: Arial, sans-serif; padding: 30px; background-color: #f5f5f5; border-radius: 8px; max-width: 400px; margin: auto;">
        <h2 style="color: #333;">🔐 이메일 인증 코드</h2>
        <p style="font-size: 16px;">아래 코드를 입력해주세요:</p>
        <div style="font-size: 32px; font-weight: bold; color: #007bff; text-align: center; margin: 20px 0;">${code}</div>
        <p style="font-size: 12px; color: gray;">이 코드는 발송 후 10분 동안 유효합니다.</p>
        <hr/>
        <p style="font-size: 10px; text-align: center; color: #999;">하삼영 | 하루 3개의 패턴 영어</p>
      </div>
    `;
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
    __param(2, (0, common_1.Inject)('UserPort')),
    __metadata("design:paramtypes", [config_1.ConfigService, Object, Object])
], MailerAdapter);
//# sourceMappingURL=mailer.adapter.js.map