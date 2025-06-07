import { HttpService } from "@nestjs/axios";
import { QdrantPort } from "src/ai/port/out/qdrant.port";
import { OpenAiService } from "src/ai/service/openAi.service";
import { ExpressionPort } from "src/expression/port/expression.port";
import { ExpressionEntity } from "src/expression/domain/expression.entity";
export declare class QdrantAdapter implements QdrantPort {
    private readonly httpService;
    private readonly aiService;
    private readonly expressionPort;
    private readonly COLLECTION;
    constructor(httpService: HttpService, aiService: OpenAiService, expressionPort: ExpressionPort);
    insertEmbedding(id: number, text: string): Promise<void>;
    trySaveIfNotSimilar(expression: ExpressionEntity): Promise<string>;
    searchSimilar(text: string): Promise<number>;
    syncAllExpressionsToQdrant(): Promise<void>;
    deleteAllPoints(): Promise<void>;
}
