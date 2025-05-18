import { ConfigService } from "@nestjs/config";
export declare class QdrantService {
    private readonly configService;
    private qdrantUrl;
    private collectionName;
    constructor(configService: ConfigService);
    private searchSimilarExpression;
    private upserExpressionVector;
    private createCollectionIfNotExists;
    deleteVector(id: string): Promise<void>;
}
