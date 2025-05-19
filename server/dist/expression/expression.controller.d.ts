import { ExpressionService } from './expression.service';
export declare class ExpressionController {
    private readonly expressionSerivce;
    constructor(expressionSerivce: ExpressionService);
    getExpressions(): Promise<import("../common/types/response.type").ExpressionListResponse>;
}
