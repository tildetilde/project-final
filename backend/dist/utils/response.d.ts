export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: {
        message: string;
        code?: string;
        details?: any;
    };
    meta?: {
        timestamp: string;
        path: string;
        method: string;
    };
}
export declare class ResponseBuilder {
    static success<T>(data: T, req?: any): ApiResponse<T>;
    static error(message: string, code?: string, details?: any, req?: any): ApiResponse;
    static notFound(message?: string, req?: any): ApiResponse;
    static validationError(message: string, details?: any, req?: any): ApiResponse;
    static unauthorized(message?: string, req?: any): ApiResponse;
    static forbidden(message?: string, req?: any): ApiResponse;
    static internalError(message?: string, req?: any): ApiResponse;
}
//# sourceMappingURL=response.d.ts.map