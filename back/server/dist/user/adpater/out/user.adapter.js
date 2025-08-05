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
exports.UserAdapter = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../domain/user.entity");
let UserAdapter = class UserAdapter {
    userRepository;
    dataSource;
    constructor(userRepository, dataSource) {
        this.userRepository = userRepository;
        this.dataSource = dataSource;
    }
    async findAllUsersEmail() {
        const results = await this.userRepository
            .createQueryBuilder('user')
            .select(['user.u_id', 'user.email'])
            .where('user.is_email_subscribed = true')
            .getRawMany();
        return results.map(result => ({
            u_id: result.user_u_id,
            email: result.user_email
        }));
    }
    async findUserInfoByEmail(email) {
        return this.userRepository.createQueryBuilder('user')
            .where('user.email = :email', { email })
            .getOne();
    }
    async findUserByEmail(email) {
        return this.userRepository.createQueryBuilder('user')
            .where('user.email = :email', { email })
            .andWhere('user.is_email_subscribed = true')
            .getOne();
    }
    async findUserByUid(u_id) {
        return this.userRepository.createQueryBuilder('user')
            .select([
            'user.u_id',
            'user.email',
        ])
            .where('user.u_id = :u_id', { u_id })
            .andWhere('user.is_email_subscribed = true')
            .getOne();
    }
    async saveUser(user) {
        const result = await this.dataSource.query(`INSERT INTO "user" (email, is_email_verified, is_email_subscribed)
      VALUES ($1, $2, $3)
      RETURNING u_id`, [
            user.email,
            user.is_email_verified,
            user.is_email_subscribed,
        ]);
        const insertedId = result.insertId || result[0]?.insertId;
        return {
            ...user,
            u_id: insertedId,
        };
    }
    async updateSubscribeStatus(email, isSubscribed) {
        await this.userRepository.update({ email }, { is_email_subscribed: isSubscribed });
    }
    async updateSubscribeByEmail(email) {
        await this.userRepository.update({ email }, { is_email_subscribed: true });
        const user = await this.findUserInfoByEmail(email);
        if (!user) {
            throw new Error(`User with email ${email} not found`);
        }
        return user;
    }
};
exports.UserAdapter = UserAdapter;
exports.UserAdapter = UserAdapter = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.UserEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.DataSource])
], UserAdapter);
//# sourceMappingURL=user.adapter.js.map