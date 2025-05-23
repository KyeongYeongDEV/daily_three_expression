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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const response_helper_1 = require("../../common/helpers/response.helper");
const console_1 = require("console");
const user_service_1 = require("../../user/service/user.service");
let AuthService = class AuthService {
    redisPort;
    jwtPort;
    userService;
    constructor(redisPort, jwtPort, userService) {
        this.redisPort = redisPort;
        this.jwtPort = jwtPort;
        this.userService = userService;
    }
    async createToken(u_id, email) {
        try {
            const payload = { u_id, email };
            const accessToken = await this.jwtPort.signAccessToken(payload);
            const refreshToken = await this.jwtPort.signRefreshToken(payload);
            await this.redisPort.saveRefreshToken(email, refreshToken);
            return response_helper_1.ResponseHelper.success({ accessToken, refreshToken }, '토큰 생성에 성공했습니다');
        }
        catch (error) {
            console.error('[createToken] ', error);
            return response_helper_1.ResponseHelper.fail('토큰 생성에 실패했습니다');
        }
    }
    async verifyToken(token) {
        try {
            await this.jwtPort.verifyToken(token);
            return response_helper_1.ResponseHelper.success(true, '유효한 토큰입니다');
        }
        catch {
            console.error('[verifyToken] ', console_1.error);
            return response_helper_1.ResponseHelper.fail('토큰 확인 중 문제가 발생했습니다');
        }
    }
    async reissue(email, refreshToken) {
        try {
            const savedToken = await this.redisPort.getRefreshToken(email);
            if (!savedToken || savedToken !== refreshToken) {
                throw new Error('리프레시 토큰이 일치하지 않습니다.');
            }
            const newAccessToken = await this.jwtPort.signAccessToken({ email });
            return response_helper_1.ResponseHelper.success({ accessToken: newAccessToken, refreshToken }, '액세스 토큰 재발급 성공');
        }
        catch (error) {
            console.error('[reissue]', error);
            return response_helper_1.ResponseHelper.fail('토큰 재발급에 실패했습니다.');
        }
    }
    async getEmailFromToken(token) {
        try {
            const decoded = await this.jwtPort.decodeToken(token);
            return response_helper_1.ResponseHelper.success(decoded, '토큰에서 이메일 추출에 성공했습니다.');
        }
        catch (error) {
            console.error('[getEmailFromToken] ', error);
            return response_helper_1.ResponseHelper.fail('토큰에서 이메일 추출 중 에러가 발생했습니다.');
        }
    }
    async logout(email) {
        try {
            await this.redisPort.deleteRefreshToken(email);
            return response_helper_1.ResponseHelper.success(null, '로그아웃에 성공했습니다.');
        }
        catch (error) {
            console.error('[logout]', error);
            return response_helper_1.ResponseHelper.fail('로그아웃 중 에러가 발생했습니다.');
        }
    }
    async login(loginDto, res) {
        try {
            const user = (await this.userService.getUserInfoByEmail(loginDto)).data;
            if (!user) {
                throw new Error("user가 null 입니다");
            }
            ;
            if (!user.is_email_verified)
                throw new common_1.UnauthorizedException('이메일 인증되지 않음');
            const tokens = await this.createToken(user.u_id, user.email);
            if (!tokens.data) {
                throw new Error('토큰 생성 실패');
            }
            res.cookie('refreshToken', tokens.data.refreshToken, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                path: '/',
                maxAge: 7 * 24 * 60 * 60 * 1000,
            });
            return response_helper_1.ResponseHelper.success({ accessToken: tokens.data.accessToken }, '로그인 성공');
        }
        catch (e) {
            return response_helper_1.ResponseHelper.fail('로그인 실패');
        }
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('RedisPort')),
    __param(1, (0, common_1.Inject)('JwtPort')),
    __metadata("design:paramtypes", [Object, Object, user_service_1.UserService])
], AuthService);
//# sourceMappingURL=auth.service.js.map