import { OpenAiService } from "../../ai/service/openAi.service";
import { ExpressionPort } from "src/expression/port/expression.port";
import { QdrantPort } from "../../ai/port/out/qdrant.port";
export declare class ExpressionGenerationService {
    private readonly aiService;
    private readonly expressionPort;
    private readonly qdrant;
    constructor(aiService: OpenAiService, expressionPort: ExpressionPort, qdrant: QdrantPort);
    private readonly MAX_RETRY;
    private readonly TARGET_COUNT;
    runExpressionGenerationBatch(): Promise<void>;
}
