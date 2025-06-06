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
        const startEid = await this.expressionDeliveryPort.findStartExpressionId(today, yesterday) | 9;
        const expressions = await this.expressionPort.findThreeExpressionsByStartId(startEid + 1);
        const html = `
    <div style="font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: linear-gradient(135deg, #f0f8ff 0%, #ffffff 100%); border-radius: 16px; box-shadow: 0 10px 30px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background: linear-gradient(135deg, #84CCFF, #6BB8FF); color: white; padding: 20px; border-radius: 12px; margin-bottom: 20px;">
          <h2 style="margin: 0; font-size: 24px; font-weight: bold;">📧 오늘의 패턴 영어 (${new Date().toLocaleDateString('ko-KR')})</h2>
          <p style="margin: 8px 0 0 0; opacity: 0.9; font-size: 14px;">하루 3개의 실용적인 영어 표현</p>
        </div>
      </div>

      <!-- Expressions -->
      ${expressions.map((e, index) => `
        <div style="background: white; padding: 24px; margin-bottom: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); border-left: 4px solid #84CCFF;">
          
          <!-- Pattern Title -->
          <div style="margin-bottom: 16px;">
            <h3 style="margin: 0 0 8px 0; font-size: 20px; font-weight: bold; color: #1f2937;">${index + 1}. ${e.expression}</h3>
            <p style="margin: 0; font-size: 16px; color: #6b7280; font-weight: 500;">${e.translation_expression}</p>
          </div>

          <!-- Examples -->
          <div style="space-y: 12px;">
            <!-- Example 1 -->
            <div style="margin-bottom: 12px;">
              <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); padding: 12px 16px; border-radius: 8px; margin-bottom: 4px;">
                <p style="margin: 0; font-style: italic; color: #1e40af; font-size: 15px; font-weight: 500;">예 1: ${e.example1}</p>
              </div>
              <p style="margin: 0; font-size: 13px; color: #6b7280; padding-left: 8px;">해석: ${e.translation_example1}</p>
            </div>

            <!-- Example 2 -->
            <div style="margin-bottom: 0;">
              <div style="background: linear-gradient(135deg, #dbeafe, #bfdbfe); padding: 12px 16px; border-radius: 8px; margin-bottom: 4px;">
                <p style="margin: 0; font-style: italic; color: #1e40af; font-size: 15px; font-weight: 500;">예 2: ${e.example2}</p>
              </div>
              <p style="margin: 0; font-size: 13px; color: #6b7280; padding-left: 8px;">해석: ${e.translation_example2}</p>
            </div>
          </div>
        </div>
      `).join('')}
      
      <!-- Call to Action -->
      <div style="text-align: center; margin: 40px 0 30px 0;">
        <div style="background: white; padding: 24px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08); margin-bottom: 20px;">
          <h3 style="margin: 0 0 12px 0; color: #1f2937; font-size: 18px;">💡 더 많은 영어 표현이 필요하신가요?</h3>
          <p style="margin: 0 0 20px 0; color: #6b7280; font-size: 14px;">건의사항이나 학습하고 싶은 표현을 알려주세요!</p>
          <a href="https://little-spectrum-92b.notion.site/1f281d8a13f08072b5eed89fec38b6a6?pvs=105" target="_blank"
            style="display: inline-block; padding: 14px 28px; background: linear-gradient(135deg, #84CCFF, #6BB8FF); color: white; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 15px; box-shadow: 0 4px 12px rgba(132, 204, 255, 0.3); transition: all 0.3s ease;">
            건의사항 작성하러 가기 →
          </a>
        </div>
      </div>

      <!-- Tips Section -->
      <div style="background: linear-gradient(135deg, #f0f9ff, #e0f2fe); padding: 20px; border-radius: 12px; margin-bottom: 30px; border: 1px solid #e0f2fe;">
        <h4 style="margin: 0 0 12px 0; color: #0369a1; font-size: 16px; font-weight: bold;">📚 학습 팁</h4>
        <ul style="margin: 0; padding-left: 20px; color: #0c4a6e; font-size: 14px; line-height: 1.6;">
          <li style="margin-bottom: 8px;">각 표현을 소리 내어 3번씩 읽어보세요</li>
          <li style="margin-bottom: 8px;">예제 문장을 자신의 상황에 맞게 바꿔보세요</li>
          <li style="margin-bottom: 0;">오늘 배운 표현 중 하나를 실제로 사용해보세요</li>
        </ul>
      </div>

      <!-- Stats -->
      <div style="text-align: center; margin-bottom: 30px;">
        <div style="background: white; padding: 20px; border-radius: 12px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);">
          <p style="margin: 0 0 8px 0; color: #84CCFF; font-size: 24px; font-weight: bold;">1,247명</p>
          <p style="margin: 0; color: #6b7280; font-size: 14px;">이 함께 영어를 공부하고 있어요! 🎉</p>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <div style="margin-bottom: 16px;">
          <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/ChatGPT%20Image%202025%E1%84%82%E1%85%A7%E1%86%AB%205%E1%84%8B%E1%85%AF%E1%86%AF%2031%E1%84%8B%E1%85%B5%E1%86%AF%20%E1%84%8B%E1%85%A9%E1%84%92%E1%85%AE%2002_53_05-FTMZkMUlKQgHboNGVm3W0gdEfiR8G4.png" alt="하삼영 로고" style="width: 32px; height: 32px; vertical-align: middle; margin-right: 8px;">
          <span style="font-size: 18px; font-weight: bold; color: #1f2937; vertical-align: middle;">하삼영</span>
        </div>
        <p style="margin: 0 0 8px 0; font-size: 12px; color: #9ca3af;">하루 3개의 패턴 영어로 시작하는 영어 공부</p>
        <p style="margin: 0; font-size: 11px; color: #d1d5db;">© 2025 하삼영. All rights reserved.</p>
        
        <!-- Unsubscribe -->
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid #f3f4f6;">
          <p style="margin: 0; font-size: 11px; color: #9ca3af;">
            이 메일이 더 이상 필요하지 않으시다면 
            <a href="#" style="color: #84CCFF; text-decoration: none;">구독 해지</a>를 클릭하세요.
          </p>
        </div>
      </div>
    </div>
  `;
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
    __param(2, (0, common_1.Inject)('ExpressionDeliveryPort')),
    __param(3, (0, common_1.Inject)('UserPort')),
    __metadata("design:paramtypes", [config_1.ConfigService, Object, Object, Object])
], MailerAdapter);
//# sourceMappingURL=mailer.adapter.js.map