export class ResponseHelper {
  static success<T>(data: T, message = '요청에 성공했습니다', statusCode = 200) {
    return {
      success: true,
      statusCode,
      message,
      data,
    };
  }

  static fail(message = '요청에 실패했습니다', statusCode = 500, data: any = null) {
    return {
      success: false,
      statusCode,
      message,
      data,
    };
  }
}