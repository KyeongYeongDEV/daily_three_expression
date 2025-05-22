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
exports.ExpressionRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const expression_entity_1 = require("../entities/expression.entity");
const typeorm_2 = require("@nestjs/typeorm");
let ExpressionRepository = class ExpressionRepository {
    orm;
    constructor(orm) {
        this.orm = orm;
    }
    async save(expression) {
        return this.orm.save(expression);
    }
    async findAll() {
        return this.orm.find();
    }
    async findById(id) {
        return this.orm.findOneBy({ e_id: id });
    }
    async findThreeExpressionsByStartIdAndCategory(startId, category) {
        return this.orm
            .createQueryBuilder('expression')
            .where('expression.e_id >= :startId', { startId })
            .andWhere('expression.category = :category', { category })
            .orderBy('expression.e_id', 'ASC')
            .limit(3)
            .getMany();
    }
    async findThreeExpressionsByStartId(startId) {
        return this.orm
            .createQueryBuilder('expression')
            .where('expression.e_id >= :startId', { startId })
            .orderBy('expression.e_id', 'ASC')
            .limit(3)
            .getMany();
    }
    async findByCategory(category) {
        return this.orm.findOneBy({ category: category });
    }
};
exports.ExpressionRepository = ExpressionRepository;
exports.ExpressionRepository = ExpressionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_2.InjectRepository)(expression_entity_1.ExpressionEntity)),
    __metadata("design:paramtypes", [typeorm_1.Repository])
], ExpressionRepository);
//# sourceMappingURL=expression.repository.js.map