import { ExpressionBlackListEntity } from '../domain/expression-black-list.entity';
import { ExpressionEntity } from '../domain/expression.entity';
import { ExpressionResponseDto } from '../dto/response.dto';

export const EXPRESSION_PORT = Symbol('ExpressionPort');

export interface ExpressionPort {
  findAll(): Promise<ExpressionResponseDto[]>;
  findById(id: number): Promise<ExpressionResponseDto | null>;
  findThreeExpressionsByStartId(id: number): Promise<ExpressionResponseDto[]>;
  findThreeExpressionsByStartIdAndCategory(id: number, category: string): Promise<ExpressionResponseDto[]>;
  save(expression: ExpressionEntity): Promise<ExpressionEntity>;
  saveExpressionBlackList(expression: string): Promise<ExpressionBlackListEntity>;
  findTop5BlacklistedExpressions(): Promise<string[]>;
  toEntity(dto: any): ExpressionEntity;
}
