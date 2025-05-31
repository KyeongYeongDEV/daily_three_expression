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
exports.RedisAdapter = void 0;
const common_1 = require("@nestjs/common");
const ioredis_1 = require("ioredis");
let RedisAdapter = class RedisAdapter {
    redisClient;
    constructor(redisClient) {
        this.redisClient = redisClient;
    }
    async saveEmailVerificationCode(email, code) {
        const key = `verify:${email}`;
        await this.redisClient.set(key, code, 'EX', 60 * 2);
    }
    async getEmailVerificationCode(email) {
        const key = `verify:${email}`;
        return await this.redisClient.get(key);
    }
    async deleteEmailVerificationCode(email) {
        const key = `verify:${email}`;
        await this.redisClient.del(key);
    }
    async saveVerifiedEmail(email) {
        const key = `isVerifiedEmail:${email}`;
        await this.redisClient.set(key, 'true', 'EX', 60 * 30);
    }
    async isVerifiedEmail(email) {
        const key = `isVerifiedEmail:${email}`;
        console.log(`인증된 이메일인지 확인 : ${email} : `, key);
        return await this.redisClient.get(key) === 'true';
    }
    async deleteVerifiedEmail(email) {
        const key = `isVerifiedEmail:${email}`;
        console.log(`인증된 이메일 삭제 : ${email} : `, key);
        await this.redisClient.del(key);
    }
    async saveRefreshToken(email, refreshToken) {
        await this.redisClient.set(`refresh:${email}`, refreshToken, 'EX', 60 * 60 * 24 * 7);
    }
    async getRefreshToken(email) {
        return this.redisClient.get(`refresh:${email}`);
    }
    async deleteRefreshToken(email) {
        await this.redisClient.del(`refresh:${email}`);
    }
};
exports.RedisAdapter = RedisAdapter;
exports.RedisAdapter = RedisAdapter = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('REDIS')),
    __metadata("design:paramtypes", [ioredis_1.default])
], RedisAdapter);
//# sourceMappingURL=redis.adpter.js.map