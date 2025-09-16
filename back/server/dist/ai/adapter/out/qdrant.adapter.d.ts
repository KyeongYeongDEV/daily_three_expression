import { HttpService } from "@nestjs/axios";
import { QdrantPort } from "../../../ai/port/out/qdrant.port";
import { ExpressionPort } from "../../../expression/port/expression.port";
import { OpenaiAdapter } from "./openai.adapter";
export declare class QdrantAdapter implements QdrantPort {
    private readonly httpService;
    private readonly openaiAdapter;
    private readonly expressionPort;
    private readonly COLLECTION;
    constructor(httpService: HttpService, openaiAdapter: OpenaiAdapter, expressionPort: ExpressionPort);
    insertEmbedding(id: number, text: string): Promise<void>;
    searchSimilar(text: string): Promise<number>;
    deleteAllPoints(): Promise<void>;
    syncAllExpressionsToQdrant(): Promise<void>;
}
