import { ConfigService } from '@nestjs/config';
import { OpenAiPort } from '../port/out/openai.port';
import { ExpressionPort } from 'src/expression/port/expression.port';
export declare class AiService implements OpenAiPort {
    private readonly expressionPort;
    private readonly configService;
    private openAi;
    constructor(expressionPort: ExpressionPort, configService: ConfigService);
    getExpressionFromGPT(): Promise<any[]>;
    getEmbedding(text: string): Promise<number[]>;
}
