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
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserVerifiedUpdateRequestDto = exports.UserRegisterRequestDto = exports.UserEmailRequestDto = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
class UserEmailRequestDto {
    email;
}
exports.UserEmailRequestDto = UserEmailRequestDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: '이메일 형식이 올바르지 않습니다.' }),
    __metadata("design:type", String)
], UserEmailRequestDto.prototype, "email", void 0);
class UserRegisterRequestDto {
    email;
    is_email_subscribed;
    is_email_verified;
    created_at;
    updated_at;
}
exports.UserRegisterRequestDto = UserRegisterRequestDto;
__decorate([
    (0, class_validator_1.IsEmail)({}, { message: '이메일 형식이 올바르지 않습니다.' }),
    __metadata("design:type", String)
], UserRegisterRequestDto.prototype, "email", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: '이메일 수신 여부는 true/false여야 합니다.' }),
    __metadata("design:type", Boolean)
], UserRegisterRequestDto.prototype, "is_email_subscribed", void 0);
__decorate([
    (0, class_validator_1.IsBoolean)({ message: '이메일 인증 여부는 true/false여야 합니다.' }),
    __metadata("design:type", Boolean)
], UserRegisterRequestDto.prototype, "is_email_verified", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UserRegisterRequestDto.prototype, "created_at", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Date)
], UserRegisterRequestDto.prototype, "updated_at", void 0);
class UserVerifiedUpdateRequestDto {
    u_id;
    verified;
}
exports.UserVerifiedUpdateRequestDto = UserVerifiedUpdateRequestDto;
__decorate([
    (0, class_validator_1.IsInt)({ message: 'u_id는 정수여야 합니다.' }),
    (0, class_validator_1.Min)(1, { message: 'u_id는 1 이상의 값이어야 합니다.' }),
    __metadata("design:type", Number)
], UserVerifiedUpdateRequestDto.prototype, "u_id", void 0);
__decorate([
    (0, class_transformer_1.Transform)(({ value }) => value === 'true' || value === true),
    (0, class_validator_1.IsBoolean)({ message: 'verified는 true 또는 false 값이어야 합니다.' }),
    __metadata("design:type", Boolean)
], UserVerifiedUpdateRequestDto.prototype, "verified", void 0);
//# sourceMappingURL=request.dto.js.map