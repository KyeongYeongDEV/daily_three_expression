import { ConfigService } from '@nestjs/config';
import { OpenAiPort } from '../port/out/openai.port';
export declare class AiService implements OpenAiPort {
    private readonly configService;
    private openAi;
    constructor(configService: ConfigService);
    getExpressionFromGPT(): Promise<any[]>;
    getEmbedding(text: string): Promise<number[]>;
}
