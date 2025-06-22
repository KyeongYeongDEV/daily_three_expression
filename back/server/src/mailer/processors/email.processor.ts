import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
import * as nodemailer from 'nodemailer';
import { ConfigService } from '@nestjs/config';
import { buildVerificationCodeTemplate } from '../templates/verify-code.template';
import { Inject } from '@nestjs/common';
import { ExpressionDeliveryPort } from 'src/expression/port/expression-delivery.port';

@Processor('email')
export class EmailProcessor {
  private readonly transporter: nodemailer.Transporter;

  constructor(
    private readonly configService: ConfigService,
    @Inject('ExpressionDeliveryPort') 
    private readonly expressionDeliveryPort: ExpressionDeliveryPort,
  ) {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com', 
      port: 587, 
      secure: false, 
      auth: {
        user: this.configService.get<string>('MAIL_USER'),
        pass: this.configService.get<string>('MAIL_PASS'),
      },
      pool: true, 
      maxConnections: 5, 
      maxMessages: 100, 
    });
    // Nodemailer 이벤트 리스너 등록
    this.setupNodemailerMonitoring(); // 새로운 메서드 호출
  }

  private setupNodemailerMonitoring() {
    this.transporter.on('idle', () => {
      // 모든 메시지가 전송되고 트랜스포터가 유휴 상태일 때 발생
      // console.log('[Nodemailer] Transporter is idle. All messages sent.');
      // 이 로그는 매우 빈번하게 발생할 수 있으므로 주의해서 사용하세요.
    });

    this.transporter.on('error', (error: Error) => {
      // 전송 중 오류 발생 시 발생
      console.error('[Nodemailer] Transporter error:', error);
      // 어떤 오류가 발생했는지, 재시도 가능한 오류인지 등을 파악할 수 있습니다.
    });

    this.transporter.on('token', (token: any) => {
      // SMTP 인증 토큰이 새로고침될 때 발생 (OAuth2 사용 시)
      // console.log('[Nodemailer] New authentication token:', token);
    });

    // this.transporter.on('pool', (info: {
    //   type: 'added' | 'removed';
    //   connection: any; // 실제 Connection 객체 타입은 복잡할 수 있음
    // }) => {
    //   // Connection Pool에 커넥션이 추가되거나 제거될 때 발생
    //   // console.log(`[Nodemailer Pool] Connection ${info.type}. Total connections: ${this.transporter.get = () => this.transporter._currentConnections};`);
    //   // NOTE: getConnections()는 NodeMailer 6.x 버전 이상에서 사용 가능하며, 내부 구현에 따라 _connections, _currentConnections 등으로 접근해야 할 수 있습니다.
    //   // Nodemailer 6.x 이상에서는 transporter.options.maxConnections 와 같은 방식으로 현재 설정된 최대 커넥션 수 확인 가능.
    //   // 현재 열려있는 커넥션 수를 정확히 추적하려면 좀 더 복잡한 로직이 필요할 수 있습니다.
    //   // console.log(`[Nodemailer Pool] Connection ${info.type}.`);
    // });

    // 참고: Nodemailer 6.x 버전부터는 'pool' 이벤트가 커넥션의 추가/제거를 의미합니다.
    // 'pooled' 이벤트는 더 이상 사용되지 않거나 다른 의미로 사용될 수 있습니다.
    // Nodemailer 5.x 이하 버전에서는 'pooled' 이벤트가 커넥션이 풀에 추가되었음을 의미했습니다.
    // 따라서 사용하시는 Nodemailer 버전에 따라 이벤트 이름과 파라미터를 확인해주세요.
    // (보통 @nestjs-modules/mailer 등은 최신 Nodemailer를 포함하고 있습니다.)
  }

  @Process({ name : 'send-verification', concurrency : 10 })
  async handleSendVerificationEmail(job: Job<{ to: string; html: string }>) {
    try {
      const { to, html } = job.data;

      const info = await this.transporter.sendMail({
        from: `"하삼영" <${this.configService.get('MAIL_USER')}>`,
        to,
        subject: '[하삼영] 이메일 인증 코드입니다.',
        html,
      });

      console.log(`[이메일 인증 전송 프로세스] ✅ 인증 코드 메일 전송 완료:`, info.messageId);
    } catch (error) {
      console.error(`[이메일 인증 전송 프로세스] ❌ 인증 코드 메일 전송 실패:`, error);
    }
  }

  @Process({name : 'send-expression', concurrency : 10 })
  async handleSendExpressionEmail(job: Job<{ to: string; html: string; u_id: number; deliveredId: number }>) {
    const { to, html, u_id, deliveredId } = job.data;
    
    try {
      const info = await this.transporter.sendMail({
        from: `"하삼영" <${this.configService.get('MAIL_USER')}>`,
        to,
        subject: '[하삼영] 오늘의 표현 3개입니다 :)',
        html,
      });

      console.log(`[표현 전송 프로세스] ✅ 표현 이메일 전송 완료 → ${to}:`, info.messageId);

      await this.expressionDeliveryPort.saveExpressionDeliveried(u_id, deliveredId, 'success');
    } catch (error) {
      console.error(`[표현 전송 프로세스] ❌ 표현 이메일 전송 실패 → ${to}:`, error);
    }
  }

  @Process({ name: 'send-expression-test', concurrency: 10 })
  async testSendExpressionEmail(job: Job<{ to: string; html: string; u_id: number; deliveredId: number }>) {
    const { to, u_id, deliveredId } = job.data;
  
    try {
      // 메일 전송 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 50));
  
      // DB 저장 시뮬레이션
      console.log(`[MOCK] DB 저장 → u_id: ${u_id}, e_id: ${deliveredId}, status: success`);
  
      // 진짜 DB에는 쓰지 않음
      // await this.expressionDeliveryPort.saveExpressionDeliveried(u_id, deliveredId, 'success');
  
    } catch (error) {
      console.error(`[MOCK] 테스트 이메일 처리 실패 → ${to}:`, error);
    }
  }
  
}