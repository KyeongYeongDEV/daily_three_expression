export declare class ResponseHelper {
    static success<T>(data: T, message?: string, statusCode?: number): {
        success: boolean;
        statusCode: number;
        message: string;
        data: T;
    };
    static fail(message?: string, statusCode?: number, data?: any): {
        success: boolean;
        statusCode: number;
        message: string;
        data: any;
    };
}
