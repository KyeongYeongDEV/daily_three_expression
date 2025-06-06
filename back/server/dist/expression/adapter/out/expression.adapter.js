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
exports.ExpressionAdapter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const expression_entity_1 = require("../../domain/expression.entity");
const expression_black_list_entity_1 = require("../../domain/expression-black-list.entity");
let ExpressionAdapter = class ExpressionAdapter {
    expressionRepository;
    expressionBlackListRepository;
    constructor(expressionRepository, expressionBlackListRepository) {
        this.expressionRepository = expressionRepository;
        this.expressionBlackListRepository = expressionBlackListRepository;
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
    async saveExpressionBlackList(expression) {
        console.log(`🧪 saveExpressionBlackList 호출됨: ${expression}`);
        const found = await this.expressionBlackListRepository.findOne({ where: { expression } });
        if (found) {
            found.count += 1;
            const result = await this.expressionBlackListRepository.save(found);
            console.log(`🔁 count 증가 완료: ${found.expression} → ${found.count}`);
            return result;
        }
        else {
            const newEntry = this.expressionBlackListRepository.create({
                expression,
                count: 1,
            });
            const result = await this.expressionBlackListRepository.save(newEntry);
            console.log(`🆕 새 표현 저장 완료: ${newEntry.expression}`);
            return result;
        }
    }
    async findTop5BlacklistedExpressions() {
        const records = await this.expressionBlackListRepository
            .createQueryBuilder('blacklist')
            .orderBy('blacklist.count', 'DESC')
            .limit(5)
            .getMany();
        return records.map(record => record.expression);
    }
    toEntity(dto) {
        const entity = new expression_entity_1.ExpressionEntity();
        entity.category = dto.category;
        entity.expression = dto.expression;
        entity.example1 = dto.example1;
        entity.example2 = dto.example2;
        entity.translation_expression = dto.translation_expression;
        entity.translation_example1 = dto.translation_example1;
        entity.translation_example2 = dto.translation_example2;
        return entity;
    }
};
exports.ExpressionAdapter = ExpressionAdapter;
exports.ExpressionAdapter = ExpressionAdapter = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(expression_entity_1.ExpressionEntity)),
    __param(1, (0, typeorm_1.InjectRepository)(expression_black_list_entity_1.ExpressionBlackListEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], ExpressionAdapter);
//# sourceMappingURL=expression.adapter.js.map