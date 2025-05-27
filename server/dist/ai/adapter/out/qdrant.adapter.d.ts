import { HttpService } from "@nestjs/axios";
import { QdrantPort } from "src/ai/port/out/qdrant.port";
import { AiService } from "src/ai/service/ai.service";
import { ExpressionPort } from "src/expression/port/expression.port";
export declare class QdrantAdapter implements QdrantPort {
    private readonly httpService;
    private readonly aiService;
    private readonly expressionPort;
    private readonly COLLECTION;
    constructor(httpService: HttpService, aiService: AiService, expressionPort: ExpressionPort);
    insertEmbedding(id: number, text: string): Promise<void>;
    searchSimilar(text: string): Promise<number>;
    syncAllExpressionsToQdrant(): Promise<void>;
    deleteAllPoints(): Promise<void>;
}
