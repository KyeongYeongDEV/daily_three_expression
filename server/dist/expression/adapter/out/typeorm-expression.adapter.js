"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TypeOrmExpressionAdapter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const expression_entity_1 = require("../../domain/expression.entity");
let TypeOrmExpressionAdapter = class TypeOrmExpressionAdapter {
    expressionRepository;
    constructor(expressionRepository) {
        this.expressionRepository = expressionRepository;
    }
    async save(expression) {
        return this.expressionRepository.save(expression);
    }
    async findAll() {
        return this.expressionRepository.find();
    }
    async findById(id) {
        return this.expressionRepository.findOneBy({ e_id: id });
    }
    async findThreeExpressionsByStartIdAndCategory(startId, category) {
        return this.expressionRepository.createQueryBuilder('expression')
            .where('expression.e_id >= :startId', { startId })
            .andWhere('expression.category = :category', { category })
            .orderBy('expression.e_id', 'ASC')
            .limit(3)
            .getMany();
    }
    async findThreeExpressionsByStartId(startId) {
        return this.expressionRepository.createQueryBuilder('expression')
            .where('expression.e_id >= :startId', { startId })
            .orderBy('expression.e_id', 'ASC')
            .limit(3)
            .getMany();
    }
};
exports.TypeOrmExpressionAdapter = TypeOrmExpressionAdapter;
exports.TypeOrmExpressionAdapter = TypeOrmExpressionAdapter = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(expression_entity_1.ExpressionEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TypeOrmExpressionAdapter);
//# sourceMappingURL=typeorm-expression.adapter.js.map