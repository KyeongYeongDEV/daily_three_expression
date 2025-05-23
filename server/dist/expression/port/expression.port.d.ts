import { ExpressionEntity } from '../domain/expression.entity';
import { ExpressionResponseDto } from '../dto/response.dto';
export declare const EXPRESSION_PORT: unique symbol;
export interface ExpressionPort {
    findAll(): Promise<ExpressionResponseDto[]>;
    findById(id: number): Promise<ExpressionResponseDto | null>;
    findThreeExpressionsByStartId(id: number): Promise<ExpressionResponseDto[]>;
    findThreeExpressionsByStartIdAndCategory(id: number, category: string): Promise<ExpressionResponseDto[]>;
    save(expression: ExpressionEntity): Promise<ExpressionEntity>;
}
