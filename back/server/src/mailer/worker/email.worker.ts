import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../../app.module';
import { ExpressionDeliveryPort } from '../../expression/port/expression-delivery.port';
import { WebhookService } from '../../common/service/webhook.service';
import { Worker, Job } from 'bullmq';
import nodemailer from 'nodemailer';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const configService = app.get(ConfigService);
  const expressionDeliveryPort = app.get<ExpressionDeliveryPort>('ExpressionDeliveryPort');
  const webhookService = app.get(WebhookService);

  const connection = {
    host: configService.get<string>('REDIS_HOST') || 'localhost',
    port: parseInt(configService.get<string>('REDIS_PORT') || '6379', 10),
  };

  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: configService.get<string>('MAIL_USER'),
      pass: configService.get<string>('MAIL_PASS'),
    },
    pool: true,
    maxConnections: 5,
    maxMessages: 100,
    rateLimit: 5,
  });

  const buildEmailFailureMessage = (
    job: Job<{ to: string; html: string; u_id: number; deliveredId: number }>,
    error: unknown,
  ): string => {
    const { to, u_id, deliveredId } = job.data;
    const errorMsg = error instanceof Error ? error.message : String(error);
    return `
        ❌ **이메일 전송 실패 알림**
        - 대상: ${to}
        - 유저 ID: ${u_id}
        - 표현 ID: ${deliveredId}
        - 에러: \`${errorMsg}\`
        - 시도 횟수: ${job.attemptsMade + 1}/${job.opts?.attempts ?? '?'}
            `.trim();
  };

  const worker = new Worker(
    'email',
    async (job: Job) => {
      const { name } = job;

      if (name === 'send-verification') {
        const { to, html } = job.data;
        try {
          const info = await transporter.sendMail({
            from: `"하삼영" <${configService.get('MAIL_USER')}>`,
            to,
            subject: '[하삼영] 이메일 인증 코드입니다.',
            html,
          });
          console.log(`✅ 인증 메일 전송 완료 → ${to}:`, info.messageId);
        } catch (error) {
          console.error(`❌ 인증 메일 전송 실패 → ${to}:`, error);
          throw new Error(`SMTP 전송 실패: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      else if (name === 'send-expression') {
        const { to, html, u_id, deliveredId } = job.data;
        try {
          const info = await transporter.sendMail({
            from: `"하삼영" <${configService.get('MAIL_USER')}>`,
            to,
            subject: '[하삼영] 오늘의 표현 3개입니다 :)',
            html,
          });

          console.log(`✅ 표현 메일 전송 완료 → ${to}:`, info.messageId);
          await expressionDeliveryPort.saveExpressionDeliveried(u_id, deliveredId, 'success');
        } catch (error) {
          console.error(`❌ 표현 메일 전송 실패 → ${to}:`, error);

          const errorMessage = buildEmailFailureMessage(job, error);
          await webhookService.sendMessage(errorMessage);

          throw new Error(`SMTP 전송 실패: ${error instanceof Error ? error.message : String(error)}`);
        }
      }

      else {
        console.warn(`❓ 알 수 없는 잡 이름: ${name}`);
      }
    },
    {
      connection,
      concurrency: 20,
    },
  );

  worker.on('failed', (job, err) => {
    console.error(`❌ 잡 실패: ${job?.name} (${job?.id})`, err);
  });
}

bootstrap();
