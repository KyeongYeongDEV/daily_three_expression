import { BatchMailService } from '../service/batch.service';
import { ExpressionGenerationService } from 'src/expression/service/expression-generation.service';
export declare class BatchMailScheduler {
    private readonly batchService;
    private readonly expressionGenerator;
    constructor(batchService: BatchMailService, expressionGenerator: ExpressionGenerationService);
    handleCron(): Promise<void>;
}
