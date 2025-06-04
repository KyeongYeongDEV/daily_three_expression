"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RedisConfig = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
exports.RedisConfig = {
    provide: 'REDIS',
    useFactory: () => {
        return new ioredis_1.default({
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT) || 6379,
        });
    },
};
//# sourceMappingURL=redis.config.js.map