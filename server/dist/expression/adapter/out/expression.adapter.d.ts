import { Repository } from 'typeorm';
import { ExpressionEntity } from '../../domain/expression.entity';
import { ExpressionPort } from '../../port/expression.port';
import { ExpressionResponseDto } from '../../dto/response.dto';
export declare class TypeOrmExpressionAdapter implements ExpressionPort {
    private readonly expressionRepository;
    constructor(expressionRepository: Repository<ExpressionEntity>);
    save(expression: ExpressionEntity): Promise<ExpressionEntity>;
    findAll(): Promise<ExpressionResponseDto[]>;
    findById(id: number): Promise<ExpressionResponseDto | null>;
    findThreeExpressionsByStartIdAndCategory(startId: number, category: string): Promise<ExpressionResponseDto[]>;
    findThreeExpressionsByStartId(startId: number): Promise<ExpressionResponseDto[]>;
}
