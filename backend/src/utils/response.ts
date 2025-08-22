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

export class ResponseBuilder {
  static success<T>(data: T, req?: any): ApiResponse<T> {
    const response: ApiResponse<T> = {
      success: true,
      data,
    };

    if (req) {
      response.meta = {
        timestamp: new Date().toISOString(),
        path: req.originalUrl || req.url,
        method: req.method,
      };
    }

    return response;
  }

  static error(message: string, code?: string, details?: any, req?: any): ApiResponse {
    const response: ApiResponse = {
      success: false,
      error: {
        message,
        code,
        details,
      },
    };

    if (req) {
      response.meta = {
        timestamp: new Date().toISOString(),
        path: req.originalUrl || req.url,
        method: req.method,
      };
    }

    return response;
  }

  static notFound(message: string = 'Resource not found', req?: any): ApiResponse {
    return this.error(message, 'NOT_FOUND', undefined, req);
  }

  static validationError(message: string, details?: any, req?: any): ApiResponse {
    return this.error(message, 'VALIDATION_ERROR', details, req);
  }

  static unauthorized(message: string = 'Unauthorized', req?: any): ApiResponse {
    return this.error(message, 'UNAUTHORIZED', undefined, req);
  }

  static forbidden(message: string = 'Forbidden', req?: any): ApiResponse {
    return this.error(message, 'FORBIDDEN', undefined, req);
  }

  static internalError(message: string = 'Internal server error', req?: any): ApiResponse {
    return this.error(message, 'INTERNAL_ERROR', undefined, req);
  }
}
