import { HttpService } from "@nestjs/axios";
import { QdrantPort } from "src/ai/port/out/qdrant.port";
import { AiService } from "src/ai/service/ai.service";
export declare class QdrantAdapter implements QdrantPort {
    private readonly httpService;
    private readonly aiService;
    private readonly COLLECTION;
    constructor(httpService: HttpService, aiService: AiService);
    searchSimilar(text: string): Promise<number>;
    insertEmbedding(id: number, text: string): Promise<void>;
}
