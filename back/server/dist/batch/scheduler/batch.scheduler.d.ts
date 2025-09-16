import { BatchMailService } from '../service/batch.service';
import { AiService } from '../../ai/service/ai.service';
export declare class BatchMailScheduler {
    private readonly batchService;
    private readonly aiService;
    constructor(batchService: BatchMailService, aiService: AiService);
    sendExpressionByEmail(): Promise<void>;
    getExpressionFromAi(): Promise<void>;
}
