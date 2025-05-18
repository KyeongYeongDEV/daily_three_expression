"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseHelper = void 0;
class ResponseHelper {
    static success(data, message = '요청에 성공했습니다', statusCode = 200) {
        return {
            success: true,
            statusCode,
            message,
            data,
        };
    }
    static fail(message = '요청에 실패했습니다', statusCode = 500, data = null) {
        return {
            success: false,
            statusCode,
            message,
            data,
        };
    }
}
exports.ResponseHelper = ResponseHelper;
//# sourceMappingURL=response.helper.js.map