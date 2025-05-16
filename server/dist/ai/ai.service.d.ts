import { AiRepository } from './ai.repository';
import { ConfigService } from '@nestjs/config';
export declare class AiService {
    private readonly aiRepository;
    private readonly configService;
    private openAi;
    constructor(aiRepository: AiRepository, configService: ConfigService);
    generateAndSaveIfUnique(prompt: string): Promise<string[]>;
    private generateFromGPT;
    private getEmbedding;
}
