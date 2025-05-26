import { AiService } from "./ai.service";
import { ExpressionPort } from "src/expression/port/expression.port";
import { QdrantPort } from "../port/out/qdrant.port";
export declare class ExpressionGenerationService {
    private readonly aiService;
    private readonly expressionPort;
    private readonly qdrant;
    constructor(aiService: AiService, expressionPort: ExpressionPort, qdrant: QdrantPort);
    private readonly MAX_RETRY;
    private readonly TARGET_COUNT;
    runExpressionGenerationBatch(): Promise<void>;
}
