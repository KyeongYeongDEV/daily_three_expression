import { BatchMailService } from '../service/batch.service';
export declare class BatchMailScheduler {
    private readonly batchService;
    constructor(batchService: BatchMailService);
    handleCron(): Promise<void>;
}
