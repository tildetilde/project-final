export const errorHandler = (err, req, res, 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
next) => {
    const statusCode = 500;
    const message = err.message || 'Internal Server Error';
    // Log error for debugging
    console.error(`[ErrorHandler] ${message}:`, {
        error: err.message,
        statusCode,
        path: req.originalUrl,
        method: req.method,
        userAgent: req.get('User-Agent'),
        ip: req.ip,
    });
    // Don't leak error details in production
    const errorResponse = {
        success: false,
        error: message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    };
    res.status(statusCode).json(errorResponse);
};
export const notFound = (req, res) => {
    res.status(404).json({
        success: false,
        error: `Route ${req.originalUrl} not found`
    });
};
