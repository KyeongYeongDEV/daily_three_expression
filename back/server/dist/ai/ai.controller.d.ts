import { AiService } from './service/openAi.service';
import { QdrantAdapter } from './adapter/out/qdrant.adapter';
export declare class AiController {
    private readonly aiService;
    private readonly qdrant;
    constructor(aiService: AiService, qdrant: QdrantAdapter);
    testGenerate(): Promise<void>;
    syncAllExpressionsToQdrant(): Promise<{
        message: string;
    }>;
    generateUniqueExpressions(): Promise<void>;
    deleteAllExpressionsFromQdrant(): Promise<{
        message: string;
    }>;
}
