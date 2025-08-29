export class ResponseBuilder {
    static success(data, req) {
        const response = {
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
    static error(message, code, details, req) {
        const response = {
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
    static notFound(message = 'Resource not found', req) {
        return this.error(message, 'NOT_FOUND', undefined, req);
    }
    static validationError(message, details, req) {
        return this.error(message, 'VALIDATION_ERROR', details, req);
    }
    static unauthorized(message = 'Unauthorized', req) {
        return this.error(message, 'UNAUTHORIZED', undefined, req);
    }
    static forbidden(message = 'Forbidden', req) {
        return this.error(message, 'FORBIDDEN', undefined, req);
    }
    static internalError(message = 'Internal server error', req) {
        return this.error(message, 'INTERNAL_ERROR', undefined, req);
    }
}
