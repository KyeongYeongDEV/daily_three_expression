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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("./user.service");
const request_dto_1 = require("./dto/request.dto");
let UserController = class UserController {
    userService;
    constructor(userService) {
        this.userService = userService;
    }
    async registerUser(userRegisterRequestDto) {
        return this.userService.registerUser(userRegisterRequestDto);
    }
    async getUserInfoByEmail(userEmailRequestDto) {
        return this.userService.getUserInfoByEmail(userEmailRequestDto);
    }
    async updateEmailVerified(userVerifiedUpdateRequestDto) {
        return this.userService.updateEmailVerified(userVerifiedUpdateRequestDto);
    }
    async updateSubscribeVerified(userVerifiedUpdateRequestDto) {
        return this.userService.updateSubscribeVerified(userVerifiedUpdateRequestDto);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('signup'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_dto_1.UserRegisterRequestDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "registerUser", null);
__decorate([
    (0, common_1.Post)('email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_dto_1.UserEmailRequestDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getUserInfoByEmail", null);
__decorate([
    (0, common_1.Post)('verified/email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_dto_1.UserVerifiedUpdateRequestDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateEmailVerified", null);
__decorate([
    (0, common_1.Post)('verified/subscribe'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [request_dto_1.UserVerifiedUpdateRequestDto]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateSubscribeVerified", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('user'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map