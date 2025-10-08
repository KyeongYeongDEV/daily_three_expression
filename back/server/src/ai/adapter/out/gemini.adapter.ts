import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { GoogleAuth } from 'google-auth-library';
import { GeminiPort } from '../../port/out/gemini.port';
import { geminiTools } from '../../../common/helpers/gemini.helper';

@Injectable()
export class GeminiAdapter implements GeminiPort {
  private auth: GoogleAuth;
  private project: string; 
  private readonly location = 'us-central1';
  private readonly modelName = 'gemini-2.5-flash'; 

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    
    const projectId = this.configService.get<string>('GOOGLE_PROJECT_ID');
    const clientEmail = this.configService.get<string>('GOOGLE_CLIENT_EMAIL');
    const privateKey = this.configService.get<string>('GOOGLE_PRIVATE_KEY');

    if (!projectId || !clientEmail || !privateKey) {
      throw new Error('Google credentials (PROJECT_ID, CLIENT_EMAIL, PRIVATE_KEY) are not configured in environment variables.');
    }

    this.auth = new GoogleAuth({
      credentials: {
        project_id: projectId,
        client_email: clientEmail,
        private_key: privateKey.replace(/\\n/g, '\n'),
      },
      scopes: 'https://www.googleapis.com/auth/cloud-platform',
    });

    this.project = projectId;
    console.log(`✅ Google Cloud Project ID를 ${this.project}로 설정했습니다.`);
  }

  async getExpressions(blacklist: string[]): Promise<any> {
    const systemPrompt = this.configService.get<string>('SYSTEM_INSTRUCTION') || '';
    const userPrompt = this.configService.get<string>('USER_PROMPT') || '';
    const blacklistText = blacklist.length
      ? `\nDo NOT include the following expressions:\n${blacklist.map(e => `- ${e}`).join('\n')}`
      : '';
    const fullPrompt = `${systemPrompt}\n${userPrompt}${blacklistText}`.trim();

    const url = `https://${this.location}-aiplatform.googleapis.com/v1/projects/${this.project}/locations/${this.location}/publishers/google/models/${this.modelName}:generateContent`;

    const requestBody = {
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      tools: geminiTools,
      generationConfig: { temperature: 0.95, topK: 40, topP: 0.95 },
    };

    try {
      console.log('🚀 서비스 계정으로 인증 토큰을 받아옵니다...');
      const client = await this.auth.getClient();
      const accessToken = (await client.getAccessToken()).token;

      console.log('🚀 Vertex AI 엔드포인트로 직접 API 호출을 시작합니다...');
      const response = await firstValueFrom(
        this.httpService.post(url, requestBody, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }),
      );

      const functionCall = response.data.candidates?.[0]?.content?.parts?.[0]?.functionCall;
      if (!functionCall || functionCall.name !== 'returnExpressions') {
        throw new Error('Gemini did not return a valid function call.');
      }
      
      const expressions = functionCall.args.expressions;
      if (!expressions) {
        throw new Error('Parsed result does not contain expressions field.');
      }

      console.log('✅✅✅ API 호출 및 데이터 파싱 성공! ✅✅✅');
      return expressions;
    } catch (error: any) {
      console.error(
        '🔥 Vertex AI API 호출 중 에러 발생:',
        error.response?.data?.error || error.message
      );
      throw error;
    }
  }
}