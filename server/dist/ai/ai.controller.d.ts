import { AiService } from './ai.service';
export declare class AiController {
    private readonly aiService;
    constructor(aiService: AiService);
    testGenerate(): Promise<void>;
    generateUniqueExpressions(): Promise<void>;
}
