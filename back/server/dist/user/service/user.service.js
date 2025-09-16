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
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const user_entity_1 = require("../domain/user.entity");
const response_helper_1 = require("../../common/helpers/response.helper");
const db_error_util_1 = require("../../common/utils/db-error.util");
let UserService = class UserService {
    userPort;
    redisPort;
    findAllUsersEmail() {
        throw new Error('Method not implemented.');
    }
    constructor(userPort, redisPort) {
        this.userPort = userPort;
        this.redisPort = redisPort;
    }
    async getUserInfoByUid(u_id) {
        const user = await this.userPort.findUserByUid(u_id);
        if (!user) {
            throw new Error('사용자 정보 조회 실패');
        }
        return user;
    }
    async getAllUsersEmail() {
        try {
            const userEmails = await this.userPort.findAllUsersEmail();
            return response_helper_1.ResponseHelper.success(userEmails, '모든 회원들 이메일 정보 조회에 성공했습니다');
        }
        catch (error) {
            console.error('[getAllUsersEmail] ', error);
            return response_helper_1.ResponseHelper.fail('이메일 조회에 실패했습니다.', 500);
        }
    }
    async isExistsUserByEmail(email) {
        const exists = await this.userPort.findUserByEmail(email);
        return !!exists;
    }
    mapToUserEntity(dto) {
        const user = new user_entity_1.UserEntity();
        user.email = dto.email;
        user.is_email_verified = dto.is_email_verified;
        user.is_email_subscribed = dto.is_email_subscribed;
        return user;
    }
    async registerUser(userRegisterRequestDto) {
        const { email } = userRegisterRequestDto;
        const isVerified = await this.redisPort.isVerifiedEmail(email);
        if (!isVerified) {
            return response_helper_1.ResponseHelper.fail('이메일 인증이 필요합니다.', 400);
        }
        const user = this.mapToUserEntity(userRegisterRequestDto);
        try {
            const saved = await this.userPort.saveUser(user);
            return response_helper_1.ResponseHelper.success(saved, '회원가입에 성공했습니다');
        }
        catch (err) {
            if ((0, db_error_util_1.isDuplicateKeyError)(err)) {
                const existing = await this.userPort.findUserInfoByEmail(email);
                if (!existing) {
                    return response_helper_1.ResponseHelper.fail('[registerUser] 회원을 찾을 수 없습니다.', 500);
                }
                if (existing.is_email_subscribed) {
                    return response_helper_1.ResponseHelper.fail('[registerUser] 이미 구독 중인 이메일입니다.', 409);
                }
                const updatedUser = await this.userPort.updateSubscribeStatus(email, true);
                return response_helper_1.ResponseHelper.success(updatedUser ?? null, '구독이 재활성화 되었습니다.');
            }
            console.error('[registerUser] ', err);
            return response_helper_1.ResponseHelper.fail('회원가입에 실패했습니다', 500);
        }
    }
    async getUserInfoByEmail(userEmailRequestDto) {
        try {
            const result = await this.userPort.findUserInfoByEmail(userEmailRequestDto.email);
            if (!result) {
                throw new Error('사용자 정보 조회 실패');
            }
            return response_helper_1.ResponseHelper.success(result, '회원정보 조회에 성공했습니다');
        }
        catch (error) {
            console.error('[getUserByEmail]', error);
            return response_helper_1.ResponseHelper.fail('회원정보 조회에 실패했습니다.', 400);
        }
    }
    async updateUserVerifiedFlag(u_id, field, value) {
        try {
            const user = await this.getUserInfoByUid(u_id);
            user[field] = value;
            user.updated_at = new Date();
            const result = await this.userPort.saveUser(user);
            return response_helper_1.ResponseHelper.success(result, `${field} 필드 수정에 성공했습니다.`);
        }
        catch (error) {
            console.error(`[updateUserVerifiedFlag] ${field} 변경 실패:`, error);
            return response_helper_1.ResponseHelper.fail(`${field} 필드 수정에 실패했습니다.`, 400);
        }
    }
    async updateEmailVerified(userVerifiedUpdateRequestDto) {
        return this.updateUserVerifiedFlag(userVerifiedUpdateRequestDto.u_id, 'is_email_verified', userVerifiedUpdateRequestDto.verified);
    }
    async updateSubscribeVerified(userVerifiedUpdateRequestDto) {
        return this.updateUserVerifiedFlag(userVerifiedUpdateRequestDto.u_id, 'is_email_subscribed', userVerifiedUpdateRequestDto.verified);
    }
    async updateSubscribeStatus(email, token) {
        try {
            const savedToken = await this.redisPort.getUuidToken(email);
            if (!savedToken || savedToken !== token) {
                return response_helper_1.ResponseHelper.fail('유효하지 않은 구독 해지 요청입니다.', 400);
            }
            await this.userPort.updateSubscribeStatus(email, false);
            await this.redisPort.deleteUuidToken(email);
            return response_helper_1.ResponseHelper.success(null, '구독 해지에 성공했습니다.');
        }
        catch (error) {
            console.error('[unsubscribe] ', error);
            return response_helper_1.ResponseHelper.fail('구독 해지에 실패했습니다.', 500);
        }
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('UserPort')),
    __param(1, (0, common_1.Inject)('RedisPort')),
    __metadata("design:paramtypes", [Object, Object])
], UserService);
//# sourceMappingURL=user.service.js.map