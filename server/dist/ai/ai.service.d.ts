import { ConfigService } from '@nestjs/config';
import { QdrantService } from './qdrant/qdrant.service';
export declare class AiService {
    private readonly configService;
    private readonly qdrantSerivce;
    private openAi;
    constructor(configService: ConfigService, qdrantSerivce: QdrantService);
    private getExpressionFromGPT;
    private getEmbedding;
}
