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
let UserService = class UserService {
    userPort;
    constructor(userPort) {
        this.userPort = userPort;
    }
    async getUserInfoByUid(u_id) {
        const user = await this.userPort.findUserByUid(u_id);
        if (!user) {
            throw new Error('사용자 정보 조회 실패');
        }
        return user;
    }
    async isExistsUserByEmail(email) {
        const exists = await this.userPort.findUserByEmail(email);
        return !!exists;
    }
    mapToUserEntity(dto) {
        const current = new Date();
        const user = new user_entity_1.UserEntity();
        user.email = dto.email;
        user.is_email_verified = dto.is_email_verified;
        user.is_email_subscribed = dto.is_email_subscribed;
        user.created_at = current;
        user.updated_at = current;
        return user;
    }
    async registerUser(userRegisterRequestDto) {
        try {
            if (await this.isExistsUserByEmail(userRegisterRequestDto.email)) {
                throw new Error('이미 존재하는 회원입니다');
            }
            const user = this.mapToUserEntity(userRegisterRequestDto);
            const result = await this.userPort.saveUser(user);
            if (!result) {
                throw new Error('사용자 정보 저장 실패');
            }
            return response_helper_1.ResponseHelper.success(result, '회원가입에 성공했습니다');
        }
        catch (error) {
            console.error('[registerUser] ', error);
            return response_helper_1.ResponseHelper.fail('회원가입에 실패했습니다');
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
            return response_helper_1.ResponseHelper.fail('회원정보 조회에 실패했습니다.');
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
            return response_helper_1.ResponseHelper.fail(`${field} 필드 수정에 실패했습니다.`);
        }
    }
    async updateEmailVerified(userVerifiedUpdateRequestDto) {
        return this.updateUserVerifiedFlag(userVerifiedUpdateRequestDto.u_id, 'is_email_verified', userVerifiedUpdateRequestDto.verified);
    }
    async updateSubscribeVerified(userVerifiedUpdateRequestDto) {
        return this.updateUserVerifiedFlag(userVerifiedUpdateRequestDto.u_id, 'is_email_subscribed', userVerifiedUpdateRequestDto.verified);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('UserPort')),
    __metadata("design:paramtypes", [Object])
], UserService);
//# sourceMappingURL=user.service.js.map