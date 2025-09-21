// src/mailer/worker/email.worker.ts

import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { AppModule } from '../../app.module';
import { ExpressionDeliveryPort, DeliveryLogDto } from '../../expression/port/expression-delivery.port';
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

  // --- Batch Insert를 위한 로직 추가 ---
  let deliveryLogs: DeliveryLogDto[] = [];
  let flushTimer: NodeJS.Timeout | null = null;
  const FLUSH_INTERVAL = 5000; // 마지막 작업 후 5초가 지나면 저장
  const BATCH_SIZE = 100;     // 로그가 100개 쌓이면 즉시 저장

  const flushLogs = async () => {
    if (flushTimer) {
      clearTimeout(flushTimer);
      flushTimer = null;
    }
    if (deliveryLogs.length === 0) return;

    const logsToFlush = [...deliveryLogs];
    deliveryLogs = [];

    try {
      console.log(`[BATCH INSERT] ${logsToFlush.length}개의 전송 완료 로그를 DB에 저장합니다.`);
      await expressionDeliveryPort.saveExpressionDeliveriesInBatch(logsToFlush);
    } catch (dbError) {
      console.error('❌ Batch Insert 실패:', dbError);
      // 실패한 로그는 다시 배열의 맨 앞에 추가하여 다음 flush 때 재시도
      deliveryLogs.unshift(...logsToFlush);
    }
  };
  // ------------------------------------

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
      } else if (name === 'send-expression') {
        const { to, html, u_id, deliveredId } = job.data;
        try {
          const info = await transporter.sendMail({
            from: `"하삼영" <${configService.get('MAIL_USER')}>`,
            to,
            subject: '[하삼영] 오늘의 표현 3개입니다 :)',
            html,
          });

          console.log(`✅ 표현 메일 전송 완료 → ${to}:`, info.messageId);

          // ❌ DB에 바로 저장하는 대신, 배열에 로그 추가
          deliveryLogs.push({ u_id, e_id: deliveredId, status: 'success' });

          // 일정 개수 이상 쌓이면 즉시 저장
          if (deliveryLogs.length >= BATCH_SIZE) {
            await flushLogs();
          } else {
            // 타이머 리셋: 마지막 작업 후 일정 시간 뒤에 저장
            if (flushTimer) clearTimeout(flushTimer);
            flushTimer = setTimeout(flushLogs, FLUSH_INTERVAL);
          }
        } catch (error) {
          console.error(`❌ 표현 메일 전송 실패 → ${to}:`, error);
          const errorMessage = buildEmailFailureMessage(job, error);
          await webhookService.sendMessage(errorMessage);
          throw new Error(`SMTP 전송 실패: ${error instanceof Error ? error.message : String(error)}`);
        }
      } else {
        console.warn(`❓ 알 수 없는 잡 이름: ${name}`);
      }
    },
    {
      connection,
      concurrency: 20,
    },
  );

  // 워커가 종료될 때 남은 로그를 모두 저장하여 데이터 유실 방지
  worker.on('closing', flushLogs);

  worker.on('failed', (job, err) => {
    console.error(`❌ 잡 실패: ${job?.name} (${job?.id})`, err);
  });

  console.log('📬 이메일 워커가 실행되었습니다.');
}

bootstrap();