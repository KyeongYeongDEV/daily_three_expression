import { ExpressionService } from './expression.service';
export declare class ExpressionController {
    private readonly expressionSerivce;
    constructor(expressionSerivce: ExpressionService);
    getExpressions(): Promise<string | import("./entities/expression.entity").ExpressionEntity[]>;
}
