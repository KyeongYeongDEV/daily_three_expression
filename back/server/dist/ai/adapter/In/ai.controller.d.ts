import { OpenaiAdapter } from '../../adapter/out/openai.adapter';
import { QdrantAdapter } from '../../adapter/out/qdrant.adapter';
import { AiService } from 'src/ai/service/ai.service';
export declare class AiController {
    private readonly openAiAdapter;
    private readonly aiservice;
    private readonly qdrant;
    constructor(openAiAdapter: OpenaiAdapter, aiservice: AiService, qdrant: QdrantAdapter);
    testGenerate(): Promise<{
        expressions: string[];
    }>;
    syncAllExpressionsToQdrant(): Promise<{
        message: string;
    }>;
    generateUniqueExpressions(): Promise<void>;
    deleteAllExpressionsFromQdrant(): Promise<{
        message: string;
    }>;
}
