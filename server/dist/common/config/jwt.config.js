"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtConfig = void 0;
const jwtConfig = async (configService) => ({
    secret: configService.get('JWT_SECRET') || 'supersecretkey',
    signOptions: {
        expiresIn: '15m',
    },
});
exports.jwtConfig = jwtConfig;
//# sourceMappingURL=jwt.config.js.map