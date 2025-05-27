import { Repository } from 'typeorm';
import { ExpressionEntity } from '../../domain/expression.entity';
import { ExpressionPort } from '../../port/expression.port';
import { ExpressionResponseDto } from '../../dto/response.dto';
import { ExpressionBlackListEntity } from 'src/expression/domain/expression-black-list.entity';
export declare class TypeOrmExpressionAdapter implements ExpressionPort {
    private readonly expressionRepository;
    private readonly expressionBlackListRepository;
    constructor(expressionRepository: Repository<ExpressionEntity>, expressionBlackListRepository: Repository<ExpressionBlackListEntity>);
    save(expression: ExpressionEntity): Promise<ExpressionEntity>;
    findAll(): Promise<ExpressionResponseDto[]>;
    findById(id: number): Promise<ExpressionResponseDto | null>;
    findThreeExpressionsByStartIdAndCategory(startId: number, category: string): Promise<ExpressionResponseDto[]>;
    findThreeExpressionsByStartId(startId: number): Promise<ExpressionResponseDto[]>;
    saveExpressionBlackList(expression: string): Promise<ExpressionBlackListEntity>;
    findTop5BlacklistedExpressions(): Promise<string[]>;
    toEntity(dto: any): ExpressionEntity;
}
